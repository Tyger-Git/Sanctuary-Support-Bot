const forumIDs = require('../parentThreads.json');
const Ticket = require("../schemas/ticket.js");

module.exports = async function handleThreadCreation(client, ticketData) {
    // Fetch the ticket as a Mongoose model instance
    const ticket = await Ticket.findById(ticketData._id);
    if (!ticket) {
        console.error('Ticket not found in the database.');
        return null;
    }
    // Get the correct parent forum ID based on ticket type
    let parentChannelId;
    switch (ticket.ticketType) {
        case 'reportTicket':
            parentChannelId = forumIDs.PlayerReportForum;
            break;
        case 'contentCreatorInquiryTicket':
            parentChannelId = forumIDs.VIPAppForum;
            break;
        case 'technicalIssueTicket':
            parentChannelId = forumIDs.TechTicketForum;
            break;
        case 'staffReportTicket':
            parentChannelId = forumIDs.StaffReportForum;
            break;
        case 'generalSupportTicket':
            parentChannelId = forumIDs.GeneralSupportForum;
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

    // Create a new thread inside the parent channel
    const thread = await parentChannel.threads.create({
        name: `Ticket-${ticket.ticketId}`,
        message: `Thread created for Ticket ID: ${ticket.ticketId}`,
        autoArchiveDuration: 60,
    });

    if (!thread) {
        console.error('Failed to create the thread.');
        return null;
    }

    // Update the ticket's threadCreated flag in MongoDB
    ticket.threadCreated = true;
    await ticket.save();

    return thread;
}
