// Function to create a thread called on mongoose stream change listener
const { messageEmbed, ButtonBuilder, EmbedBuilder, ActionRowBuilder } = require('discord.js');
const threadInfo = require('../../threadInformation.json');
const Ticket = require("../../schemas/ticket.js");
const emojis = require("../../emojis.json");
const modTicket = require("../../functions/modTicket.js");

module.exports = async function handleThreadCreation(client, ticketData) {
    // Fetch the ticket as a Mongoose model instance
    const ticket = await Ticket.findById(ticketData._id);
    if (!ticket) {
        console.error('Ticket not found in the database.');
        return null;
    }
    // Get the correct parent forum ID based on ticket type
    let parentChannelId;
    let threadEmoji;
    let threadUnclaimedTag;
    switch (ticket.ticketType) {
        case 'Player Report':
            parentChannelId = threadInfo.PlayerReportForum;
            threadEmoji = emojis.reportEmoji;
            threadUnclaimedTag = threadInfo.PlayerReportForumUnclaimedTag;
            break;
        case 'VIP Application':
            parentChannelId = threadInfo.VIPAppForum;
            threadEmoji = emojis.creatorEmoji;
            threadUnclaimedTag = threadInfo.VIPAppForumUnclaimedTag;
            break;
        case 'Technical Support':
            parentChannelId = threadInfo.TechTicketForum;
            threadEmoji = emojis.techEmoji;
            threadUnclaimedTag = threadInfo.TechTicketForumUnclaimedTag;
            break;
        case 'Staff Report':
            parentChannelId = threadInfo.StaffReportForum;
            threadEmoji = emojis.staffReportEmoji;
            threadUnclaimedTag = threadInfo.StaffReportForumUnclaimedTag;
            break;
        case 'General Support':
            parentChannelId = threadInfo.GeneralSupportForum;
            threadEmoji = emojis.generalEmoji;
            threadUnclaimedTag = threadInfo.GeneralSupportForumUnclaimedTag;
            break;
        default:
            console.error('Unsupported ticket type.');
            return null;
    }

    // Fetch the parent channel using the Discord.js client
    let parentChannel;
    try {
        parentChannel = await client.channels.fetch(parentChannelId);
    } catch (error) {
        console.error('Error fetching parent channel:', error);
        return null;
    }
    
    if (!parentChannel || parentChannel.type !== 15) {
        console.error('Parent channel not found or not a text channel.');
        return null;
    }

    // Set thread title color based on ticket status
    let statusEmoji = ticket.isClaimed ? emojis.claimedTicket : emojis.unclaimedTicket;

    // Create a new thread inside the parent channel
    const thread = await parentChannel.threads.create({
        //name: `${statusEmoji} | ${threadEmoji} | ${ticket.userName} | #${ticket.ticketId}`, // Thread Emoji not working in thread title.
        name: `${statusEmoji} | ${ticket.userName} | #${ticket.ticketId}`,
        message: `${ticket.ticketId}`,
        autoArchiveDuration: 60,
        appliedTags: [threadUnclaimedTag],
    });

    // Update the ticket's threadCreated flag in MongoDB
    ticket.threadCreated = true;
    ticket.ticketThread = thread.id;
    await ticket.save();

    await thread.send('Thread created for ticket ' + ticket.ticketId + '. Ticket awaiting claim.');

    // this is where threadHandler.js would be called

    //Testing async bug
    const messageObj = await modTicket(ticket);
    await thread.send(messageObj); 

    /*
    await thread.edit({
        appliedTags: [],
    });
    */
    return thread;
}
