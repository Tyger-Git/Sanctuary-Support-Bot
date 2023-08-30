require('dotenv').config();
const { Client, IntentsBitField, Partials } = require('discord.js');
const slashCommandHandler = require('./handlers/commandHandlers/slashCommandHandler');
const db = require('./database/database');
const { handleInteractionCreate, handleMessageCreate } = require('./handlers/interactionHandler');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.DirectMessages,
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction
  ]
});

// Interaction Listener
client.on('interactionCreate', handleInteractionCreate);

// Direct Message Listener
client.on('messageCreate', handleMessageCreate);

async function initBot() {
  await db.connectToDatabase();
  await db.initializeTicketCounter();
  db.watchTickets(client);
  slashCommandHandler(client);
  client.login(process.env.TOKEN);
}

initBot();