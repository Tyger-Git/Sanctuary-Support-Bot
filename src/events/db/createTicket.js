const mongoose = require("../../index.js"); 

const Ticket = require("../../schemas/ticket.js"); 

const createTicket = async (interaction, ticketType) => {
  try {
    // Extract common data from the interaction object
    const userId = interaction.user.id;
    const userAge = Math.floor((Date.now() - interaction.user.createdTimestamp) / (1000 * 60 * 60 * 24));
    const userTicketTotal = 0; // Assuming initial ticket total is 0
    const lastUserResponse = new Date();

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
        specificFields = {
          reportTicket: {
            reportedUserId: interaction.fields.getTextInputValue('userToReport'),
            reportReason: interaction.fields.getTextInputValue('reasonForReport') 
          },
        };
        break;

      case "technicalIssueTicket":
        specificFields = {
          technicalIssueTicket: {
            issueType: interaction.fields.getTextInputValue('techReasonCatagory'),
            technicalIssueDescription: interaction.fields.getTextInputValue('techDescription'),
          },
        };
        break;

      case "contentCreatorInquiryTicket":
        specificFields = {
          contentCreatorInquiryTicket: {
            contentCreatorName: interaction.fields.getTextInputValue('vipNameEntry'),
            inquiryDetails: interaction.fields.getTextInputValue('vipAppDescription'),
            socialMediaLinks: interaction.fields.getTextInputValue('vipAppSocials'),
          },
        };
        break;

      case "generalSupportTicket":
        specificFields = {
          generalSupportTicket: {
            issueDescription: interaction.fields.getTextInputValue('genSupportDescription'),
          },
        };
        break;

      default:
        // Handle unsupported ticket types
        break;
    }

    // Create a new ticket object with combined fields
    const newTicket = new Ticket({
      userId,
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