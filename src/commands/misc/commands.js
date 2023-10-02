import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";
import emojis from "../../emojis.json" assert { type: 'json' };
export default {
    name: 'commands',
    description: 'Lists all available commands',
    callback: async (client, interaction) => {
        await interaction.deferReply({ephemeral: true});
        const guild = interaction.guild;
        const commandsArray = await guild.commands.fetch();
        const isDev = interaction.member.roles.cache.some(role => role.name === 'Developer' || role.name === 'Senior Moderator' || role.name === 'Head Moderator' || role.name === 'Administrator');

        const filteredCommands = commandsArray.filter(command => 
            !command.devOnly || (command.devOnly && isDev)
        )
        .map(command => ({ name: command.name, description: command.description }))
        .sort((a, b) => a.name.localeCompare(b.name));

        const chunkedCommands = chunkArray(filteredCommands, 20);
        const allEmbeds = createEmbedsFromChunks(chunkedCommands);

        const previous_command_embed_button = new ButtonBuilder()
            .setCustomId('previous_command_embed_button')
            .setLabel('⬅')
            .setStyle('Primary');
        const next_command_embed_button = new ButtonBuilder()
            .setCustomId('next_command_embed_button')
            .setLabel('➡')
            .setStyle('Primary');
        const first_command_embed_button = new ButtonBuilder()
            .setCustomId('first_command_embed_button')
            .setLabel('⬅⬅⬅')
            .setStyle('Primary');
        const last_command_embed_button = new ButtonBuilder()
            .setCustomId('last_command_embed_button')
            .setLabel('➡➡➡')
            .setStyle('Primary');

        const row = new ActionRowBuilder()
            .addComponents(first_command_embed_button, previous_command_embed_button, next_command_embed_button, last_command_embed_button);

        let currentPage = 0;
        await interaction.editReply({ embeds: [allEmbeds[currentPage]], components: [row], ephemeral: true });

        const filter = i => i.customId === 'previous_command_embed_button' || i.customId === 'next_command_embed_button' || i.customId === 'first_command_embed_button' || i.customId === 'last_command_embed_button';
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 600000 }); // 10 minutes timer

        collector.on('collect', async i => {
            if (i.customId === 'previous_command_embed_button' && currentPage > 0) {
                currentPage--;
            } else if (i.customId === 'next_command_embed_button' && currentPage < allEmbeds.length - 1) {
                currentPage++;
            } else if (i.customId === 'first_command_embed_button') {
                currentPage = 0;
            } else if (i.customId === 'last_command_embed_button') {
                currentPage = allEmbeds.length - 1;
            }
            await i.update({ embeds: [allEmbeds[currentPage]], components: [row] });
        });
        
        collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                interaction.editReply({ components: [] }); // Remove the buttons after 10 minutes
            }
        });
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
        const embed = new EmbedBuilder()
            .setTitle(`Available Commands - Page ${index + 1} of ${chunks.length}`)
            .setDescription(`${emojis.whiteDashGlow}${emojis.whiteDashGlow}${emojis.whiteDashGlow}${emojis.whiteDashGlow}${emojis.whiteDashGlow}${emojis.whiteDashGlow}`)
            .setColor([255, 255, 255]);  // White

        chunk.forEach(command => {
            embed.addFields({ name: command.name, value: command.description });
        });
        
        return embed;
    });
}