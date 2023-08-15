const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

module.exports = async (interaction) => {
    // Modal Creation
    let newTechTicketModal= new ModalBuilder()
    .setCustomId("newTechTicketModal")
    .setTitle("New Ticket");

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