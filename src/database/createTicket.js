// Module to read a modal and create a ticket in the database

const Ticket = require("../schemas/ticket.js"); 
const TicketCounter = require('../schemas/ticketCounter.js');

async function getNewTicketID() {
  try {
    const ticketCounter = await TicketCounter.findByIdAndUpdate(
      'ticketCounter',
      { $inc: { currentTicketID: 1 } },
      { new: true, upsert: true }
    );

    return ticketCounter.currentTicketID;
  } catch (error) {
    console.error('Error fetching latest ticket:', error);
    throw new Error('Cannot generate a new ticket ID');
  }
}

const getUserTicketCount = async (userId) => {
  try {
      const count = await Ticket.countDocuments({ userId: userId });
      return count;
  } catch (error) {
      console.error("Error fetching user ticket count:", error);
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
    const userAge = Math.floor((Date.now() - interaction.user.createdTimestamp) / (1000 * 60 * 60 * 24)); // Age of user's account
    const userTicketTotal = await getUserTicketCount(userId); // Query the database for the number of tickets the user has submitted, based on userId
    const lastUserResponse = new Date(); // This is reset each time the user responds to the ticket
    const ticketId = await getNewTicketID(); // Ticket ID using ticketID schema
    const guildId = interaction.guild.id; // Server ID
    const guildAge = Math.floor((Date.now() - member.joinedTimestamp) / (1000 * 60 * 60 * 24)); // Age of user in the server
    const isOpen = true; 
    const lastModResponse = new Date(); // This is reset each time a mod responds to the ticket
    const ticketLevel = 0; 
    const openDate = new Date();

    // Define ticket-specific fields and values based on the ticketType
    let specificFields = {};
    switch (ticketType) {
      case "reportTicket":
        //console.log(interaction.fields.getTextInputValue('userToReport'));
        specificFields = {
          reportedUser: interaction.fields.getTextInputValue('userToReport'),
          playerReportReason: interaction.fields.getTextInputValue('reasonForReport') 
        };
        break;

      case "technicalIssueTicket":
        specificFields = {
            techIssueType: interaction.fields.getTextInputValue('techReasonCatagory'),
            techIssueDescription: interaction.fields.getTextInputValue('techDescription'),
        };
        break;

      case "contentCreatorInquiryTicket":
        specificFields = {
            socialMediaName: interaction.fields.getTextInputValue('vipNameEntry'),
            vipAppDescription: interaction.fields.getTextInputValue('vipAppDescription'),
            socialMediaLinks: interaction.fields.getTextInputValue('vipAppSocials'),
        };
        break;
      
      case "staffReportTicket":
        specificFields = {
            reportedMod: interaction.fields.getTextInputValue('staffMemberToReport'),
            modReportReason: interaction.fields.getTextInputValue('reasonForReport'),
        };
        break;

      case "generalSupportTicket":
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
  } catch (error) {
    console.error("Error creating ticket:", error);
  }
};

module.exports = createTicket;