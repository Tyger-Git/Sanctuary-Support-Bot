const { SlashCommandBuilder, ButtonBuilder, EmbedBuilder, ActionRowBuilder } = require("discord.js");
const fs = require('fs');
const snippets = require("../../snippets.json");

function chunkArray(array, chunkSize) {
    const MAX_CHARS = 5800; // This leaves a little room for titles, descriptions, and other embed components.
    const results = [];

    let currentChunk = [];
    let currentCharCount = 0;

    for (const snippet of snippets) {
        const fieldCharCount = snippet.label.length + snippet.message.length;
        if (currentCharCount + fieldCharCount < MAX_CHARS) {
            currentChunk.push({
                name: snippet.label,
                value: snippet.message
            });
            currentCharCount += fieldCharCount;
        } else {
            results.push(currentChunk);
            currentChunk = [{
                name: snippet.label,
                value: snippet.message
            }];
            currentCharCount = fieldCharCount;
        }
    }

    if (currentChunk.length) {
        results.push(currentChunk);
    }

    return results;
}


function createEmbedsFromChunks(chunks) {
    return chunks.map((chunk, index) => {
        let totalPages = chunks.length;
        const embed = new EmbedBuilder()
            .setColor([255,255,255]) // White
            .setTitle(`Snippets: Page ${index + 1} of ${totalPages}`)
            .setDescription('View all snippets')
            .addFields(chunk)
            .setFooter({text: `\n -- Page ${index + 1} of ${totalPages} --`});
        return embed;
    });
}

module.exports = {
    name: 'viewsnippets',
    description: 'View all snippets',
    devOnly: true,
    callback: async (client, interaction) => {
        try {
            await interaction.deferReply();
        
        const chunkedSnippets = chunkArray(snippets, 20);
        const allEmbeds = createEmbedsFromChunks(chunkedSnippets);

        // Create Buttons
        const previous_button = new ButtonBuilder()
            .setCustomId('previous_button_snippets')
            .setLabel('⬅')
            .setStyle('Primary');
        const next_button = new ButtonBuilder()
            .setCustomId('next_button_snippets')
            .setLabel('➡')
            .setStyle('Primary');
        const first_button_snippets = new ButtonBuilder()
            .setCustomId('first_button_snippets')
            .setLabel('⬅⬅⬅')
            .setStyle('Primary');
        const last_button_snippets = new ButtonBuilder()
            .setCustomId('last_button_snippets')
            .setLabel('➡➡➡')
            .setStyle('Primary');
        
        // Create Action Row
        const row = new ActionRowBuilder()
            .addComponents(first_button_snippets, previous_button, next_button, last_button_snippets);

        let currentPage = 0;

        await interaction.editReply({ embeds: [allEmbeds[currentPage]], components: [row] });

        const filter = i => i.customId === 'previous_button_snippets' || i.customId === 'next_button_snippets' || i.customId === 'first_button_snippets' || i.customId === 'last_button_snippets';
        const msg = await interaction.fetchReply();
        const collector = msg.createMessageComponentCollector({ filter/*, time: 600000*/ }); // 10 minutes timer

        collector.on('collect', async interaction => {
            if (interaction.customId === 'previous_button_snippets' && currentPage > 0) {
                currentPage--;
            } else if (interaction.customId === 'next_button_snippets' && currentPage < allEmbeds.length - 1) {
                currentPage++;
            } else if (interaction.customId === 'first_button_snippets') {
                currentPage = 0;
            } else if (interaction.customId === 'last_button_snippets') {
                currentPage = allEmbeds.length - 1;
            }
            await interaction.update({ embeds: [allEmbeds[currentPage]], components: [row] });
        });
        
        collector.on('end', (collected, reason) => {
            // This will run after the collector has stopped.
            // If you want to delete the message after the collector ends:
            interaction.fetchReply().then(reply => reply.delete());
        });
        } catch (error) {
            console.log(error);
        }
    }
}
