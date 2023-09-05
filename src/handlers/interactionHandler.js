const createTicket = require('../database/createTicket');
const directMessageHandler = require('./interactionTypeHandlers/directMessageHandler');

const {
    creatorInquiriesButton,
    generalSupportButton,
    reportButton,
    technicalIssuesButton,
    staffReportButton,
    snippetsButton,
    sendSnippetButton
} = require('./interactionTypeHandlers/buttonHandler');

const {
    snippetSelectMenu
} = require('./interactionTypeHandlers/selectMenuHandler');

const buttonHandlers = {
    'report_button': reportButton,
    'technical_issues_button': technicalIssuesButton,
    'creator_inquiries_button': creatorInquiriesButton,
    'general_support_button': generalSupportButton,
    'staff_report_button': staffReportButton,
    'snippets_button': snippetsButton,
    'send_snippet_reply_button': sendSnippetButton
};

const menuHandlers = {
    'snippet_menu': snippetSelectMenu,
};

const modalHandlers = {
    'newReportTicketModal': (interaction) => handleTicketCreation(interaction, 'Player Report', 'You submitted a report ticket successfully!'),
    'newTechTicketModal': (interaction) => handleTicketCreation(interaction, 'Technical Support', 'You submitted a technical issue ticket successfully!'),
    'newCreatorTicketModal': (interaction) => handleTicketCreation(interaction, 'VIP Application', 'You submitted a content creator ticket successfully!'),
    'newGenSupTicketModal': (interaction) => handleTicketCreation(interaction, 'General Support', 'You submitted a general support ticket successfully!'),
    'newStaffReportTicketModal': (interaction) => handleTicketCreation(interaction, 'Staff Report', 'You submitted a staff report ticket successfully!'),
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
      const handler = buttonHandlers[interaction.customId];
      if (handler) {
        await handler(interaction);
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
        await directMessageHandler(message).catch(err => console.error("Error in directMessageHandler: ", err));
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