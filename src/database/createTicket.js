// Creates a new ticket in the database based on the ticket type

import logger from '../utils/logger.js';
import Ticket from '../schemas/ticket.js';
import TicketCounter from '../schemas/ticketCounter.js';

async function getNewTicketID() {
  try {
    const ticketCounter = await TicketCounter.findByIdAndUpdate(
      'ticketCounter',
      { $inc: { currentTicketID: 1 } },
      { new: true, upsert: true }
    );

    return ticketCounter.currentTicketID;
  } catch (error) {
    winston.error('Error fetching latest ticket:', error);
    throw new Error('Cannot generate a new ticket ID');
  }
}

const getUserTicketCount = async (userId) => {
  try {
      const count = await Ticket.countDocuments({ userId: userId });
      return count + 1; // Add one for the newly created ticket
  } catch (error) {
    winston.error("Error fetching user ticket count:", error);
      return 0; // default to 0 in case of an error
  }
}

const createTicket = async (interaction, ticketType) => {
  try {
    const userId = interaction.user.id;
    const member = interaction.guild.members.cache.get(userId);
    // Ticket fields that are common to all ticket types
    const userName = interaction.user.username;
    const userDisplayName = member ? member.displayName : interaction.user.username;
    const userThumbnail = interaction.user.displayAvatarURL({format: 'png', dynamic: true});
    const userAge = Math.floor((Date.now() - interaction.user.createdTimestamp) / (1000 * 60 * 60 * 24)); // Age of user's account
    const userTicketTotal = await getUserTicketCount(userId); // Query the database for the number of tickets the user has submitted, based on userId
    const lastUserResponse = new Date(); // This is reset each time the user responds to the ticket
    const ticketId = await getNewTicketID(); // Ticket ID using ticketID schema
    const guildId = interaction.guild.id; // Server ID
    const guildAge = Math.floor((Date.now() - member.joinedTimestamp) / (1000 * 60 * 60 * 24)); // Age of user in the server in days
    const isOpen = true; 
    const lastModResponse = new Date(); // This is reset each time a mod responds to the ticket
    let ticketLevel = 0; 
    const openDate = new Date();

    // Define ticket-specific fields and values based on the ticketType
    let specificFields = {};
    switch (ticketType) {
      case "User Report":
        //winston.log(interaction.fields.getTextInputValue('userToReport'));
        specificFields = {
          reportedUser: interaction.fields.getTextInputValue('userToReport'),
          userReportReason: interaction.fields.getTextInputValue('userReportReason') 
        };
        ticketLevel = 1;
        break;

      case "Technical Support":
        specificFields = {
            techIssueType: interaction.fields.getTextInputValue('techReasonCatagory'),
            techIssueDescription: interaction.fields.getTextInputValue('techDescription'),
        };
        break;

      case "VIP Application":
        specificFields = {
            socialMediaName: interaction.fields.getTextInputValue('vipNameEntry'),
            vipAppDescription: interaction.fields.getTextInputValue('vipAppDescription'),
            socialMediaLinks: interaction.fields.getTextInputValue('vipAppSocials'),
        };
        ticketLevel = 4;
        break;
      
      case "Appeal":
        specificFields = {
            ticketToAppeal: interaction.fields.getTextInputValue('ticketToAppeal'),
            appealReasoning: interaction.fields.getTextInputValue('appealReasoning'),
        };
        ticketLevel = 2;
        break;

      case "General Support":
        specificFields = {
            generalSupportDescription: interaction.fields.getTextInputValue('genSupportDescription'),
        };
        break;

      default:
        // Handle unsupported ticket types
        break;
    }

    // Create a new ticket object with combined fields
    const newTicket = new Ticket({
      userId,
      userName,
      userDisplayName,
      userThumbnail,
      userAge,
      userTicketTotal,
      lastUserResponse,
      guildId,
      guildAge,
      ticketId,
      ticketType,
      isOpen,
      lastModResponse,
      ticketLevel,
      openDate,
      ...specificFields 
    });

    // Save the new ticket to the database
    await newTicket.save();
    await logger(ticketId, 'Event', userId, interaction.user.username, 'Bot', `Ticket created by ${userDisplayName} (${userName}) with ID ${ticketId}`)
  } catch (error) {
    winston.error("Error creating ticket:", error);
  }
};

export default createTicket;