const mongoose = require('mongoose');
const TicketCounter = require('../schemas/ticketCounter.js');
const initialUserMessage = require('../handlers/functionHandlers/handleInitialUserMessage.js');
const threadCreation = require('../handlers/functionHandlers/handleThreadCreation.js');

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

module.exports = {
    connectToDatabase,
    initializeTicketCounter,
    watchTickets
};
