import Ticket from '../../schemas/ticket.js';
import clientSingleton from '../../utils/DiscordClientInstance.js';
import config from '../../../config.json' assert { type: 'json' };
import { EmbedBuilder } from "discord.js";
import logger from '../../utils/logger.js';
import { handleTicketMessageUpdate } from '../../functions/threadFunctions.js';
import emojis from '../../emojis.json' assert { type: 'json' };
import winston from '../../utils/winston.js';

const handleAttachments = async (message, ticket, client, thread) => {
    if (!message.attachments.size) return;

    const attachCount = message.attachments.reduce((acc, attachment) => {
        ticket.ticketAttachments.push(attachment.url);
        winston.debug(`Attachment URL: ${attachment.url} added to ticket ${ticket.ticketId}`);
        return acc + 1;
    }, 0);

    ticket.ticketAttachments = [...new Set(ticket.ticketAttachments)];
    
    await logger(ticket.ticketId, 'Event', client.user.id, client.user.username, 'Bot', `${attachCount} attachments detected in user message. Added to ticket.`);

    const attachmentEmbed = new EmbedBuilder()
        .setTitle(`🔗 Attachments Detected 🔗`)
        .setDescription(`Added ${attachCount} link(s) to the ticket`);
    await thread.send({ embeds: [attachmentEmbed] });
}

const handleHyperlinks = async (message, ticket, client, thread) => {
    const regex = /https?:\/\/[^\s]+/g;
    const hyperlinks = message.content.match(regex) || [];

    if (!hyperlinks.length) return;

    ticket.ticketAttachments = [...ticket.ticketAttachments, ...hyperlinks];
    ticket.ticketAttachments = [...new Set(ticket.ticketAttachments)];

    const hyperlinkEmbed = new EmbedBuilder()
        .setTitle(`🔗 Hyperlinks Detected 🔗`)
        .setDescription(`Added ${hyperlinks.length} link(s) to the ticket`);
    await thread.send({ embeds: [hyperlinkEmbed] });
    await logger(ticket.ticketId, 'Event', client.user.id, client.user.username, 'Bot', 'Hyperlinks detected in user message. Added to ticket.');
}

const incomingDirectMessage = async (message) => {
    winston.info(`Got DM from ${message.author.tag}`);

    // Check if the user has an open ticket
    const ticket = await Ticket.findOne({ userId: message.author.id, isOpen: true });
    if (!ticket) {
        const noTicketEmbed = new EmbedBuilder()
            .setTitle("Uh oh!")
            .setDescription(`You don't have an open ticket. If you wish to create one, please fill out a ticket form here: ${config.supportmessagelink}`);
        return await message.reply({ embeds: [noTicketEmbed] });
    }
    // Get the thread associated with the ticket
    const client = clientSingleton.getClient();
    const thread = await client.channels.fetch(ticket.ticketThread);
    if (!thread) {
        return await message.reply(await messageObjectError('An error occurred while sending your message. Please try again later, or contact a staff member for assistance.', true));
    }

    await handleAttachments(message, ticket, client, thread);
    await handleHyperlinks(message, ticket, client, thread);
    
    let content = `${message.content}\n`;
    let attachCount = 0;

    // Handle attachments regardless of whether the original message has content
    if (message.attachments.size > 0) {
        message.attachments.forEach(attachment => {
            attachCount++;
            content += `${emojis.redDot} [User Attachment #${attachCount}](${attachment.url})\n`;
        });
    }

    let embed = new EmbedBuilder()
        .setTitle(`🗣️ ${ticket.userDisplayName} (${ticket.userName}) replied to their ticket 🗣️`)
        .setDescription(`${content}`)
        .setColor([255, 235, 13]);
    
    let modToPing = '';
    if (ticket.isClaimed && ticket.isAlertOn) { 
        modToPing = `<@${ticket.claimantModId}>`; 
    }
    if (modToPing !== '') { 
        await thread.send({content: modToPing}); 
    }

    await thread.send({ embeds: [embed] });
    
    ticket.lastUserResponse = new Date();
    await ticket.save();
    await handleTicketMessageUpdate(ticket);
    
    const logContent = (message.content.match(/https?:\/\/[^\s]+/g)) ? `<${content}>` : content;
    await logger(ticket.ticketId, 'Primary', message.author.id, message.author.username, 'User', logContent);
};

const outgoingDirectMessage = async (interaction, ticket, message) => {
    if (!ticket.userId || !message) {
        winston.debug('Invalid parameters provided for messageUser function');
        return;
    }
    // Use the client singleton to get the Discord client
    const client = clientSingleton.getClient();
    const date = new Date();
    const embed = new EmbedBuilder();
    try {
        const user = await client.users.fetch(ticket.userId); // Fetch the user based on ID
        const staffHighestRole = interaction.member.roles.highest.name;
        embed
            .setTitle(`A ${staffHighestRole} has replied to your ticket :\n\n${emojis.redDash1}${emojis.redDash2}${emojis.redDash3}`)
            .setDescription(`${message}`)
            .setImage('attachment://ContactStaff.gif')
            .setColor([155,0,25]) // Dark Red
            .setFooter({text : `Sanctuary Support Bot - ©️ Sanctuary Development Team · ${date.getFullYear()}`});
        await user.send({ embeds: [embed], files: [{attachment: './resources/ContactStaff.gif', name: 'ContactStaff.gif' }] }); // DM the user
        await logger(ticket.ticketId, 'Primary', interaction.user.id, interaction.user.username, 'Staff', message);
    } catch (error) {
        winston.error(`Failed to send a message to user with ID ${ticket.userId}. Error: ${error}\n Stack Trace: \n${error.stack}`);
    }
};

const outgoingTicketEvent = async (interaction, ticket, message) => {
    if (!ticket.userId || !message) {
        winston.debug('Invalid parameters provided for messageUser function');
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
        await logger(ticket.ticketId, 'Event', interaction.user.id, interaction.user.username, 'Staff', message);
    } catch (error) {
        winston.error(`Failed to send a message to user with ID ${ticket.userId}. Error: ${error}\n Stack Trace: \n${error.stack}`);
    }
};

export { 
    incomingDirectMessage, 
    outgoingDirectMessage,
    outgoingTicketEvent,
};