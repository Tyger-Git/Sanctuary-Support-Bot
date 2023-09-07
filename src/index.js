require('dotenv').config();
const slashCommandHandler = require('./handlers/commandHandlers/slashCommandHandler');
const db = require('./database/database');
const { handleInteractionCreate, handleMessageCreate } = require('./handlers/interactionHandler');
const clientSingleton = require('./utils/DiscordClientInstance');
const taskScheduler = require('./utils/taskScheduler');

// Get the Discord client
const client = clientSingleton.getClient();

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

setInterval(taskScheduler.deleteOldThreads, 60 * 1000); // Run every minute