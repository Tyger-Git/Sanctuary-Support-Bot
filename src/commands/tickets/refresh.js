// This command is used to refresh a ticket embed

import Ticket from "../../schemas/ticket.js";
import { handleTicketMessageUpdate } from "../../functions/threadFunctions.js";

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
            console.error('Error finding ticket:', error);
        }
        if (!ticket) {
            await interaction.editReply(await ticketErrorMessageObject('Ticket not found', true));
            return; 
        }
        await handleTicketMessageUpdate(ticket);
        await interaction.editReply(await ticketActionMessageObject(`Ticket Refreshed`, true));
    }
}