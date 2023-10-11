import createTicket from '../database/createTicket.js';
import { incomingDirectMessage } from './interactionTypeHandlers/directMessageHandler.js';
import { closeThread } from '../functions/threadFunctions.js';
import { snippetWorkflow } from './functionHandlers/handleSnippets.js';
import { escalateWorkflow } from './functionHandlers/handleEscalate.js';
import watchedMessage from './interactionTypeHandlers/messageHandler.js';
import config from '../../config.json' assert { type: "json" };
import clientSingleton from '../utils/DiscordClientInstance.js';
import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from 'discord.js';
import emojis from '../emojis.json' assert { type: "json" };
import { creatorInquiriesButton, generalSupportButton, reportButton, 
    technicalIssuesButton, submitAppealButton, snippetsButton, 
    claimButton, unclaimButton, escalateButton, closeButton,
    confirmAttachButton, cancelAttachButton, logsButton, longLogsButton } from './interactionTypeHandlers/buttonHandler.js';

// Function handoffs for interaction types
/*------------------------------------------------------------------------------------------------------------------------*/
const buttonHandlers = {
    'report_button': reportButton,
    'technical_issues_button': technicalIssuesButton,
    'creator_inquiries_button': creatorInquiriesButton,
    'general_support_button': generalSupportButton,
    'appeal_button': submitAppealButton,
    'snippets_button': snippetsButton,
    'cancel_snippet_reply_button': snippetWorkflow, // Outsourced to handleSnippets.js
    'claim_button': claimButton,
    'unclaim_button': unclaimButton,
    'escalate_button': escalateButton,
    'cancel_escalate_reply_button': escalateWorkflow, // Outsourced to handleEscalate.js
    'close_button': closeButton,
    'confirm_remove_attachment' : confirmAttachButton,
    'cancel_remove_attachment' : cancelAttachButton,
};
const menuHandlers = {
    'snippet_menu': snippetWorkflow, // Outsourced to handleSnippets.js
    'escalate_menu': escalateWorkflow, // Outsourced to handleEscalate.js
    'remove_attachment_select' : attachmentRemoval // Done below, for now
};
const modalHandlers = {
    'newReportTicketModal': (interaction) => handleTicketCreation(interaction, 'User Report', 'You submitted a report ticket successfully!'),
    'newTechTicketModal': (interaction) => handleTicketCreation(interaction, 'Technical Support', 'You submitted a technical issue ticket successfully!'),
    'newCreatorTicketModal': (interaction) => handleTicketCreation(interaction, 'VIP Application', 'You submitted a content creator ticket successfully!'),
    'newGenSupTicketModal': (interaction) => handleTicketCreation(interaction, 'General Support', 'You submitted a general support ticket successfully!'),
    'newAppealTicketModal': (interaction) => handleTicketCreation(interaction, 'Appeal', 'You submitted an appeal ticket successfully!'),
    'closeTicketModal': (interaction) => closeThread(interaction),
};

// Helper functions
/*------------------------------------------------------------------------------------------------------------------------*/
// Get Discord client instance
const client = clientSingleton.getClient();
// Catch ticket creation errors and cleanly reply to the user if something goes wrong
async function handleTicketCreation(interaction, ticketType, successMessage) {
    try {
        createTicket(interaction, ticketType);
        await interaction.reply({ content: successMessage, ephemeral: true });
    } catch (error) {
      winston.error('Error creating a ticket:', error);
        await interaction.reply({ content: 'An error occurred while creating the ticket. Please try again later, or contact a staff member for assistance.', ephemeral: true });
    }
  }

// Handle attachment removal - Might move this to a separate file
async function attachmentRemoval(interaction) {
    const selectedLink = interaction.values[0];
    const confirmButton = new ButtonBuilder()
        .setCustomId('confirm_remove_attachment')
        .setLabel('Confirm')
        .setStyle('Success');
    const cancelButton = new ButtonBuilder()
        .setCustomId('cancel_remove_attachment')
        .setLabel('Cancel')
        .setStyle('Danger');
    const row = new ActionRowBuilder().addComponents(confirmButton, cancelButton);
    await interaction.update({
        content: `Are you sure you want to remove this attachment?\n${selectedLink}`,
        components: [row]
    });
}

