// Function to create a thread called on mongoose stream change listener
const { messageEmbed, ButtonBuilder, EmbedBuilder, ActionRowBuilder } = require('discord.js');
const threadInfo = require('../../threadInformation.json');
const Ticket = require("../../schemas/ticket.js");
const modTicket = require("../../functions/modTicket.js");
const { handleThreadName, getThreadTag, getParentChannelID } = require("../../functions/threadFunctions.js");
const logger = require('../../utils/logger.js');

module.exports = async function handleThreadCreation(client, ticketData) {
    // Fetch the ticket as a Mongoose model instance
    const ticket = await Ticket.findById(ticketData._id);
    if (!ticket) {
        console.error('Ticket not found in the database.');
        return null;
    }
    // Get the correct parent forum ID based on ticket type
    let parentChannelId = await getParentChannelID(ticket);

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

    // Get thread title
    const threadName = await handleThreadName(ticket);
    const threadTag = await getThreadTag(ticket);
    // Create a new thread inside the parent channel
    const thread = await parentChannel.threads.create({
        name: threadName,
        message: 'Thread created for ticket ' + ticket.ticketId + '. Ticket awaiting claim.',
        autoArchiveDuration: 60,
        appliedTags: [threadTag],
    });

    // Async function to memory before sending, store promise to extract message ID
    const messageObj = await modTicket(ticket);
    const sentMessage = await thread.send(messageObj);

    // Update the ticket's info in MongoDB and save
    ticket.threadCreated = true;
    ticket.ticketThread = thread.id;
    ticket.ticketThreadMessage = sentMessage.id;
    await ticket.save();
    
    await logger(ticket.ticketId, 'Event', client.user.id, 'Bot', `Created thread for ticket ${ticket.ticketId}`);
    return thread;
}
