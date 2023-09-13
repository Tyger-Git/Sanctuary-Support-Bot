const createTicket = require('../database/createTicket');
const { incomingDirectMessage } = require('./interactionTypeHandlers/directMessageHandler');
const { closeThread } = require('../functions/threadFunctions');
const { snippetWorkflow } = require('./functionHandlers/handleSnippets');
const { escalateWorkflow } = require('./functionHandlers/handleEscalate');

const {
    creatorInquiriesButton,
    generalSupportButton,
    reportButton,
    technicalIssuesButton,
    staffReportButton,
    snippetsButton,
    claimButton,
    unclaimButton,
    escalateButton,
    closeButton
} = require('./interactionTypeHandlers/buttonHandler');

const buttonHandlers = {
    'report_button': reportButton,
    'technical_issues_button': technicalIssuesButton,
    'creator_inquiries_button': creatorInquiriesButton,
    'general_support_button': generalSupportButton,
    'staff_report_button': staffReportButton,
    'snippets_button': snippetsButton,
    'send_snippet_reply_button': snippetWorkflow, // Outsourced to handleSnippets.js
    'cancel_snippet_reply_button': snippetWorkflow, // Outsourced to handleSnippets.js
    'claim_button': claimButton,
    'unclaim_button': unclaimButton,
    'escalate_button': escalateButton,
    'send_escalate_reply_button': escalateWorkflow, // Outsourced to handleEscalate.js
    'cancel_escalate_reply_button': escalateWorkflow, // Outsourced to handleEscalate.js
    'close_button': closeButton,
};

const menuHandlers = {
    'snippet_menu': snippetWorkflow, // Outsourced to handleSnippets.js
    'escalate_menu': escalateWorkflow // Outsourced to handleEscalate.js
};

const modalHandlers = {
    'newReportTicketModal': (interaction) => handleTicketCreation(interaction, 'User Report', 'You submitted a report ticket successfully!'),
    'newTechTicketModal': (interaction) => handleTicketCreation(interaction, 'Technical Support', 'You submitted a technical issue ticket successfully!'),
    'newCreatorTicketModal': (interaction) => handleTicketCreation(interaction, 'VIP Application', 'You submitted a content creator ticket successfully!'),
    'newGenSupTicketModal': (interaction) => handleTicketCreation(interaction, 'General Support', 'You submitted a general support ticket successfully!'),
    'newStaffReportTicketModal': (interaction) => handleTicketCreation(interaction, 'Staff Report', 'You submitted a staff report ticket successfully!'),
    'closeTicketModal': (interaction) => closeThread(interaction),
};

const commandHandlers = {
  'testLogs' : require('../commands/test/testLogs'),
};

// Helper function to catch ticket creation errors and cleanly reply to the user if something goes wrong
async function handleTicketCreation(interaction, ticketType, successMessage) {
    try {
        createTicket(interaction, ticketType);
        await interaction.reply({ content: successMessage, ephemeral: true });
    } catch (error) {
        console.error('Error creating a ticket:', error);
        await interaction.reply({ content: 'An error occurred while creating the ticket. Please try again later, or contact a staff member for assistance.', ephemeral: true });
    }
  }

const handleInteractionCreate = async (interaction) => {
    if (interaction.isButton()) {
      if (interaction.customId.startsWith('send_snippet_reply_button')) {
        await snippetWorkflow(interaction);
      } else if (interaction.customId.startsWith('send_escalate_reply_button')){
        await escalateWorkflow(interaction);
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
          console.error('Error fetching the message:', error);
          return;
        }
      }
      if (message.author.bot){
        console.log(`Got message from a bot: ${message.author.tag}`);
        return;  // Ignore messages from other bots
      }
      if (message.channel.type === 1){ // Type 1 is a DM channel
        console.log(`See DM from ${message.author.tag}`);
        await incomingDirectMessage(message).catch(err => console.error("Error in directMessageHandler: ", err));
      } else {
        console.log(`See message from ${message.author.tag} in ${message.channel.name}`);
        // Future else if's for logging messages in the server
        return;
      }
  };

  module.exports = {
    handleInteractionCreate,
    handleMessageCreate
}