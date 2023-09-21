import { config } from 'dotenv';
import clientSingleton from './utils/DiscordClientInstance.js';
import { connectToDatabase, initializeTicketCounter, watchTickets } from './database/database.js';
import { handleInteractionCreate, handleMessageCreate } from './handlers/interactionHandler.js';
import slashCommandHandler from './handlers/commandHandlers/slashCommandHandler.js';
import { deleteOldThreads, pingAlerts } from './utils/taskScheduler.js';
import { ticketActionMessageObject, ticketErrorMessageObject } from './functions/responseFunctions.js';
import { set } from 'mongoose';

// Execute dotenv config
config();
// Get the Discord client
const client = clientSingleton.getClient();

// Interaction Listener
client.on('interactionCreate', handleInteractionCreate);

// Direct Message Listener
client.on('messageCreate', handleMessageCreate);

async function initBot() {
  await connectToDatabase();
  await initializeTicketCounter();
  watchTickets(client);
  slashCommandHandler(client);
  client.login(process.env.TOKEN);
}

initBot();

setInterval(deleteOldThreads, 60 * 1000); // Run every minute
setInterval(pingAlerts, 300 * 1000); // Run every five minutes

// Global variables
global.ticketActionMessageObject = ticketActionMessageObject;
global.ticketErrorMessageObject = ticketErrorMessageObject;