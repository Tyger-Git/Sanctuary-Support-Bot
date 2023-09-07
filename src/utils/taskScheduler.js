const dyingTicket = require('../schemas/dyingTicket');
const Ticket = require('../schemas/ticket');
const clientSingleton = require('./DiscordClientInstance');

async function deleteOldThreads() {
    try {
        //const thresholdDate = new Date(Date.now() - (12 * 60 * 60 * 1000)); // 12 hours ago
        const thresholdDate = new Date(Date.now() - (60 * 1000)); // 1 Minute ago (testing)
        // Fetch dying tickets older than 12 hours
        const ticketsToDelete = await dyingTicket.find({ closeDate: { $lt: thresholdDate } });

        // Use client singleton to get the Discord client
        const client = clientSingleton.getClient();

        for (const ticket of ticketsToDelete) {
            // Delete thread from Discord
            const thread = await client.channels.fetch(ticket.ticketThread);
            if (thread) {
                await thread.delete('Scheduled deletion after 12 hours of closure');
            }

            // Update the main ticket
            const mainTicket = await Ticket.findOne({ ticketId: ticket.ticketId });
            if (mainTicket) {
                mainTicket.threadDeleted = true;
                await mainTicket.save();
            }

            // Delete the dying ticket entry
            await dyingTicket.findByIdAndDelete(ticket._id);
        }
    } catch (error) {
        console.error('Error during scheduled task:', error);
    }
}

module.exports = {
    deleteOldThreads
};
