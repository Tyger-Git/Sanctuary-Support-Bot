const modTicket = require('./modTicket.js');
const clientSingleton = require('../utils/DiscordClientInstance.js');
const emojis = require('../emojis.json');
const threadInfo = require('../threadInformation.json');
const { MessageManager } = require('discord.js');

async function handleTicketMessageUpdate(ticket) {
    // Get the Discord client
    const client = clientSingleton.getClient();
    // Get the thread ID and message ID from the ticket
    const threadId = ticket.ticketThread;
    const messageId = ticket.ticketThreadMessage;
    // Fetch the thread
    const parentChannelID = await getParentChannelID(ticket);
    const parentChannel = await client.channels.fetch(parentChannelID);
    const thread = await parentChannel.threads.fetch(threadId);
    //const thread = await parentChannel.threads.fetch(threadId);
    console.log(thread);
    if (!thread || thread.partial) {
        console.error('Thread not found or partial.');
        return;
    }
    try {
        const message = await thread.messages.fetch(messageId);
        //const message = await thread.messages.fetch({id : messageId});
        // Modify the message
        const messageObject = await modTicket(ticket);
        await message.edit(messageObject);
    } catch (error) {
        console.error('Error modifying ticket thread message:', error);
    }
};

async function handleThreadName(ticket) {
    // Set thread emoji based on ticket status
    let statusEmoji = ticket.isClaimed ? emojis.claimedTicket : emojis.unclaimedTicket;
    const name = `${statusEmoji} | ${ticket.userDisplayName} (${ticket.userName}) | #${ticket.ticketId}`;
    
    return name;
}

async function getParentChannelID(ticket) {
    // Get the correct parent forum ID based on ticket type
    let parentChannelId;
    switch (ticket.ticketType) {
        case 'Player Report':
            parentChannelId = threadInfo.PlayerReportForum;
            break;
        case 'VIP Application':
            parentChannelId = threadInfo.VIPAppForum;
            break;
        case 'Technical Support':
            parentChannelId = threadInfo.TechTicketForum;
            break;
        case 'Staff Report':
            parentChannelId = threadInfo.StaffReportForum;
            break;
        case 'General Support':
            parentChannelId = threadInfo.GeneralSupportForum;
            break;
        default:
            console.error('Issue getting parent channel ID.');
            return null;
    }
    return parentChannelId;
}

async function getThreadTag(ticket) {
    let threadClaimedTag;
    let threadUnclaimedTag;
    switch (ticket.ticketType) {
        case 'Player Report':
            threadClaimedTag = threadInfo.PlayerReportForumClaimedTag;
            threadUnclaimedTag = threadInfo.PlayerReportForumUnclaimedTag;
            break;
        case 'VIP Application':
            threadClaimedTag = threadInfo.VIPAppForumClaimedTag;
            threadUnclaimedTag = threadInfo.VIPAppForumUnclaimedTag;
            break;
        case 'Technical Support':
            threadClaimedTag = threadInfo.TechTicketForumClaimedTag;
            threadUnclaimedTag = threadInfo.TechTicketForumUnclaimedTag;
            break;
        case 'Staff Report':
            threadClaimedTag = threadInfo.StaffReportForumClaimedTag;
            threadUnclaimedTag = threadInfo.StaffReportForumUnclaimedTag;
            break;
        case 'General Support':
            threadClaimedTag = threadInfo.GeneralSupportForumClaimedTag;
            threadUnclaimedTag = threadInfo.GeneralSupportForumUnclaimedTag;
            break;
        default:
            console.error('Error getting thread tag.');
            return null;
    }
    return ticket.isClaimed ? threadClaimedTag : threadUnclaimedTag;
}

module.exports = {
    handleTicketMessageUpdate,
    handleThreadName,
    getThreadTag,
    getParentChannelID
}