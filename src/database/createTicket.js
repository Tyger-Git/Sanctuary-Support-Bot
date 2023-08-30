// Module to read a modal and create a ticket in the database

const mongoose = require("../index.js"); // Import the mongoose module for incrementing ticket IDs - Not working

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

const createTicket = async (interaction, ticketType) => {
  try {
    // Extract common data from the interaction object
    const userId = interaction.user.id;
    const userName = interaction.user.username;
    //Nickname logic
    const member = interaction.guild.members.cache.get(userId);
    const userDisplayName = member ? member.displayName : interaction.user.username;
    const userAge = Math.floor((Date.now() - interaction.user.createdTimestamp) / (1000 * 60 * 60 * 24));
    const userTicketTotal = 0; // Assuming initial ticket total is 0
    const lastUserResponse = new Date();

    const ticketId = await getNewTicketID();

    const guildId = interaction.guild.id;
    const guildAge = Math.floor((Date.now() - interaction.guild.joinedTimestamp) / (1000 * 60 * 60 * 24));

    const isOpen = true;
    const isClaimed = false;
    const claimantModId = "0";
    const lastModResponse = new Date();
    const ticketLevel = 0;
    const openDate = new Date();
    const closeDate = null;
    const ticketAttachments = [];

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
      ticketId,
      userId,
      userName,
      userDisplayName,
      userAge,
      userTicketTotal,
      lastUserResponse,
      guildId,
      guildAge,
      ticketType,
      isOpen,
      isClaimed,
      claimantModId,
      lastModResponse,
      ticketLevel,
      openDate,
      closeDate,
      ticketAttachments,
      ...specificFields 
    });

    // Save the new ticket to the database
    await newTicket.save();
  } catch (error) {
    console.error("Error creating ticket:", error);
  }
};

module.exports = createTicket;