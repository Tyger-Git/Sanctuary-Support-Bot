const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

module.exports = async (interaction) => {
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