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
            .setTitle("Need to Contact Staff?")
            .setDescription("<:icon_redline:1140786363277512724><:icon_redline:1140786363277512724><:icon_redline:1140786363277512724><:icon_redline:1140786363277512724><:icon_redline:1140786363277512724>")
            .addFields(
                { name: 'Please use the menu below to open up a support ticket with Sanctuary\'s Staff Team.', value: '\u200B' },
                { name: '<:icon_report:1140779824793788486> Report A Member', value: '<:icon_red90:1140784199792599230> Use the Report A Member option if you need to report rule-breaking behavior within the walls of Sanctuary.' },
                { name: '<:icon_redline:1140786363277512724><:icon_redline:1140786363277512724>', value: '\u200B'},
                { name: '<:icon_tech2:1140800254141268018> Technical Issues', value: '<:icon_tech90:1140800255261155348> Use the Technical Issues option if you require technical support regarding the Discord server: issues with roles, cannot access channels, etc.' },
                { name: '<:icon_redline:1140786363277512724><:icon_redline:1140786363277512724>', value: '\u200B'},
                { name: '<:icon_vip2:1140799537942900799> Content Creator Inquiries', value: '<:icon_yell90:1140799538945327117> Use the Content Creator Inquiries option to inquire about receiving the Content Creator role in Sanctuary.' },
                { name: '<:icon_redline:1140786363277512724><:icon_redline:1140786363277512724>', value: '\u200B'},
                { name: '<:icon_general2:1140799531496263700> General Support', value: '<:icon_green90:1140799533211730071> Use the General Support option if none of the above categories suit your questions or concerns!' },
            )
            .setImage('attachment://bottombanner.png')
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

        const row = new ActionRowBuilder().addComponents(menu);
        await interaction.deleteReply(); //  Delete command for cleanliness
        await channel.send({ files: [{attachment: 'resources/support.png', name: 'support.png'}] });
        await channel.send({ embeds: [ticketEmbed], files: [{attachment: 'resources/bottombanner.png', name: 'bottombanner.png'}], components: [row] });
    }
}