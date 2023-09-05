// Function to create a thread called on mongoose stream change listener

const forumIDs = require('../../parentThreads.json');
const Ticket = require("../../schemas/ticket.js");

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
    switch (ticket.ticketType) {
        case 'reportTicket':
            parentChannelId = forumIDs.PlayerReportForum;
            threadEmoji = '<:icon_report:1140779824793788486>';
            break;
        case 'contentCreatorInquiryTicket':
            parentChannelId = forumIDs.VIPAppForum;
            threadEmoji = '<:icon_vip2:1140799537942900799>';
            break;
        case 'technicalIssueTicket':
            parentChannelId = forumIDs.TechTicketForum;
            threadEmoji = '<:icon_tech2:1140800254141268018>';
            break;
        case 'staffReportTicket':
            parentChannelId = forumIDs.StaffReportForum;
            threadEmoji = '<:icon_report:1140779824793788486>';
            break;
        case 'generalSupportTicket':
            parentChannelId = forumIDs.GeneralSupportForum;
            threadEmoji = '<:icon_general2:1140799531496263700>';
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
    let claimedEmoji = '';
    if (ticket.isClaimed) {
        claimedEmoji = '🟢';
    } else {
        claimedEmoji = '🔴';
    }

    // Create a new thread inside the parent channel
    const thread = await parentChannel.threads.create({
        name: `${claimedEmoji} | ${threadEmoji} | ${ticket.userName} | #${ticket.ticketId}`,
        message: `${ticket.ticketId}`,
        autoArchiveDuration: 60,
        appliedTags: ['1145806104652161024', '1145806151770972270'],
    });

    // Update the ticket's threadCreated flag in MongoDB
    ticket.threadCreated = true;
    // threadID to be added to ticket object ***
    await ticket.save();

    await thread.send('Thread created!');

    // To be removed - Reference for future development
    await thread.edit({
        appliedTags: ['1145806104652161024'],
    });

    return thread;
}
