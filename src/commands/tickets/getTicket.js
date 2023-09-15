import { ApplicationCommandOptionType } from 'discord.js';
import modTicket from '../../functions/modTicket.js';
import Ticket from '../../schemas/ticket.js';

export default {
    name: 'getticket',
    description: 'Display a ticket. If no ticket ID is provided, the ticket in the current channel will be displayed.',
    options: [
        {
            name: 'ticket-id',
            description: 'The ID of the ticket you want to test.',
            type: ApplicationCommandOptionType.Number,
            required: false,
        },
    ],
    callback: async (client, interaction) => {
        await interaction.deferReply();

        // Constructing the query dynamically
        let query;

        const providedTicketId = interaction.options.get('ticket-id')?.value;
        if (providedTicketId) {
            query = { ticketId: providedTicketId };
        } else {
            // Assuming the channel in which the command was used is the ticketThread.
            const ticketThread = interaction.channel.id;
            query = { ticketThread: ticketThread };
        }

        try {
            const ticket = await Ticket.findOne(query);
            if (!ticket) {
                await interaction.editReply('No ticket found.');
                return;
            }

            const messageObj = await modTicket(ticket);
            await interaction.editReply(messageObj);
        } catch (err) {
            console.error(err);
            await interaction.editReply('An error occurred while fetching the ticket.');
        }
    }
}