import Ticket from '../../schemas/ticket.js';
import clientSingleton from '../../utils/DiscordClientInstance.js';
import config from '../../../config.json' assert { type: 'json' };
import { EmbedBuilder } from "discord.js";
import logger from '../../utils/logger.js';

const incomingDirectMessage = async (message) => {
    console.log(`Got DM from ${message.author.tag}`);

    // Check if the user has an open ticket
    const ticket = await Ticket.findOne({ userId: message.author.id, isOpen: true });
    if (ticket) {
        // Use the client singleton to get the Discord client
        const client = clientSingleton.getClient();
        // Fetch the associated thread using the stored ticketThread ID
        const thread = await client.channels.fetch(ticket.ticketThread);
        // Spin up an embed to send to the thread
        let modToPing = '';
        const embed = new EmbedBuilder();
        if (thread) {
            embed
                .setTitle(`${ticket.userDisplayName} (${ticket.userName}) has replied to their ticket :`)
                .setDescription(`${message.content}`);
            // Ping Mods if the ticket is claimed and alerts are on
            if (ticket.isClaimed && ticket.isAlertOn) { modToPing = `<@${ticket.claimantModId}>`; } // Add perm check too
            if (modToPing !== '') { await thread.send({content: modToPing}); }
            // Send the user's message to the thread
            await thread.send({ embeds: [embed] });
            await logger(ticket.ticketId, 'Primary', message.author.id, 'User', message.content);
        } else {
            // This is just a safety check in case the thread doesn't exist for some reason.
            await message.reply(await ticketErrorMessageObject('An error occurred while sending your message. Please try again later, or contact a staff member for assistance.', true));
        }
    } else {
        embed
            .setTitle("Uh oh!")
            .setDescription(`You don't have an open ticket. If you wish to create one, please fill out a ticket form here: ${config.supportmessagelink}`);
        // Reply to the user if they don't have an open ticket
        await message.reply({ embeds: [embed] });
    }
};

const outgoingDirectMessage = async (interaction, ticket, message) => {
    if (!ticket.userId || !message) {
        console.error('Invalid parameters provided for messageUser function');
        return;
    }
    // Use the client singleton to get the Discord client
    const client = clientSingleton.getClient();
    const embed = new EmbedBuilder();
    try {
        const user = await client.users.fetch(ticket.userId); // Fetch the user based on ID
        const staffHighestRole = interaction.member.roles.highest.name;
        embed
            .setTitle(`A ${staffHighestRole} has replied to your ticket :`)
            .setDescription(`${message}`);
        await user.send({ embeds: [embed] }); // DM the user
        await logger(ticket.ticketId, 'Primary', interaction.user.id, 'Staff', message);
    } catch (error) {
        console.error(`Failed to send a message to user with ID ${ticket.userId}. Error: ${error.message}`);
    }
};

const outgoingTicketEvent = async (interaction, ticket, message) => {
    if (!ticket.userId || !message) {
        console.error('Invalid parameters provided for messageUser function');
        return;
    }
    // Use the client singleton to get the Discord client
    const client = clientSingleton.getClient();
    const embed = new EmbedBuilder();
    try {
        const user = await client.users.fetch(ticket.userId); // Fetch the user based on ID
        embed
            .setTitle(`Your ticket has been modified!`)
            .setDescription(`${message}`);
        await user.send({ embeds: [embed] }); // DM the user
        await logger(ticket.ticketId, 'Event', interaction.user.id, 'Bot', message);
    } catch (error) {
        console.error(`Failed to send a message to user with ID ${ticket.userId}. Error: ${error.message}`);
    }
};

export { 
    incomingDirectMessage, 
    outgoingDirectMessage,
    outgoingTicketEvent,
};