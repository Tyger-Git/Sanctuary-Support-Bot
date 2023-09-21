// This command is used to view all snippets, in an embed book format
/*--- DEV ONLY ---*/

import { ButtonBuilder, EmbedBuilder, ActionRowBuilder } from 'discord.js';
import Snippet from '../../schemas/snippet.js';

export default {
    name: 'viewsnippets',
    description: 'View all snippets',
    devOnly: true,
    callback: async (client, interaction) => {
        //await interaction.deferReply({ ephemeral: true });
        await interaction.deferReply();
        let snippets = [];
        try {
            snippets = await fetchAllSnippets();
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

            //await interaction.editReply({ embeds: [allEmbeds[currentPage]], components: [row], ephemeral: true });
            await interaction.editReply({ embeds: [allEmbeds[currentPage]], components: [row] });

            const filter = i => i.customId === 'previous_button_snippets' || i.customId === 'next_button_snippets' || i.customId === 'first_button_snippets' || i.customId === 'last_button_snippets';
            const msg = await interaction.fetchReply();
            const collector = msg.createMessageComponentCollector({ filter, time: 600000 }); // 10 minutes timer

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
                //await interaction.update({ embeds: [allEmbeds[currentPage]], components: [row], ephemeral: true });
                await interaction.update({ embeds: [allEmbeds[currentPage]], components: [row] });
            });
            
            collector.on('end', (collected, reason) => {
                interaction.fetchReply().then(reply => reply.delete());
            });

            } catch (error) {
                console.log("Error using viewsnippets " + error);
            }
    }
}

/*------------------------------------------------------------------------------------------------------------------------*/
// Helper Functions
/*------------------------------------------------------------------------------------------------------------------------*/
async function fetchAllSnippets() {
    try {
        return await Snippet.find({});
    } catch (error) {
        console.log("Failed to fetch snippets: " + error);
        return [];
    }
}

function chunkArray(array, chunkSize) {
    const results = [];
    while (array.length) {
        results.push(array.splice(0, chunkSize));
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
            .addFields(chunk.map(snippet => ({name: snippet.snippetName, value: snippet.snippetContent})))
            .setFooter({text: `\n -- Page ${index + 1} of ${totalPages} --`});
        return embed;
    });
}

