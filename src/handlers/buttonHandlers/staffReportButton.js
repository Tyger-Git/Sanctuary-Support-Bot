const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

module.exports = async (interaction) => {
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