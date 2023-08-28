// Old code, but I'm keeping it here for reference.
/*---------- Will Not Be In Final Product ----------*/
const { ModalBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

// This code is unused, but I'm keeping it here for reference.
module.exports = (client) => {
    client.on('interactionCreate', async (interaction) => {
        if(!interaction.isStringSelectMenu()) {
            return;
        }
        if(interaction.customId !== "Select") {
            console.log("Custom ID is not Select.");
            return;
        }

        // Modal Creation
        let newTicketModal= new ModalBuilder()
            .setCustomId("newTicketModal")
            .setTitle("New Ticket");


        switch (interaction.values[0]) {
            case "Report a User":
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
                    newTicketModal.addComponents(reportFirstActionRow, reportSecondActionRow);
                } catch (error) {
                    console.log("Something went wrong while building the Report a User modal. Error: " + error);
                }
                break;
            case "Technical Support":
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
                    newTicketModal.addComponents(techFirstActionRow, techSecondActionRow);
                } catch (error) {   
                    console.log("Something went wrong while building the Technical Support modal. Error: " + error);
                }
                break;
            case "VIP Applications":
                try {
                    const vipAppName = new TextInputBuilder()
                        .setCustomId("vipNameEntry")
                        .setLabel("What is your social media name?")
                        .setStyle(TextInputStyle.Short);
                    const vipAppDescription = new TextInputBuilder()
                        .setCustomId("vipAppDescription")
                        .setLabel("Please describe why you should be considered for VIP status.")
                        .setStyle(TextInputStyle.Paragraph);
                    const vipAppSocials = new TextInputBuilder()
                        .setCustomId("vipAppSocials")
                        .setLabel("Please link your social media platforms.")
                        .setStyle(TextInputStyle.Long);
                    const vipAppFirstActionRow = new ActionRowBuilder().addComponents(vipAppName);
                    const vipAppSecondActionRow = new ActionRowBuilder().addComponents(vipAppDescription);
                    const vipAppThirdActionRow = new ActionRowBuilder().addComponents(vipAppSocials);
                    // Add the components to the modal
                    newTicketModal.addComponents(vipAppFirstActionRow, vipAppSecondActionRow, vipAppThirdActionRow);
                } catch (error) {
                    console.log("Something went wrong while building the VIP Applications modal. Error: " + error);
                }
                break;
            case "General Support":
                try {
                    const genSupportDescription = new TextInputBuilder()
                        .setCustomId("genSupportDescription")
                        .setLabel("Please describe your issue.")
                        .setStyle(TextInputStyle.Paragraph);
                    const genSupportFirstActionRow = new ActionRowBuilder().addComponents(genSupportDescription);
                    // Add the components to the modal
                    newTicketModal.addComponents(genSupportFirstActionRow);
                } catch (error) {
                    console.log("Something went wrong while building the General Support modal. Error: " + error);
                }
                break;
        }
        try {
            // Send the modal
            await interaction.showModal(newTicketModal);
        } catch (error) {
                console.log("Something went wrong while sending the modal. Error: " + error);
        }
    });
};