// This command is used to refresh a ticket embed

import Ticket from "../../schemas/ticket.js";
import { handleTicketMessageUpdate } from "../../functions/threadFunctions.js";
import logger from "../../utils/logger.js";

export default {
    name: 'refresh',
    description: 'Refresh a ticket.',
    callback: async (client, interaction) => {
        await interaction.deferReply();
        const threadId = interaction.channel.id;
        // Find the ticket in MongoDB
        let ticket;
        try {
            ticket = await Ticket.findOne({ ticketThread: threadId });
        } catch (error) {
            winston.error('Error finding ticket:', error);
        }
        if (!ticket) {
            await interaction.editReply(await ticketErrorMessageObject('Ticket not found', true));
            return; 
        }
        await handleTicketMessageUpdate(ticket);
        await logger(ticket.ticketId, 'Event', interaction.user.id, interaction.user.username, 'Staff', 'Ticket refreshed.');
        await interaction.editReply(await ticketActionMessageObject(`Ticket Refreshed`, true));
    }
}