// Interaction handlers
/*------------------------------------------------------------------------------------------------------------------------*/
const handleInteractionCreate = async (interaction) => {
    if (interaction.isButton()) {
      if (interaction.customId.startsWith('send_snippet_reply_button')) {
        await snippetWorkflow(interaction);
      } else if (interaction.customId.startsWith('send_escalate_reply_button')){
        await escalateWorkflow(interaction);
      } else if (interaction.customId.startsWith('logs_button')){
        await logsButton(interaction);
      } else if (interaction.customId.startsWith('long_logs_button')){
        await longLogsButton(interaction);
      } else {
        const handler = buttonHandlers[interaction.customId];
        if (handler) {
          await handler(interaction);
        }
      }
    } else if (interaction.isStringSelectMenu()) {
      const handler = menuHandlers[interaction.customId];
      if (handler) {
        await handler(interaction);
      }
    } else if (interaction.isModalSubmit) {
      const handler = modalHandlers[interaction.customId];
      if (handler) {
        await handler(interaction);
      }
    } else {
      return;
    }
  };
  const handleMessageCreate = async (message) => {
      if (message.partial) { // Partial messages do not contain all message data, so fetch the full message (DM's aren't cached, always partial)
        try {
          await message.fetch();  // Fetch the full message data
        } catch (error) {
          winston.error('Error fetching the message:', error);
          return;
        }
      }
      if (message.author.bot){
        winston.info(`Got message from a bot: ${message.author.tag}`);
        return;  // Ignore messages from other bots
      }
      // Check if the bot was mentioned
      if (message.mentions.has(client.user)) {
          message.reply(`Hello! I'm the support bot for Sanctuary. If you need help, please visit : ${config.supportmessagelink}`);
          // Get bot pings channel
          const thread = await client.channels.fetch('1152017558128566332');
          const messageLink = `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`;
          const embed = new EmbedBuilder()
              .setTitle(`${emojis.outage} Bot pinged! ${emojis.outage}`)
              .setDescription(`Bot pinged by **${message.author.tag}** in **<#${message.channel.id}>**. See message here: ${messageLink}`)
          await thread.send({ embeds: [embed] });
      }
      // Get parent channel ID of message channel
      const parentChannelId = message.channel.parentId;
      // Handle message based on channel type
      if (message.channel.type === 1){ // Check if message is a DM
        await incomingDirectMessage(message).catch(err => {
          winston.error(`Error in directMessageHandler: ${err.message}`);
          winston.debug(`Error stack: ${err.stack}`);
        });
      } else if (channelIDs.includes(parentChannelId)){ // Check if message is within a ticket forum
        await watchedMessage(message).catch(err => winston.error("Error in messageHandler: ", err));
      } else {
        return;
      }
  };
  // Map of channel names to channel IDs, used for determining if a message is in a ticket forum
  const channelConfig = {
    "GeneralSupportForum0": "1151237881977905273",
    "TechSupportForum0": "1151237933605597254",

    "GeneralSupportForum1": "1140398426580852897",
    "TechSupportForum1": "1140397073238335510",
    "UserReportForum1": "1140397105123426435",

    "GeneralSupportForum2": "1140397282005631067",
    "TechSupportForum2": "1151238183535779901",
    "UserReportForum2": "1151238216301682698",
    "AppealForum2": "1151238332454543432",

    "GeneralSupportForum3": "1151238420853690449",
    "TechSupportForum3": "1151238474779869284",
    "UserReportForum3": "1151238457142820896",
    "AppealForum3": "1151238403678031883",

    "VIPAppForum4": "1140398786552803449",
    "AppealForum4": "1151242072804823160",
    "StaffSupportForum": "1140398736963534869",
    "DemonlyForum": "1140398611046350848",
    "KetForum": "1140398651945001132",

    "DevSupportForum": "1151238517842788392"
  };
  const channelIDs = Object.values(channelConfig);

export {
    handleInteractionCreate,
    handleMessageCreate
};