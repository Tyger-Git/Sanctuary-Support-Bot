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

//IIFE to connect to MongoDB
(async() => {
  try {
      mongoose.set('strictQuery', false);
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected to MongoDB');
      
      eventHandler(client);
      client.once('ready', () => {
        console.log('Ready!');
        ticketHandler(client);
        //threadTesting(client);
      });

      client.login(process.env.TOKEN);
  } catch (error) {
      console.log(`Error connecting to MongoDB: ${error}`);
  }
})();