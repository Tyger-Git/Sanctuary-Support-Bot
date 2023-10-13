// Functions to handle button interactions

import { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import Snippet from "../../schemas/snippet.js";
import { claimTicket, unclaimTicket, vibeCheck } from "../../functions/ticketFunctions.js";
import Ticket from "../../schemas/ticket.js";
import { handleTicketMessageUpdate } from "../../functions/threadFunctions.js";
import logger from "../../utils/logger.js";
import { shortLogs, longLogs } from "../../functions/logView.js";

/*------------------------------------------------------------------------------------------------------------------------*/
// Helper functions
/*------------------------------------------------------------------------------------------------------------------------*/
const checkExistingTicket = async (interaction) => { // MAKE THIS RESPONSE A PRETTY EMBED
    // Check if user already has an active ticket
    /*
    const existingTicket = await Ticket.findOne({ userId: interaction.user.id, isOpen: true });
    if (existingTicket) {
        // Reply to the user that they can only have one active ticket
        interaction.reply({ content : 'You can only have one active ticket at a time. Please resolve your existing ticket before creating a new one.', ephemeral: true });
        return true;
    }
    return false;
    */
   return false; // Commented out for testing, allowing devs to create multiple tickets
};

// Creator Inquiries Button
/*------------------------------------------------------------------------------------------------------------------------*/
const creatorInquiriesButton = async (interaction) => {
    // Check if user already has an active ticket
    const hasExistingTicket = await checkExistingTicket(interaction);
    if (hasExistingTicket) return;

    // Modal Creation
    let newCreatorTicketModal= new ModalBuilder()
    .setCustomId("newCreatorTicketModal")
    .setTitle("New Ticket");

    // Try to build the modal
    try {
        const vipAppName = new TextInputBuilder()
            .setCustomId("vipNameEntry")
            .setLabel("What is your social media name?")
            .setStyle(TextInputStyle.Short);
        const vipAppDescription = new TextInputBuilder()
            .setCustomId("vipAppDescription")
            .setLabel("test")
            .setPlaceholder("Please describe why you should be considered for VIP status.")
            .setStyle(TextInputStyle.Paragraph);
        const vipAppSocials = new TextInputBuilder()
            .setCustomId("vipAppSocials")
            .setLabel("Please link your social media platforms.")
            .setStyle(TextInputStyle.Paragraph);
        const vipAppFirstActionRow = new ActionRowBuilder().addComponents(vipAppName);
        const vipAppSecondActionRow = new ActionRowBuilder().addComponents(vipAppDescription);
        const vipAppThirdActionRow = new ActionRowBuilder().addComponents(vipAppSocials);
        // Add the components to the modal
        newCreatorTicketModal.addComponents(vipAppFirstActionRow, vipAppSecondActionRow, vipAppThirdActionRow);
    } catch (error) {
        winston.error(`Something went wrong while building the VIP Applications modal. Error: ${error}\n Stack Trace: \n${error.stack}`);
    }

    // Try to send the modal
    try {
        await interaction.showModal(newCreatorTicketModal);
    } catch (error) {
        winston.error(`Something went wrong while sending the modal. Error: ${error}\n Stack Trace: \n${error.stack}`);
    }
};

// General Support Button
/*------------------------------------------------------------------------------------------------------------------------*/
const generalSupportButton = async (interaction) => {
    // Check if user already has an active ticket
    const hasExistingTicket = await checkExistingTicket(interaction);
    if (hasExistingTicket) return;

    // Modal Creation
    let newGenSupTicketModal= new ModalBuilder()
    .setCustomId("newGenSupTicketModal")
    .setTitle("New Ticket");

    // Try to build the modal
    try {
        const genSupportDescription = new TextInputBuilder()
            .setCustomId("genSupportDescription")
            .setLabel("Please describe your issue.")
            .setStyle(TextInputStyle.Paragraph);
        const genSupportFirstActionRow = new ActionRowBuilder().addComponents(genSupportDescription);
        // Add the components to the modal
        newGenSupTicketModal.addComponents(genSupportFirstActionRow);
    } catch (error) {
        winston.error(`Something went wrong while building the General Support modal. Error: ${error}\n Stack Trace: \n${error.stack}`);
    }

    // Try to send the modal
    try {
        await interaction.showModal(newGenSupTicketModal);
    } catch (error) {
        winston.error(`Something went wrong while sending the modal. Error: ${error}\n Stack Trace: \n${error.stack}`);
    }
};

// Report Button
/*------------------------------------------------------------------------------------------------------------------------*/
const reportButton = async (interaction) => {
    // Check if user already has an active ticket
    const hasExistingTicket = await checkExistingTicket(interaction);
    if (hasExistingTicket) return;

    // Modal Creation
    let newReportTicketModal= new ModalBuilder()
    .setCustomId("newReportTicketModal")
    .setTitle("New Ticket");

    // Try to build the modal
    try {
        const userToReport = new TextInputBuilder()
            .setCustomId("userToReport")
            .setLabel("Who would you like to report?")
            .setStyle(TextInputStyle.Short);
        const userReportReason = new TextInputBuilder()
            .setCustomId("userReportReason")
            .setLabel("Why are you reporting this user?")
            .setStyle(TextInputStyle.Paragraph);
        const reportFirstActionRow = new ActionRowBuilder().addComponents(userToReport);
        const reportSecondActionRow = new ActionRowBuilder().addComponents(userReportReason);
        // Add the components to the modal
        newReportTicketModal.addComponents(reportFirstActionRow, reportSecondActionRow);
    } catch (error) {
        winston.error(`Something went wrong while building the Report a User modal. Error: ${error}\n Stack Trace: \n${error.stack}`);
    }

    // Try to send the modal
    try {
        await interaction.showModal(newReportTicketModal);
    } catch (error) {
        winston.error(`Something went wrong while sending the modal. Error: ${error}\n Stack Trace: \n${error.stack}`);
    }
};

// Technical Issues Button
/*------------------------------------------------------------------------------------------------------------------------*/
const technicalIssuesButton = async (interaction) => {
    // Check if user already has an active ticket
    const hasExistingTicket = await checkExistingTicket(interaction);
    if (hasExistingTicket) return;

    // Modal Creation
    let newTechTicketModal= new ModalBuilder()
    .setCustomId("newTechTicketModal")
    .setTitle("New Ticket");

    // Try to build the modal
    try {
        const techReasonCatagory = new TextInputBuilder()
            .setCustomId("techReasonCatagory")
            .setLabel("What type of issue are you having?")
            .setStyle(TextInputStyle.Short);
        const techDescription = new TextInputBuilder()
            .setCustomId("techDescription")
            .setLabel("Please describe your technical issue.")
            .setStyle(TextInputStyle.Paragraph);
        const techFirstActionRow = new ActionRowBuilder().addComponents(techReasonCatagory);
        const techSecondActionRow = new ActionRowBuilder().addComponents(techDescription);
        // Add the components to the modal
        newTechTicketModal.addComponents(techFirstActionRow, techSecondActionRow);
    } catch (error) {   
        winston.error(`Something went wrong while building the Technical Support modal. Error: ${error}\n Stack Trace: \n${error.stack}`);
    }

    // Try to send the modal
    try {
        await interaction.showModal(newTechTicketModal);
    } catch (error) {
        winston.error(`Something went wrong while sending the modal. Error: ${error}\n Stack Trace: \n${error.stack}`);
    }
};

// Appeals Button
/*------------------------------------------------------------------------------------------------------------------------*/
const submitAppealButton = async (interaction) => {
    // Check if user already has an active ticket
    const hasExistingTicket = await checkExistingTicket(interaction);
    if (hasExistingTicket) return;
    
    // Modal Creation
    let newAppealTicketModal= new ModalBuilder()
    .setCustomId("newAppealTicketModal")
    .setTitle("New Ticket");

    // Try to build the modal
    try {
        const ticketToAppeal = new TextInputBuilder()
            .setCustomId("ticketToAppeal")
            .setLabel("What is the ticket ID that are you appealing?")
            .setStyle(TextInputStyle.Short);
        const appealReasoning = new TextInputBuilder()
            .setCustomId("appealReasoning")
            .setLabel("What is your reasoning for appealing?")
            .setStyle(TextInputStyle.Paragraph);
        const reportFirstActionRow = new ActionRowBuilder().addComponents(ticketToAppeal);
        const reportSecondActionRow = new ActionRowBuilder().addComponents(appealReasoning);
        // Add the components to the modal
        newAppealTicketModal.addComponents(reportFirstActionRow, reportSecondActionRow);
    } catch (error) {
        winston.error(`Something went wrong while building the Appeal modal. Error: ${error}\n Stack Trace: \n${error.stack}`);
    }

    // Try to send the modal
    try {
        await interaction.showModal(newAppealTicketModal);
    } catch (error) {
        winston.error(`Something went wrong while sending the modal. Error: ${error}\n Stack Trace: \n${error.stack}`);
    }
};

// Snippets Button (ModTicket)
/*------------------------------------------------------------------------------------------------------------------------*/
const snippetsButton = async (interaction) => {
    // Create the select menu
    const snippetMenu = new StringSelectMenuBuilder()
        .setCustomId("snippet_menu")
        .setMaxValues(1)
        .setPlaceholder("Select a snippet to send.")
    let snippets = await Snippet.find({});
    // Does this work?
    snippets.forEach(snippet => {
        snippetMenu.addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel(snippet.snippetName)
                .setValue(snippet.snippetName)
        );
    });
    const row = new ActionRowBuilder().addComponents(snippetMenu);

    interaction.reply({
        content: "Select a snippet to send.",
        components: [row],
        ephemeral: true
    });
};


