// Invoked when a ticket is escalated to a different forum

import {  EmbedBuilder } from 'discord.js';
import { modTicket } from "../../functions/modTicket.js";
import { handleThreadName, getThreadTag, getParentChannelID } from "../../functions/threadFunctions.js";
import clientSingleton from "../../utils/DiscordClientInstance.js";

const handleThreadReCreation = async (interaction, ticket, escalatorId) => {
    // Get the correct parent forum ID based on ticket type
    let parentChannelId = await getParentChannelID(ticket);
    const client = clientSingleton.getClient();
    // Fetch the parent channel using the Discord.js client
    let parentChannel;
    try {
        parentChannel = await client.channels.fetch(parentChannelId);
    } catch (error) {
        winston.error('Error fetching parent channel:', error);
        return null;
    }
    
    if (!parentChannel || parentChannel.type !== 15) {
        winston.error('Parent channel not found or not a text channel.');
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

    // Send a message noting that the thread was re-created, and to see logs for more information
    const escalator = await client.users.fetch(escalatorId);
    const escalationMessageEmbed = new EmbedBuilder()
        .setTitle('Ticket Escalated')
        .setDescription(`This ticket was escalated to **${parentChannel.name}** by user **${escalator.username}**.`)
        .setColor([255,255,225]) // White
    await thread.send({embeds: [escalationMessageEmbed]});
    
    return thread;
}

export default handleThreadReCreation;