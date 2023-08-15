const { ModalBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

module.exports = (client) => {
    client.on('interactionCreate', async (interaction) => {
        if(!interaction.isStringSelectMenu()) return;
            if(interaction.customId !== "Select") {
                console.log("Custom ID is not Select.");
                return;
            }

            // Modal Creation
            let newTicketModal;
            try {
                newTicketModal = new ModalBuilder()
                .setCustomId("newTicketModal")
                .setTitle("New Ticket")
            
                // Build Components based on the selection
                // Report a User
                const userToReport = new TextInputBuilder()
                    .setCustomId("userToReport")
                    .setLabel("Who would you like to report?")
                    .setStyle(TextInputStyle.Long)
                const reasonForReport = new TextInputBuilder()
                    .setCustomId("reasonForReport")
                    .setLabel("Why are you reporting this user?")
                    .setStyle(TextInputStyle.Paragraph)
                const reportFirstActionRow = new ActionRowBuilder().addComponents(userToReport);
                const reportSecondActionRow = new ActionRowBuilder().addComponents(reasonForReport);

                // Technical Support
                const techReasonCatagory = new StringSelectMenuBuilder()
                    .setCustomId("techReasonCatagory")
                    .setMaxValues(1)
                    .setPlaceholder("Select a technical issue.")
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Report a User")
                            .setDescription("Do you need to report a user?")
                            .setValue("Report a User"),
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Technical Support")
                            .setDescription("Are you having technical difficulties?")
                            .setValue("Technical Support"),
                        new StringSelectMenuOptionBuilder()
                            .setLabel("VIP Applications")
                            .setDescription("Apply for VIP / Content Creator status.")
                            .setValue("VIP Applications"),
                        new StringSelectMenuOptionBuilder()
                            .setLabel("General Support")
                            .setDescription("Have some general questions?")
                            .setValue("General Support"),
                    );
                const techDescription = new TextInputBuilder()
                    .setCustomId("techDescription")
                    .setLabel("Please describe your issue.")
                    .setStyle(TextInputStyle.Paragraph)
                const techFirstActionRow = new ActionRowBuilder().addComponents(techReasonCatagory);
                const techSecondActionRow = new ActionRowBuilder().addComponents(techDescription);
                // VIP Applications
                const vipAppName = new TextInputBuilder()
                    .setCustomId("vipNameEntry")
                    .setLabel("What is your name across media platforms?")
                    .setStyle(TextInputStyle.Long)
                const vipAppDescription = new TextInputBuilder()
                    .setCustomId("vipAppDescription")
                    .setLabel("Please describe why you should be considered for VIP status.")
                    .setStyle(TextInputStyle.Paragraph)
                const vipAppSocials = new TextInputBuilder()
                    .setCustomId("vipAppSocials")
                    .setLabel("Please link your social media platforms.")
                    .setStyle(TextInputStyle.Paragraph)
                const vipAppFirstActionRow = new ActionRowBuilder().addComponents(vipAppName);
                const vipAppSecondActionRow = new ActionRowBuilder().addComponents(vipAppDescription);
                const vipAppThirdActionRow = new ActionRowBuilder().addComponents(vipAppSocials);
                // General Support
                const genSupportDescription = new TextInputBuilder()
                    .setCustomId("genSupportDescription")
                    .setLabel("Please describe your issue.")
                    .setStyle(TextInputStyle.Paragraph)
                const genSupportFirstActionRow = new ActionRowBuilder().addComponents(genSupportDescription);
                // Add the components to the modal
                if (interaction.values[0] === "Report a User") {
                    newTicketModal.addComponents(reportFirstActionRow, reportSecondActionRow);
                } else if (interaction.values[0] === "Technical Support") {
                    newTicketModal.addComponents(techFirstActionRow, techSecondActionRow);
                } else if (interaction.values[0] === "VIP Applications") {
                    newTicketModal.addComponents(vipAppFirstActionRow, vipAppSecondActionRow, vipAppThirdActionRow);
                } else if (interaction.values[0] === "General Support") {
                    newTicketModal.addComponents(genSupportFirstActionRow);
                } else {
                    console.log("Something went wrong in the ticket listener.");
                }
            
            } catch (error) {
                console.log("Something went wrong while creating the modal. Error: " + error);
            }
                
            try {
                    // Send the modal
                await interaction.showModal(newTicketModal);
            } catch (error) {
                    console.log("Something went wrong while sending the modal. Error: " + error);
            }
            });
};