// Claim Button (ModTicket)
/*------------------------------------------------------------------------------------------------------------------------*/
const claimButton = async (interaction) => {
    await claimTicket(interaction, 'button');
};

// Unclaim Button (ModTicket)
/*------------------------------------------------------------------------------------------------------------------------*/
const unclaimButton = async (interaction) => {
    await unclaimTicket(interaction, 'button');
};

// Logs Button (ModTicket)
/*------------------------------------------------------------------------------------------------------------------------*/
const logsButton = async (interaction) => {
    await interaction.deferReply();
    const [_, ticketID] = interaction.customId.split(':'); // Split the customId to retrieve the ticketID
    const ticket = await Ticket.findOne({ ticketId: ticketID });
    await shortLogs(interaction, ticket);
};

// Long Logs Button (ModTicket)
/*------------------------------------------------------------------------------------------------------------------------*/
const longLogsButton = async (interaction) => {
    await interaction.deferReply();
    const [_, ticketID] = interaction.customId.split(':');
    const ticket = await Ticket.findOne({ ticketId: ticketID });
    await longLogs(interaction, ticket);
};

// Escalate Button (ModTicket)
/*------------------------------------------------------------------------------------------------------------------------*/
const escalateButton = async (interaction) => {
    // Create the select menu
    const escalateMenu = new StringSelectMenuBuilder()
        .setCustomId("escalate_menu")
        .setMaxValues(1)
        .setPlaceholder("What group would you like to move this ticket to?")
    
    // Add the options to the select menu
    escalateMenu.addOptions(
        new StringSelectMenuOptionBuilder()
            .setLabel("Helpers")
            .setValue("Helpers"),
        new StringSelectMenuOptionBuilder()
            .setLabel("Moderators")
            .setValue("Moderators"),
        new StringSelectMenuOptionBuilder()
            .setLabel("Senior Moderators")
            .setValue("Senior Moderators"),
        new StringSelectMenuOptionBuilder()
            .setLabel("Head Moderators")
            .setValue("Head Moderators"),
        new StringSelectMenuOptionBuilder()
            .setLabel("Server Support")
            .setValue("Server Support"),
        new StringSelectMenuOptionBuilder()
            .setLabel("Demonly")
            .setValue("Demonly"),
        new StringSelectMenuOptionBuilder()
            .setLabel("Ketraies")
            .setValue("Ketraies"),
        new StringSelectMenuOptionBuilder()
            .setLabel("Developers")
            .setValue("Developers"),
    );

    const row = new ActionRowBuilder().addComponents(escalateMenu);

    interaction.reply({
        content: "Where would you like to escalate this ticket to?",
        components: [row],
        ephemeral: true
    });
};

