// Front facing UX for the ticket system. It is a button menu that allows users to select a ticket type and open a ticket.
/*---- Dev Only ----*/

const {
    PermissionFlagsBits,
    ButtonBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    MessageEmbed,
  } = require("discord.js");
  const ticketSchema = require("../../schemas/ticket");
  const emojis = require("../../emojis.json");

module.exports = {
    name: 'ticketlistener',
    description: 'Adds the ticket listener to the channel',
    devOnly: true,
    callback: async (client, interaction) => {
        await interaction.deferReply();

        const channel = interaction.channel;
        const ticketEmbed = new EmbedBuilder()
            .setColor([108,0,18])
            .setTitle("Need to Contact Staff?")
            .setDescription(`${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`)
            .addFields(
                { name: 'Please use the menu below to open up a support ticket with Sanctuary\'s Staff Team.', value: '\u200B' },
                { name: `${emojis.reportEmoji} Report A Member`, value: `${emojis.line90Report} Use the Report A Member option if you need to report rule-breaking behavior within the walls of Sanctuary.` },
                { name: `${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`, value: '\u200B'},
                { name: `${emojis.techEmoji} Technical Issues`, value: `${emojis.line90Tech} Use the Technical Issues option if you require technical support regarding the Discord server: issues with roles, cannot access channels, etc.`},
                { name: `${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`, value: '\u200B'},
                { name: `${emojis.creatorEmoji} Content Creator Inquiries`, value: `${emojis.line90Creator} Use the Content Creator Inquiries option to inquire about receiving the Content Creator role in Sanctuary.`},
                { name: `${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`, value: '\u200B'},
                { name: `${emojis.staffReportEmoji} Report A Staff Member`, value: `${emojis.line90Report} Use the Report A Staff Member option if you need to report a staff member\'s behavior within the walls of Sanctuary.`},
                { name: `${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`, value: '\u200B'},
                { name: `${emojis.generalEmoji} General Support`, value: `${emojis.line90General} Use the General Support option if none of the above categories suit your questions or concerns!`},
                
            )
            .setImage('attachment://support.png')
            .setFooter({text: "© Sanctuary Development Team - 2023"})
            ;

        // No longer using a dropdown menu, but keeping this code for future reference
        /*
        const menu = new StringSelectMenuBuilder()
            .setCustomId("Select")
            .setMaxValues(1)
            .setPlaceholder("Select a topic.")
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel("Report a User")
                    .setDescription("Do you need to report a user?")
                    .setValue("Report a User")
                    .setEmoji("<:icon_report:1140779824793788486>"),
                new StringSelectMenuOptionBuilder()
                    .setLabel("Technical Support")
                    .setDescription("Are you having technical difficulties?")
                    .setValue("Technical Support")
                    .setEmoji("<:icon_tech2:1140800254141268018>"),
                new StringSelectMenuOptionBuilder()
                    .setLabel("VIP Applications")
                    .setDescription("Apply for VIP / Content Creator status.")
                    .setValue("VIP Applications")
                    .setEmoji("<:icon_vip2:1140799537942900799>"),
                new StringSelectMenuOptionBuilder()
                    .setLabel("General Support")
                    .setDescription("Have some general questions?")
                    .setValue("General Support")
                    .setEmoji("<:icon_general2:1140799531496263700>"),
            );
        const oldRow = new ActionRowBuilder().addComponents(menu);
        */
        
        // Create Buttons
        const report_button = new ButtonBuilder()
        .setCustomId('report_button')
        .setLabel('Report A Member')
        .setEmoji(`${emojis.reportButtonEmoji}`)
        .setStyle('Danger');
        const staff_report_button = new ButtonBuilder()
        .setCustomId('staff_report_button')
        .setLabel('Report A Staff Member')
        .setEmoji(`${emojis.staffReportButtonEmoji}`)
        .setStyle('Danger');
        const technical_issues_button = new ButtonBuilder()
        .setCustomId('technical_issues_button')
        .setLabel('Technical Issues')
        .setEmoji(`${emojis.techButtonEmoji}`)
        .setStyle('Primary');
        const creator_inquiries_button = new ButtonBuilder()
        .setCustomId('creator_inquiries_button')
        .setLabel('Content Creator Inquiries')
        .setEmoji(`${emojis.creatorButtonEmoji}`)
        .setStyle('Secondary');
        const general_support_button = new ButtonBuilder()
        .setCustomId('general_support_button')
        .setLabel('General Support')
        .setEmoji(`${emojis.generalButtonEmoji}`)
        .setStyle('Success');

        // Create Button Row
        const row1 = new ActionRowBuilder()
            .addComponents(report_button, staff_report_button);
        const row2 = new ActionRowBuilder()
            .addComponents(technical_issues_button, creator_inquiries_button);
        const row3 = new ActionRowBuilder()
            .addComponents(general_support_button);


        await interaction.deleteReply(); //  Delete command for cleanliness
        //await channel.send({ files: [{attachment: './resources/support.png', name: 'support.png'}] });
        await channel.send({ embeds: [ticketEmbed], files: [{attachment: './resources/support.png', name: 'support.png'}], components: [row1, row2, row3] });
    }
}