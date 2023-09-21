// Database connection and initialization, as well as ticket watching

import mongoose from 'mongoose';
import TicketCounter from '../schemas/ticketCounter.js';
import initialUserMessage from '../handlers/functionHandlers/handleInitialUserMessage.js';
import threadCreation from '../handlers/functionHandlers/handleThreadCreation.js';

async function connectToDatabase() {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
}

async function initializeTicketCounter() {
    const existingCounter = await TicketCounter.findById('ticketCounter');
    if (!existingCounter) {
        const initialCounter = new TicketCounter();
        await initialCounter.save();
        console.log("TicketCounter initialized!");
    } else {
        console.log("TicketCounter already exists!");
    }
}

function watchTickets(client) {
    const ticketCollection = mongoose.connection.collection('tickets');
    const changeStream = ticketCollection.watch();
    changeStream.on('change', async (change) => {
        if (change.operationType === 'insert' && !change.fullDocument.threadCreated) {
            // A new ticket has been detected in the DB, and it has not yet been processed by the bot
            const ticketData = change.fullDocument;
            await threadCreation(client, ticketData);
            await initialUserMessage(client, ticketData);
        }
    });
}

export {
    connectToDatabase,
    initializeTicketCounter,
    watchTickets
};
