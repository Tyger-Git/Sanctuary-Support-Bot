const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType,
    EmbedBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    Message,
    MessageEmbed,
    Attachment,
  } = require("discord.js");
  const ticketSchema = require("../../schemas/ticket");

module.exports = {
    name: 'ticketlistener',
    description: 'Adds the ticket listener to the channel',
    devOnly: true,
    callback: async (client, interaction) => {
        await interaction.deferReply();
        
        const channel = interaction.channel;
        const ticketEmbed = new EmbedBuilder()
            .setColor([108,0,18])
            .setTitle("Support Tickets")
            .setDescription("Sanctuary's mod ticket bot!")
            .addFields(
                { name: 'Regular field title', value: 'Some value here' },
                { name: '\u200B', value: '\u200B' },
                { name: 'Inline field title', value: 'Some value here', inline: true },
                { name: 'Inline field title', value: 'Some value here', inline: true },
                { name: 'Regular field title', value: 'Some value here' },
                { name: 'Regular field title', value: 'Some value here' },
                { name: 'Regular field title', value: 'Some value here' },
            )
            .setImage('attachment://600X150.png')
            //.setFooter("Footer Text")
            ;

        const menu = new StringSelectMenuBuilder()
        .setCustomId("Select")
        .setMaxValues(1)
        .setPlaceholder("Select a topic.")
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel("Report a User")
                .setDescription("Do you need to report a user?")
                .setValue("Report a User")
                .setEmoji("1136239171703418900"),
            new StringSelectMenuOptionBuilder()
                .setLabel("Technical Support")
                .setDescription("Are you having technical difficulties?")
                .setValue("Technical Support")
                .setEmoji("1136239186266038412"),
            new StringSelectMenuOptionBuilder()
                .setLabel("VIP Applications")
                .setDescription("Apply for VIP / Content Creator status.")
                .setValue("VIP Applications")
                .setEmoji("🌟"),
            new StringSelectMenuOptionBuilder()
                .setLabel("General Support")
                .setDescription("Have some general questions?")
                .setValue("General Support")
                .setEmoji("1136239180003938346"),
        );

        const row = new ActionRowBuilder().addComponents(menu);
        await interaction.deleteReply(); //  Delete command for cleanliness
        await channel.send({ files: [{attachment: 'resources/700X250.png', name: '700X250.png'}] });
        await channel.send({ embeds: [ticketEmbed], files: [{attachment: 'resources/600X150.png', name: '600X150.png'}], components: [row] });
        
        // Add the listener
        client.on("interactionCreate", async (interaction) => {
            if(!interaction.isSelectMenu()) return;
            if(interaction.customId !== "Select") return;

            // Modal Creation
            const newTicketModal = new ModalBuilder()
                .setCustomId("newTicketModal")
                .setTitle("New Ticket")
            
            // Build Components based on the selection
            // Report a User
            const userToReport = new TextInputBuilder()
                .setCustomId("userToReport")
                .setLabel("Who would you like to report?")
                .setStyle(TextInputStyle.Short)
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
                        .setValue("Report a User")
                        .setEmoji("1136239171703418900"),
                    new StringSelectMenuOptionBuilder()
                        .setLabel("Technical Support")
                        .setDescription("Are you having technical difficulties?")
                        .setValue("Technical Support")
                        .setEmoji("1136239186266038412"),
                    new StringSelectMenuOptionBuilder()
                        .setLabel("VIP Applications")
                        .setDescription("Apply for VIP / Content Creator status.")
                        .setValue("VIP Applications")
                        .setEmoji("🌟"),
                    new StringSelectMenuOptionBuilder()
                        .setLabel("General Support")
                        .setDescription("Have some general questions?")
                        .setValue("General Support")
                        .setEmoji("1136239180003938346"),
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
                .setStyle(TextInputStyle.Short)
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

            // Add the components to the modal
            if (interaction.values[0] === "Report a User") {
                newTicketModal.addComponents(reportFirstActionRow, reportSecondActionRow);
            } else if (interaction.values[0] === "Technical Support") {
                newTicketModal.addComponents();
            } else if (interaction.values[0] === "VIP Applications") {
                newTicketModal.addComponents();
            } else if (interaction.values[0] === "General Support") {
                newTicketModal.addComponents();
            } else {
                console.log("Something went wrong in the ticket listener.");
            }

            // Send the modal
            await interaction.showModal(newTicketModal);
        });

    }
}