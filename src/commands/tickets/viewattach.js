import Ticket from '../../schemas/ticket.js';
import emojis from '../../emojis.json' assert { type: "json" };
import { EmbedBuilder, ApplicationCommandOptionType, ButtonBuilder, ActionRowBuilder } from 'discord.js';

export default {
    name: 'viewattach',
    description: 'View the attachments of a ticket',
    options: [
        {
            name: 'ticket-id',
            description: 'The ID of the ticket you want to view the attachments of.',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
    ],
    callback: async (client, interaction) => {
        await interaction.deferReply();

        // Get ticket
        let ticket;
        if (interaction.options.get('ticket-id')) {
            ticket = await Ticket.findOne({ ticketId: interaction.options.get('ticket-id').value });
        } else {
            ticket = await Ticket.findOne({ ticketThread: interaction.channelId });
        }
        if (!ticket) return await interaction.editReply(await ticketErrorMessageObject(`Ticket not found.`));

        const chunks = chunkAttachments(ticket.ticketAttachments);
        if (chunks.length === 0) {
            return await interaction.editReply(await ticketActionMessageObject("No attachments found for this ticket."));
        }

        const allEmbeds = chunks.map((chunk, index) => {
            let description = chunk.map((attachment, i) => emojis.redDot + `[Link #${index * chunk.length + i + 1}](${attachment})`).join("\n");
            return new EmbedBuilder()
                .setTitle(`🔗 Ticket Attachments for ticket #${ticket.ticketId} (Page ${index + 1}/${chunks.length}) 🔗`)
                .setDescription(description)
                .setColor([255, 255, 255]);
        });

        // Create Buttons
        const previous_button = new ButtonBuilder()
            .setCustomId('previous_button')
            .setLabel('⬅')
            .setStyle('Primary');
        const next_button = new ButtonBuilder()
            .setCustomId('next_button')
            .setLabel('➡')
            .setStyle('Primary');
        const first_button = new ButtonBuilder()
            .setCustomId('first_button')
            .setLabel('⬅⬅⬅')
            .setStyle('Primary');
        const last_button = new ButtonBuilder()
            .setCustomId('last_button')
            .setLabel('➡➡➡')
            .setStyle('Primary');
        // Create Action Row
        const row = new ActionRowBuilder()
            .addComponents(first_button, previous_button, next_button, last_button);

        let currentPage = 0;
        await interaction.editReply({ embeds: [allEmbeds[currentPage]], components: [row] });

        // Collectors for buttons, and timeout
        const filter = i => i.customId === 'previous_button' || i.customId === 'next_button' || i.customId === 'first_button' || i.customId === 'last_button';
        const msg = await interaction.fetchReply();
        const collector = msg.createMessageComponentCollector({ filter/*, time: 600000 */}); // 10 minutes timer

        collector.on('collect', async interaction => {
            if (interaction.customId === 'previous_button' && currentPage > 0) {
                currentPage--;
            } else if (interaction.customId === 'next_button' && currentPage < allEmbeds.length - 1) {
                currentPage++;
            } else if (interaction.customId === 'first_button') {
                currentPage = 0;
            } else if (interaction.customId === 'last_button') {
                currentPage = allEmbeds.length - 1;
            }
            await interaction.update({ embeds: [allEmbeds[currentPage]], components: [row] });
        });
        
        collector.on('end', () => {
            interaction.fetchReply().then(reply => reply.delete());
        });
    }
}

function chunkAttachments(attachments) {
    let chunks = [];
    let currentChunk = [];
    let currentCharCount = 0;

    for (const attachment of attachments) {
        let entry = emojis.redDot + `[Link #${chunks.length * currentChunk.length + currentChunk.length + 1}](${attachment})` + `\n`;
        currentCharCount += entry.length;

        if (currentCharCount > 3900) {
            chunks.push(currentChunk);
            currentChunk = [];
            currentCharCount = entry.length;
        }

        currentChunk.push(attachment);
    }

    if (currentChunk.length) chunks.push(currentChunk);
    return chunks;
}