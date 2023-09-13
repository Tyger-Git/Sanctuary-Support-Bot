const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, } = require("discord.js");
const snippets = require("../../snippets.json");
const Ticket = require("../../schemas/ticket.js");
const { handleThreadName, handleTicketMessageUpdate, getThreadTag } = require("../../functions/threadFunctions.js");

/*------------------------------------------------------------------------------------------------------------------------*/
// Helper functions
/*------------------------------------------------------------------------------------------------------------------------*/
const checkExistingTicket = async (interaction) => {
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
        console.log("Something went wrong while building the VIP Applications modal. Error: " + error);
    }

    // Try to send the modal
    try {
        await interaction.showModal(newCreatorTicketModal);
    } catch (error) {
            console.log("Something went wrong while sending the modal. Error: " + error);
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
        console.log("Something went wrong while building the General Support modal. Error: " + error);
    }

    // Try to send the modal
    try {
        await interaction.showModal(newGenSupTicketModal);
    } catch (error) {
            console.log("Something went wrong while sending the modal. Error: " + error);
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
        const reasonForReport = new TextInputBuilder()
            .setCustomId("reasonForReport")
            .setLabel("Why are you reporting this user?")
            .setStyle(TextInputStyle.Paragraph);
        const reportFirstActionRow = new ActionRowBuilder().addComponents(userToReport);
        const reportSecondActionRow = new ActionRowBuilder().addComponents(reasonForReport);
        // Add the components to the modal
        newReportTicketModal.addComponents(reportFirstActionRow, reportSecondActionRow);
    } catch (error) {
        console.log("Something went wrong while building the Report a User modal. Error: " + error);
    }

    // Try to send the modal
    try {
        await interaction.showModal(newReportTicketModal);
    } catch (error) {
            console.log("Something went wrong while sending the modal. Error: " + error);
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
        console.log("Something went wrong while building the Technical Support modal. Error: " + error);
    }

    // Try to send the modal
    try {
        await interaction.showModal(newTechTicketModal);
    } catch (error) {
            console.log("Something went wrong while sending the modal. Error: " + error);
    }
};

// Staff Report Button
/*------------------------------------------------------------------------------------------------------------------------*/
const staffReportButton = async (interaction) => {
    // Check if user already has an active ticket
    const hasExistingTicket = await checkExistingTicket(interaction);
    if (hasExistingTicket) return;
    
    // Modal Creation
    let newStaffReportTicketModal= new ModalBuilder()
    .setCustomId("newStaffReportTicketModal")
    .setTitle("New Ticket");

    // Try to build the modal
    try {
        const staffMemberToReport = new TextInputBuilder()
            .setCustomId("staffMemberToReport")
            .setLabel("What staff member would you like to report?")
            .setStyle(TextInputStyle.Short);
        const reasonForReport = new TextInputBuilder()
            .setCustomId("reasonForReport")
            .setLabel("Why are you reporting this staff member?")
            .setStyle(TextInputStyle.Paragraph);
        const reportFirstActionRow = new ActionRowBuilder().addComponents(staffMemberToReport);
        const reportSecondActionRow = new ActionRowBuilder().addComponents(reasonForReport);
        // Add the components to the modal
        newStaffReportTicketModal.addComponents(reportFirstActionRow, reportSecondActionRow);
    } catch (error) {
        console.log("Something went wrong while building the Report a staff member modal. Error: " + error);
    }

    // Try to send the modal
    try {
        await interaction.showModal(newStaffReportTicketModal);
    } catch (error) {
            console.log("Something went wrong while sending the modal. Error: " + error);
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
    
    snippets.forEach(snippet => {
        snippetMenu.addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel(snippet.label)
                .setValue(snippet.value)
        );
    });
    const row = new ActionRowBuilder().addComponents(snippetMenu);

    interaction.reply({
        content: "Select a snippet to send.",
        components: [row],
        //ephemeral: true
    });
};


// Claim Button (ModTicket)
/*------------------------------------------------------------------------------------------------------------------------*/
const claimButton = async (interaction) => {
    const threadId = interaction.channel.id;
    const claimantMod = interaction.user.username;
    const claimantModId = interaction.user.id;
    const thread = interaction.channel;
    try {
        const ticket = await Ticket.findOne({ ticketThread: threadId });
        // Update the ticket's info in MongoDB and save
        ticket.isClaimed = true;
        ticket.claimantModId = claimantModId;
        ticket.claimantModName = claimantMod;
        await ticket.save();

        // Get the thread and edit the thread name
        const newThreadName = await handleThreadName(ticket);
        const threadTag = await getThreadTag(ticket);
        await thread.edit({
            name: newThreadName,
            appliedTags: [threadTag],
        });

        //Update Ticket Message
        await handleTicketMessageUpdate(ticket);

        // Reply to the interaction
        await interaction.reply({ content: "Ticket Claimed by **" + claimantMod + "**"});
    } catch (error) {
        console.error('Error claiming ticket:', error);
    }
};

// Unclaim Button (ModTicket)
/*------------------------------------------------------------------------------------------------------------------------*/
const unclaimButton = async (interaction) => {
    const threadId = interaction.channel.id;
    const thread = interaction.channel;
    try {
        const ticket = await Ticket.findOne({ ticketThread: threadId });
        // Update the ticket's info in MongoDB and save
        ticket.isClaimed = false;
        ticket.claimantModId = 0;
        let modUnclaiming = ticket.claimantModName;
        ticket.claimantModName = 'Unclaimed';
        await ticket.save();

        // Get the thread and edit the thread name
        const newThreadName = await handleThreadName(ticket);
        const threadTag = await getThreadTag(ticket);
        await thread.edit({
            name: newThreadName,
            appliedTags: [threadTag],
        });

        //Update Ticket Message
        await handleTicketMessageUpdate(ticket);

        // Reply to the interaction
        await interaction.reply({ content: modUnclaiming + " unclaimed the ticket."});
    } catch (error) {
        console.error('Error unclaiming ticket:', error);
    }
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
        //ephemeral: true
    });
};

// Close Button (ModTicket)
/*------------------------------------------------------------------------------------------------------------------------*/
const closeButton = async (interaction) => {
    // Modal Creation
    let closeTicketModal= new ModalBuilder()
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
        console.log("Something went wrong while building the close ticket modal. Error: " + error);
    }

    // Try to send the modal
    try {
        await interaction.showModal(closeTicketModal);
    } catch (error) {
            console.log("Something went wrong while sending the modal. Error: " + error);
    }
};


/*------------------------------------------------------------------------------------------------------------------------*/
// Export the functions
/*------------------------------------------------------------------------------------------------------------------------*/
module.exports = {
    creatorInquiriesButton,
    generalSupportButton,
    reportButton,
    technicalIssuesButton,
    staffReportButton,
    snippetsButton,
    claimButton,
    unclaimButton,
    escalateButton,
    closeButton
}
