import DyingTicketModel from '../schemas/dyingTicket.js';
import Ticket from '../schemas/ticket.js';
import clientSingleton from '../utils/DiscordClientInstance.js';
import logger from './logger.js';

async function deleteOldThreads() {
    try {
        // Fetch all the dying tickets that have a valid closeTimer
        const allDyingTickets = await DyingTicketModel.find({
            closeTimer: { $exists: true, $ne: null }
        });
        console.log('Found', allDyingTickets.length, 'dying tickets');
        const now = Date.now();
        console.log('Checking for threads to delete...');
        // Filter the tickets that are due for deletion based on their closeTimer
        const ticketsToDelete = allDyingTickets.filter(ticket => {
            const closeTimer = (ticket.closeTimer && !isNaN(parseFloat(ticket.closeTimer))) ? parseFloat(ticket.closeTimer) : 0.5;
            const thresholdDate = ticket.closeDate.getTime() + (closeTimer * 60 * 60 * 1000);
            return now > thresholdDate;
        });
        console.log('Found', ticketsToDelete.length, 'threads to delete');
        // Use client singleton to get the Discord client
        const client = clientSingleton.getClient();
        // Loop through the tickets to delete
        for (const ticket of ticketsToDelete) {
            // Delete thread from Discord
            const thread = await client.channels.fetch(ticket.ticketThread);
            if (thread && ticket.closeTimer > 0) {
                await thread.delete('Scheduled deletion after ' + ticket.closeTimer + ' hours of closure');
            } else if (thread && parseInt(ticket.closeTimer) === 0) {
                await thread.delete('Scheduled deletion immediately after closure');
            }

            // Update the main ticket
            const mainTicket = await Ticket.findOne({ ticketId: ticket.ticketId });
            if (mainTicket) {
                mainTicket.threadDeleted = true;
                await mainTicket.save();
            }

            // Delete the dying ticket entry
            await DyingTicketModel.findByIdAndDelete(ticket._id);
            console.log('Deleted thread for ticket', mainTicket.ticketId);
            await logger(mainTicket.ticketId, 'Event', client.user.id, 'Bot', `Deleted thread for ticket ${mainTicket.ticketId}`);
        }
        console.log('Done deleting threads');
    } catch (error) {
        console.error('Error during scheduled task:', error);
    }
}

async function pingAlerts() {

}
export {
    deleteOldThreads,
    pingAlerts
};
