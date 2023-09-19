import { ApplicationCommandOptionType } from 'discord.js';
import {modTicket, ticketList} from '../../functions/modTicket.js';
import Ticket from '../../schemas/ticket.js';
import { ticketErrorMessageObject } from '../../functions/responseFunctions.js';

export default {
    name: 'ticket',
    description: 'Display a ticket. If no options are provided, the ticket in the current channel will be displayed.',
    options: [
        {
            name: 'ticket-id',
            description: 'The ID of the ticket you want to display.',
            type: ApplicationCommandOptionType.Number,
            required: false,
        },
        {
            name: 'user-id',
            description: 'The ID of the user\'s tickets you want to display.',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'mod-id',
            description: 'The ID of the mod\'s tickets you want to display.',
            type: ApplicationCommandOptionType.Number,
            required: false,
        }
    ],
    callback: async (client, interaction) => {
        await interaction.deferReply();

        // Constructing the query dynamically
        let query;

        const providedTicketId = interaction.options.get('ticket-id')?.value;
        const providedUserId = interaction.options.get('user-id')?.value;
        const providedModId = interaction.options.get('mod-id')?.value;
        if (providedTicketId) {
            query = { ticketId: providedTicketId };
        } else if (providedUserId) {
            query = { userId: providedUserId };
        } else if (providedModId) {
            query = { claimantModId: providedModId };
        } else {
            // Assuming the channel in which the command was used is the ticketThread.
            const ticketThread = interaction.channel.id;
            query = { ticketThread: ticketThread };
        }

        if (providedTicketId) {
            let ticket;
            try {
                ticket = await Ticket.findOne(query);
                if (!ticket) {
                    await interaction.editReply(await ticketErrorMessageObject('No ticket found.', true));
                    return;
                }
            } catch (err) {
                console.error(err);
                await interaction.editReply(await ticketErrorMessageObject('An error occurred while fetching the ticket.', true));
            }
            // Construct the ticket
            const messageObj = await modTicket(ticket);
            await interaction.editReply(messageObj);
        } else if (providedUserId || providedModId) {
            // Return a table of contents of tickets
            let tickets;
            try {
                tickets = await Ticket.find(query);
                if (!tickets) {
                    await interaction.editReply(await ticketErrorMessageObject('No tickets found.', true));
                    return;
                }
            } catch (error) {
                console.error(error);
                await interaction.editReply(await ticketErrorMessageObject('An error occurred while fetching the tickets.', true));
            }
            const type = providedUserId ? 'user' : 'mod';
            // Construct the table of contents
            const messageObj = await ticketList(type, tickets);
            await interaction.editReply(messageObj);
        } else {
            let ticket;
            try {
                ticket = await Ticket.findOne(query);
                if (!ticket) {
                    await interaction.editReply(await ticketErrorMessageObject('No ticket found.', true));
                    return;
                }
            } catch (err) {
                console.error(err);
                await interaction.editReply(await ticketErrorMessageObject('An error occurred while fetching the ticket.', true));
            }
            // Construct the ticket
            const messageObj = await modTicket(ticket);
            await interaction.editReply(messageObj);
        }
    }
}