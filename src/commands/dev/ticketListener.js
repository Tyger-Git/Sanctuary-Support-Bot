// Front facing UX for the ticket system. It is a button menu that allows users to select a ticket type and open a ticket.
/*---- Dev Only ----*/

import { ButtonBuilder, EmbedBuilder, ActionRowBuilder, ApplicationCommandOptionType } from "discord.js";
import emojis from "../../emojis.json" assert { type: "json" };

export default {
    name: 'ticketlistener',
    description: 'Adds the ticket listener to the channel',
    devOnly: true,
    options: [
        {
            name: 'support-message',
            description: 'Message to be added to the listener',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    callback: async (client, interaction) => {
        await interaction.deferReply();
        const channel = interaction.channel;
        const message = interaction.options.get('support-message').value;
        const ticketEmbed = new EmbedBuilder()
            .setColor([108,0,18])
            .setTitle("Need to Contact Staff?")
            .setDescription(`${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`)
            .addFields(
                { name: `Please use the options below to open up a support ticket with Sanctuary\'s Staff Team. ${message}`, value: '\u200B' },
                { name: `${emojis.reportEmoji} Report A Member`, value: `${emojis.line90Report} Use the Report A Member option if you need to report rule-breaking behavior within the walls of Sanctuary.` },
                { name: `${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`, value: '\u200B'},
                { name: `${emojis.techEmoji} Technical Issues`, value: `${emojis.line90Tech} Use the Technical Issues option if you require technical support regarding the Discord server: issues with roles, cannot access channels, etc.`},
                { name: `${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`, value: '\u200B'},
                { name: `${emojis.creatorEmoji} Content Creator Inquiries`, value: `${emojis.line90Creator} Use the Content Creator Inquiries option to inquire about receiving the Content Creator role in Sanctuary.`},
                { name: `${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`, value: '\u200B'},
                { name: `${emojis.submitAppealEmoji} Submit an Appeal`, value: `${emojis.line90Report} Use the Submit an Appeal option if you would like to appeal an infraction penalty you have received.`},
                { name: `${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`, value: '\u200B'},
                { name: `${emojis.generalEmoji} General Support`, value: `${emojis.line90General} Use the General Support option if none of the above categories suit your questions or concerns!`},
                
            )
            .setImage('attachment://ContactStaff.gif')
            .setFooter({text: "© Sanctuary Development Team - 2023"})
            ;

        // Create Buttons
        const report_button = new ButtonBuilder()
        .setCustomId('report_button')
        .setLabel('Report A Member')
        .setEmoji(`${emojis.reportButtonEmoji}`)
        .setStyle('Danger');
        const appeal_button = new ButtonBuilder()
        .setCustomId('appeal_button')
        .setLabel('Submit an Appeal')
        .setEmoji(`${emojis.submitAppealButtonEmoji}`)
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

        // Create Button Rows
        const row1 = new ActionRowBuilder()
            .addComponents(report_button, appeal_button);
        const row2 = new ActionRowBuilder()
            .addComponents(technical_issues_button, creator_inquiries_button);
        const row3 = new ActionRowBuilder()
            .addComponents(general_support_button);


        await interaction.deleteReply(); //  Delete command for cleanliness
        await channel.send({ embeds: [ticketEmbed], files: [{attachment: './resources/ContactStaff.gif', name: 'ContactStaff.gif'}], components: [row1, row2, row3] });
    }
}