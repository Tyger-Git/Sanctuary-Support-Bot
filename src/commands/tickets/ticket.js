// This command is used to display a ticket, or list of tickets based off input

import { ApplicationCommandOptionType, ButtonBuilder, ActionRowBuilder } from 'discord.js';
import {modTicket, ticketList} from '../../functions/modTicket.js';
import Ticket from '../../schemas/ticket.js';
import { ticketErrorMessageObject } from '../../functions/responseFunctions.js';
import { checkPerms } from '../../functions/permissions.js';

export default {
    name: 'ticket',
    description: 'Display a ticket. If no options are provided, the ticket in the current channel will be displayed.',
    options: [
        {
            name: 'ticket-id',
            description: 'The ID of the ticket you want to display.',
            type: ApplicationCommandOptionType.String,
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
            type: ApplicationCommandOptionType.String,
            required: false,
        }
    ],
    callback: async (client, interaction) => {
        await interaction.deferReply();

        // Constructing the query dynamically
        let query;
        // Add lot's of checks
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
                winston.error(err);
                await interaction.editReply(await ticketErrorMessageObject('An error occurred while fetching the ticket.', true));
            }
            if (await checkPerms(interaction, ticket.ticketLevel)) {
                // Construct the ticket
                const messageObj = await modTicket(ticket);
                await interaction.editReply(messageObj);
            } else {
                await interaction.editReply(await ticketErrorMessageObject('You do not have permission to view this ticket.', true));
            }
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
                winston.error(error);
                await interaction.editReply(await ticketErrorMessageObject('An error occurred while fetching the tickets.', true));
            }
            const type = providedUserId ? 'user' : 'mod';
            const id = providedUserId || providedModId;
            // Construct the table of contents
            const allEmbeds = await ticketList(id, type, tickets, interaction);
            // Create Buttons
            const previous_button_ticketList = new ButtonBuilder()
                .setCustomId('previous_button_ticketList')
                .setLabel('⬅')
                .setStyle('Primary');
            const next_button_ticketList = new ButtonBuilder()
                .setCustomId('next_button_ticketList')
                .setLabel('➡')
                .setStyle('Primary');
            const first_button_ticketList = new ButtonBuilder()
                .setCustomId('first_button_ticketList')
                .setLabel('⬅⬅⬅')
                .setStyle('Primary');
            const last_button_ticketList = new ButtonBuilder()
                .setCustomId('last_button_ticketList')
                .setLabel('➡➡➡')
                .setStyle('Primary');

            const row = new ActionRowBuilder()
                .addComponents(first_button_ticketList, previous_button_ticketList, next_button_ticketList, last_button_ticketList);

            let currentPage = 0;
            await interaction.editReply({ embeds: [allEmbeds[currentPage]], components: [row], files: [{attachment: './resources/1px.png', name: '1px.png'}] });
            // Set up the collector
            const filter = i => i.customId === 'previous_button_ticketList' || i.customId === 'next_button_ticketList' || i.customId === 'first_button_ticketList' || i.customId === 'last_button_ticketList';
            const msg = await interaction.fetchReply();
            const collector = msg.createMessageComponentCollector({ filter, time: 600000 }); // 10 minutes timer

            collector.on('collect', async interaction => {
                if (interaction.customId === 'previous_button_ticketList' && currentPage > 0) {
                    currentPage--;
                } else if (interaction.customId === 'next_button_ticketList' && currentPage < allEmbeds.length - 1) {
                    currentPage++;
                } else if (interaction.customId === 'first_button_ticketList') {
                    currentPage = 0;
                } else if (interaction.customId === 'last_button_ticketList') {
                    currentPage = allEmbeds.length - 1;
                }
                await interaction.update({ embeds: [allEmbeds[currentPage]], components: [row], files: [{attachment: './resources/1px.png', name: '1px.png'}]  });
            });
            
            collector.on('end', (collected, reason) => {
                // This will run after the collector has stopped.
                // If you want to delete the message after the collector ends:
                interaction.fetchReply().then(reply => reply.delete());
            });
        } else {
            let ticket;
            try {
                ticket = await Ticket.findOne(query);
                if (!ticket) {
                    await interaction.editReply(await ticketErrorMessageObject('No ticket found.', true));
                    return;
                }
            } catch (error) {
                winston.error(error);
                await interaction.editReply(await ticketErrorMessageObject('An error occurred while fetching the ticket.', true));
            }
            // Construct the ticket
            const messageObj = await modTicket(ticket);
            await interaction.editReply(messageObj);
        }
    }
}