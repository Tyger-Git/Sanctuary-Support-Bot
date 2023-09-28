import Log from '../schemas/log.js';
import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from 'discord.js';
import emojis from '../emojis.json' assert { type: "json" };
import threadInformation from '../threadInformation.json' assert { type: "json" };
import clientSingleton from '../utils/DiscordClientInstance.js';


async function shortLogs(interaction, ticket) {
    const logs = await Log.find({ ticketId: ticket.ticketId, messageType: 'Primary' });
    
    let emojiMap = new Map();
        emojiMap.set('User', emojis.user);
        emojiMap.set('Staff', emojis.staff);
    
    let ticketLogs = logs.map(log => `**${emojis.whiteDashGlow}${emojis.whiteDashGlow}${emojis.whiteDashGlow}\n${emojiMap.get(log.classType)} - ${log.userName} - ${formatDate(log.timeStamp)}**\n${log.logMessage}`);
    const logCounter = logs.length;
    const chunkedLogs = chunkArray(ticketLogs, 5); // This assumes around 800 characters per log. Adjust the chunk size accordingly.
    const allEmbeds = createEmbedsFromChunks(chunkedLogs, logCounter, ticket.ticketId);
    
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
    const long_logs_button = new ButtonBuilder()
        .setCustomId('long_logs_button')
        .setLabel('View Full Logs')
        .setStyle('Success');
    // Create Action Row
    const row = new ActionRowBuilder()
        .addComponents(first_button, previous_button, long_logs_button, next_button, last_button);

    let currentPage = 0;
    await interaction.editReply({ embeds: [allEmbeds[currentPage]], components: [row] });

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
    
    collector.on('end', (collected, reason) => {
        interaction.fetchReply().then(reply => reply.delete());
    });
}

const longLogs = async (interaction, ticket) => {
    const logs = await Log.find({ ticketId: ticket.ticketId });
    
    let emojiMap = new Map();
        emojiMap.set('User', emojis.user);
        emojiMap.set('Staff', emojis.staff);
        emojiMap.set('Bot', emojis.bot);
    
    let ticketLogs = logs.map(log => `**${emojis.whiteDashGlow}${emojis.whiteDashGlow}${emojis.whiteDashGlow}\n${emojiMap.get(log.classType)} - ${formatDate(log.timeStamp)}**\n${log.logMessage}`);
    const logCounter = logs.length;
    const chunkedLogs = chunkArray(ticketLogs, 5); // This assumes around 800 characters per log. Adjust the chunk size accordingly.
    const allEmbeds = createEmbedsFromChunks(chunkedLogs, logCounter, ticket.ticketId);
    
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
    const popout_logs_button = new ButtonBuilder()
        .setCustomId('popout_logs_button')
        .setLabel('View Logs Popped Out')
        .setStyle('Success');
    // Create Action Row
    const row = new ActionRowBuilder()
        .addComponents(first_button, previous_button, popout_logs_button, next_button, last_button);

    let currentPage = 0;
    await interaction.editReply({ embeds: [allEmbeds[currentPage]], components: [row] });

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
    
    collector.on('end', (collected, reason) => {
        interaction.fetchReply().then(reply => reply.delete());
    });
};

async function popoutLogs(interaction, ticket) {
    const logs = await Log.find({ ticketId: ticket.ticketId });
    
    let emojiMap = new Map();
        emojiMap.set('User', emojis.user);
        emojiMap.set('Staff', emojis.staff);
        emojiMap.set('Bot', emojis.bot);

    let ticketLogs = logs.map(log => `**${emojis.whiteDashGlow}${emojis.whiteDashGlow}${emojis.whiteDashGlow}\n${emojiMap.get(log.classType)} - ${formatDate(log.timeStamp)}**\n${log.logMessage}`);
    const logCounter = logs.length;
    const chunkedLogs = chunkArray(ticketLogs, 5);
    // Get the bot spam channel
    const client = clientSingleton.getClient();
    const thread = await client.channels.fetch(threadInformation.BotSpamChannel);
    await interaction.editReply(`Sent the logs to <#${threadInformation.BotSpamChannel}>!`);
    await thread.send({content: `📜 Ticket Logs #${ticket.ticketId} - Total Entries: ${logCounter} 📜`, ephemeral: true});
    chunkedLogs.forEach(async chunk => {
        await thread.send({content: chunk.join('\n'), ephemeral: true});
    });
}

function chunkArray(array, chunkSize) {
    const results = [];
    while (array.length) {
        results.push(array.splice(0, chunkSize));
    }
    return results;
}

function createEmbedsFromChunks(chunks, logCounter, ticketId) {
    return chunks.map((chunk, index) => {
        let totalPages = chunks.length;
        const embed = new EmbedBuilder()
            .setColor([255, 255, 255]) // White
            .setTitle(`📜 Ticket Logs #${ticketId} - Total Entries: ${logCounter} 📜`)
            .setDescription(chunk.join('\n'))
            .setFooter({ text: `\n -- Page ${index + 1} of ${totalPages} --` });
        return embed;
    });
}

function formatDate(date) {
    // Check if the date is valid
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
        return `*Ticket Unresolved*`;
    }
    // Get the day, month, and year
    const day = String(date.getDate()).padStart(2, `0`);
    const month = String(date.getMonth() + 1).padStart(2, `0`); // Months are 0-based
    const year = String(date.getFullYear()).slice(-2); // Last two digits of the year

    // Get the hours and minutes
    const hours = String(date.getHours()).padStart(2, `0`);
    const minutes = String(date.getMinutes()).padStart(2, `0`);

    // Return the formatted string
    return `${month}/${day}/${year} - ${hours}:${minutes}`;
}

export {
    shortLogs,
    longLogs,
    popoutLogs
}