require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const eventHandler = require('./handlers/eventHandler');
const mongoose = require('mongoose');
const ticketHandler = require('./handlers/ticketHandler');
const threadTesting = require('./commands/test/threadTesting');

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
  } else {
    return;
  }
  
});

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