// Close Button (ModTicket)
/*------------------------------------------------------------------------------------------------------------------------*/
const closeButton = async (interaction) => {
    // Modal Creation
    let closeTicketModal = new ModalBuilder()
    .setCustomId("closeTicketModal")
    .setTitle("Mod Notes");

    // Try to build the modal
    try {
        const closeTimer = new TextInputBuilder()
            .setCustomId("closeTimer")
            .setLabel("Set Close Timer (In Hours) :")
            .setStyle(TextInputStyle.Short);
        const modNotes = new TextInputBuilder()
            .setCustomId("modNotes")
            .setLabel("Ticket Mod Notes :")
            .setStyle(TextInputStyle.Paragraph);
        const actionRow = new ActionRowBuilder().addComponents(closeTimer);
        const actionRow2 = new ActionRowBuilder().addComponents(modNotes);
        // Add the components to the modal
        closeTicketModal.addComponents(actionRow, actionRow2);
    } catch (error) {
        winston.error(`Something went wrong while building the close ticket modal. Error: ${error}\n Stack Trace: \n${error.stack}`);
    }

    // Try to send the modal
    try {
        await interaction.showModal(closeTicketModal);
    } catch (error) {
        winston.error(`Something went wrong while sending the modal. Error: ${error}\n Stack Trace: \n${error.stack}`);
    }
};

// Confirm Button (Attachment Removal)
/*------------------------------------------------------------------------------------------------------------------------*/
const confirmAttachButton = async (interaction) => {
    const ticket = await Ticket.findOne({ ticketThread: interaction.channel.id, isOpen: true });
    const selectedLink = interaction.message.content.split('\n')[1];

    ticket.ticketAttachments = ticket.ticketAttachments.filter(link => link !== selectedLink);
    await ticket.save();

    await handleTicketMessageUpdate(ticket);
    await logger(ticket.ticketId, 'Event', interaction.user.id, interaction.user.username, 'Staff', 'Attachment removed. Attachment: ' + selectedLink + '');

    await interaction.update({
        content: 'Attachment removed successfully!',
        components: []
    });
};

// Cancel Button (Attachment Removal)
/*------------------------------------------------------------------------------------------------------------------------*/
const cancelAttachButton = async (interaction) => {
    await interaction.update({
        content: 'Attachment removal cancelled.',
        components: []
    });
};
/*------------------------------------------------------------------------------------------------------------------------*/
// Export the functions
/*------------------------------------------------------------------------------------------------------------------------*/
export { 
    creatorInquiriesButton,
    generalSupportButton,
    reportButton,
    technicalIssuesButton,
    submitAppealButton,
    snippetsButton,
    claimButton,
    unclaimButton,
    escalateButton,
    closeButton,
    confirmAttachButton,
    cancelAttachButton,
    logsButton,
    longLogsButton
};
