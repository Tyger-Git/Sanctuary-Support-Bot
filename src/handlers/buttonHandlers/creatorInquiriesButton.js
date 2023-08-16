const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

module.exports = async (interaction) => {
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