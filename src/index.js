require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const eventHandler = require('./handlers/eventHandler');
const mongoose = require('mongoose');
const ticketHandler = require('./handlers/ticketHandler');
const threadTesting = require('./commands/test/threadTesting');
const createTicket = require('./events/db/createTicket');
const TicketCounter = require('./schemas/ticketCounter.js');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildPresences
  ],
});

// Button Listener
client.on('interactionCreate', async interaction => {
  if (interaction.isButton()) {
    switch (interaction.customId) {
      case 'report_button':
        require('./handlers/buttonHandlers/reportButton')(interaction);
        break;
      case 'technical_issues_button':
        require('./handlers/buttonHandlers/technicalIssuesButton')(interaction);
        break;
      case 'creator_inquiries_button':
        require('./handlers/buttonHandlers/creatorInquiriesButton')(interaction);
        break;
      case 'general_support_button':
        require('./handlers/buttonHandlers/generalSupportButton')(interaction);
        break;
      case 'staff_report_button':
        require('./handlers/buttonHandlers/staffReportButton')(interaction);
        break;
      case 'hide_logs_button':
        console.log('hide logs button pressed');
        await interaction.channel.send("Hide logs...");
        break;
      case 'show_logs_button':
        console.log('show logs button pressed');
        await interaction.channel.send("Showing logs...");
        break;
      case 'show_full_logs_button':
        console.log('show full logs button pressed');
        await interaction.reply("Showing full logs...");
        break;
      case 'snippets_button':
        require('./handlers/buttonHandlers/snippetsButton')(interaction);
        break;
    }
  } else if (interaction.isStringSelectMenu()) {
    switch (interaction.customId) {
      case 'snippet_menu':
        require('./handlers/actionHandlers/snippetsConfirmation')(interaction);
        break;
    }
  } else if (interaction.isModalSubmit){
    switch (interaction.customId) {
      case 'newReportTicketModal':
        handleTicketCreation(interaction, 'reportTicket', 'You submitted a report ticket successfully!');
        break;
      case 'newTechTicketModal':
        handleTicketCreation(interaction, 'technicalIssueTicket', 'You submitted a technical issue ticket successfully!');
        break;
      case 'newCreatorTicketModal':
        handleTicketCreation(interaction, 'contentCreatorInquiryTicket', 'You submitted a content creator ticket successfully!');
        break;
      case 'newGenSupTicketModal':
        handleTicketCreation(interaction, 'generalSupportTicket', 'You submitted a general support ticket successfully!');
        break;
      case 'newStaffReportTicketModal':
        handleTicketCreation(interaction, 'staffReportTicket', 'You submitted a staff report ticket successfully!');
        break;
    }
  } else {
    return;
  }
  
});

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

// Initialize ticket counter collection in mongoDB. If it already exists, do nothing. This is here as to ensure things are set up across various testing environments.
(async () => {
  try {
    const existingCounter = await TicketCounter.findById('ticketCounter');
    
    if (!existingCounter) {
      const initialCounter = new TicketCounter();
      await initialCounter.save();
      console.log("TicketCounter initialized!");
    } else {
      console.log("TicketCounter already exists!");
    }
  } catch (error) {
    console.error("Error checking TicketCounter initialization:", error);
  }
})();


//IIFE to connect to MongoDB
(async() => {
  try {
      mongoose.set('strictQuery', false);
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected to MongoDB');
      
      eventHandler(client);

      client.login(process.env.TOKEN);
  } catch (error) {
      console.log(`Error connecting to MongoDB: ${error}`);
  }
})();