const mongoose = require("../../index.js"); // Adjust the path as needed

// Import the Ticket model
const Ticket = require("../../schemas/ticket.js"); // Adjust the path as needed

async function getNewTicketID() {
  try {
    // Find the ticket with the highest ticketID
    const latestTicket = await Ticket.findOne().sort({ ticketID: -1 }).limit(1);
    if (latestTicket && latestTicket.ticketID) {
      // Increment the latest ticket's ticketID by 1 and return
      return latestTicket.ticketID + 1;
    } else {
      // If there's no ticket, start from 1
      return 10000001;
    }
  } catch (error) {
    console.error('Error fetching latest ticket:', error);
    throw new Error('Cannot generate a new ticket ID');
  }
}

async function createTicket() {
  try {
    // Create a new ticket document with random values
    const randomUserId = Math.floor(Math.random() * 1000000).toString(); 
    const randomUserAge = Math.floor(Math.random() * 100); 
    const randomUserTicketTotal = Math.floor(Math.random() * 10); 
    const randomGuildId = Math.floor(Math.random() * 1000000).toString(); 
    const randomGuildAge = Math.floor(Math.random() * 365); 
    const randomTicketType = ['General Support', 'Technical Support', 'VIP Applications'][Math.floor(Math.random() * 3)]; 
    const randomClaimantModId = 'mod' + Math.floor(Math.random() * 1000);
    const newTicketID = await getNewTicketID();
    
    const newTicket = new Ticket({
      userId: randomUserId,
      userAge: randomUserAge,
      userTicketTotal: randomUserTicketTotal,
      guildId: randomGuildId,
      guildAge: randomGuildAge,
      ticketID: newTicketID, //New ticket ID goes here
      ticketType: randomTicketType,
      isClaimed: false,
      claimantModId: randomClaimantModId, 
      ticketLevel: 0,
      submitDate: new Date(),
      ticketTimer: 0,
    });
    
    // Save the new ticket document to the database
    await newTicket.save();
    console.log('Ticket saved successfully:', newTicket);
  } catch (error) {
    console.error('Error creating ticket:', error);
  }
}
module.exports = {
  name: 'databasewriter',
  description: 'Write to database',

  callback: async (client, interaction) => {
    createTicket();
  },
};