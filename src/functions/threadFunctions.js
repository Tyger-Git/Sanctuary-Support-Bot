const modTicket = require('./modTicket.js');
const clientSingleton = require('../utils/DiscordClientInstance.js');
const emojis = require('../emojis.json');
const threadInfo = require('../threadInformation.json');
const Ticket = require('../schemas/ticket.js');
const DyingTicket = require('../schemas/dyingTicket.js');

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
    // Check if the thread exists and is not partial
    if (!thread || thread.partial) {
        console.error('Thread not found or partial.');
        return;
    }
    try {
        // Fetch the message
        const message = await thread.messages.fetch(messageId);
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
    if (!ticket.isOpen) {
        statusEmoji = emojis.closedTicket;
    }
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
    let threadClosingTag;
    switch (ticket.ticketType) {
        case 'Player Report':
            threadClaimedTag = threadInfo.PlayerReportForumClaimedTag;
            threadUnclaimedTag = threadInfo.PlayerReportForumUnclaimedTag;
            threadClosingTag = threadInfo.PlayerReportForumClosingTag;
            break;
        case 'VIP Application':
            threadClaimedTag = threadInfo.VIPAppForumClaimedTag;
            threadUnclaimedTag = threadInfo.VIPAppForumUnclaimedTag;
            threadClosingTag = threadInfo.VIPAppForumClosingTag;
            break;
        case 'Technical Support':
            threadClaimedTag = threadInfo.TechTicketForumClaimedTag;
            threadUnclaimedTag = threadInfo.TechTicketForumUnclaimedTag;
            threadClosingTag = threadInfo.TechTicketForumClosingTag;
            break;
        case 'Staff Report':
            threadClaimedTag = threadInfo.StaffReportForumClaimedTag;
            threadUnclaimedTag = threadInfo.StaffReportForumUnclaimedTag;
            threadClosingTag = threadInfo.StaffReportForumClosingTag;
            break;
        case 'General Support':
            threadClaimedTag = threadInfo.GeneralSupportForumClaimedTag;
            threadUnclaimedTag = threadInfo.GeneralSupportForumUnclaimedTag;
            threadClosingTag = threadInfo.GeneralSupportForumClosingTag;
            break;
        default:
            console.error('Error getting thread tag.');
            return null;
    }
    let tag;
    if (!ticket.isOpen) {
        tag = threadClosingTag;
    } else {
        tag = ticket.isClaimed ? threadClaimedTag : threadUnclaimedTag;
    }
    return tag;
}

async function closeThread(interaction) {
    const threadId = interaction.channel.id;
    const thread = interaction.channel;
    const closeTimer = interaction.fields.getTextInputValue('closeTimer');
    const modNotes = interaction.fields.getTextInputValue('modNotes');
    try {
        const ticket = await Ticket.findOne({ ticketThread: threadId });
        // Update the ticket's info in MongoDB and save
        ticket.isOpen = false;
        ticket.isArchiving = true;
        ticket.closeDate = new Date();
        ticket.modNotes = modNotes;
        ticket.closeTimer = closeTimer;
        await ticket.save();

        // Update the ticket embed
        await handleTicketMessageUpdate(ticket);

        // Create a new dying ticket entry
        const dyingTicket = new DyingTicket({
            ticketId: ticket.ticketId,  // Assuming ticket has a unique _id field
            ticketThread: ticket.ticketThread,
            closeDate: ticket.closeDate,
            closeTimer: ticket.closeTimer
        });
        await dyingTicket.save();

        // Get the thread and edit the thread name
        const newThreadName = await handleThreadName(ticket);
        const threadTag = await getThreadTag(ticket);
        await thread.edit({
            name: newThreadName,
            appliedTags: [threadTag],
        });

        //Update Ticket Message
        await handleTicketMessageUpdate(ticket);

        // Reply to the interaction
        if (closeTimer === 0) {
            await interaction.reply({ content: "Ticket Closed...Thread scheduled for deletion immediately."});
        } else {
            await interaction.reply({ content: "Ticket Closed...Thread scheduled for deletion in " + closeTimer + " hours."});
        }
    } catch (error) {
        console.error('Error closing ticket:', error);
    }
}

module.exports = {
    handleTicketMessageUpdate,
    handleThreadName,
    getThreadTag,
    getParentChannelID,
    closeThread
}