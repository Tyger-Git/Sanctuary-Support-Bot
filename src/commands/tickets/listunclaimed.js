import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";
import Ticket from '../../schemas/ticket.js';
import emojis from '../../emojis.json' assert { type: 'json' };

function ticketList(tickets) {
    const embeds = [];
    const MAX_TICKETS_PER_EMBED = 5;  // Adjust as necessary

    for (let i = 0; i < tickets.length; i += MAX_TICKETS_PER_EMBED) {
        const currentTickets = tickets.slice(i, i + MAX_TICKETS_PER_EMBED);

        const embed = new EmbedBuilder()
            .setTitle('Opened and Unclaimed Tickets')
            .setColor('Red')
            .setDescription(currentTickets.map(ticket => {
                const openDateInSeconds = Math.floor(new Date(ticket.openDate).getTime() / 1000); 
                return `Ticket Type: ${ticket.ticketType}\nOpened Date: <t:${openDateInSeconds}:R>\nTicket ID: ${ticket.ticketId}`;
            }).join(`\n${emojis.whiteDashGlow}${emojis.whiteDashGlow}${emojis.whiteDashGlow}${emojis.whiteDashGlow}${emojis.whiteDashGlow}${emojis.whiteDashGlow}\n`));

        embeds.push(embed);
    }

    return embeds;
}

export default {
    name: 'listunclaimed',
    description: 'List all opened and unclaimed tickets',
    devOnly: false,
    callback: async (client, interaction) => {
        await interaction.deferReply();
        try {
            const tickets = await Ticket.find({ isOpen: true, isClaimed: false });
            if (tickets.length === 0) {
                return interaction.editReply('There are no opened and unclaimed tickets.');
            }

            const allEmbeds = ticketList(tickets);

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
            await interaction.editReply({ embeds: [allEmbeds[currentPage]], components: [row] });

            // Set up the collector
            const filter = i => ['previous_button_ticketList', 'next_button_ticketList', 'first_button_ticketList', 'last_button_ticketList'].includes(i.customId);
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
                await interaction.update({ embeds: [allEmbeds[currentPage]], components: [row] });
            });
        } catch (error) {
            console.error(error);
            interaction.editReply('There was an error fetching the tickets.');
        }
    }
};