const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

module.exports = async (interaction) => {
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