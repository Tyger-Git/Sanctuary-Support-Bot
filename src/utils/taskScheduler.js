import DyingTicketModel from '../schemas/dyingTicket.js';
import Ticket from '../schemas/ticket.js';
import clientSingleton from '../utils/DiscordClientInstance.js';
import logger from './logger.js';

async function fetchAndDeleteThread(ticket, client) {
    try {
        const thread = await client.channels.fetch(ticket.ticketThread);
        if (ticket.closeTimer > 0) {
            await thread.delete('Scheduled deletion after ' + ticket.closeTimer + ' hours of closure');
        } else if (parseInt(ticket.closeTimer) === 0) {
            await thread.delete('Scheduled deletion immediately after closure');
        }
        return true;
    } catch (error) {
        if (error.code === 10008) { // "Unknown Channel"
            console.warn(`Thread with ID ${ticket.ticketThread} not found.`);
            return false;
        } else {
            winston.error('An error occurred fetching the thread:', error);
            throw error; // This will halt the current operation and jump to the catch block in deleteOldThreads
        }
    }
}

async function deleteOldThreads() {
    try {
        const allDyingTickets = await DyingTicketModel.find({
            closeTimer: { $exists: true, $ne: null }
        });

        winston.debug(`Found ${allDyingTickets.length} dying tickets`);
        const now = Date.now();
        const ticketsToDelete = allDyingTickets.filter(ticket => {
            const closeTimer = parseFloat(ticket.closeTimer) || 0.5;
            const thresholdDate = ticket.closeDate.getTime() + (closeTimer * 60 * 60 * 1000);
            return now > thresholdDate;
        });

        winston.debug(`Found ${ticketsToDelete.length} threads to delete`);

        const client = clientSingleton.getClient();

        for (const ticket of ticketsToDelete) {
            const isThreadDeleted = await fetchAndDeleteThread(ticket, client);
            
            const mainTicket = await Ticket.findOne({ ticketId: ticket.ticketId });
            mainTicket.threadDeleted = true;
            await mainTicket.save();
            
            if (!isThreadDeleted || (mainTicket && mainTicket.threadDeleted)) {
                await DyingTicketModel.findByIdAndDelete(ticket._id);
                winston.info(`Deleted DyingTicketModel entry for ticket ID ${ticket.ticketId}`);
            } else {
                winston.error(`Check ticket DB for ticket ID ${ticket.ticketId}. Imbalance in dying tickets.`);
            }

            await logger(mainTicket.ticketId, 'Event', client.user.id, client.user.username, 'Bot', `Deleted thread for ticket ${mainTicket.ticketId}`);
        }

        winston.debug('Done deleting threads');

    } catch (error) {
        winston.error('Error during scheduled task:', error);
    }
}

export {
    deleteOldThreads
};
