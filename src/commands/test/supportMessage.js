// Test command to show the support message in normal message format with response buttons
/*---------- Will Not Be In Final Product ----------*/

import { ActionRowBuilder, ButtonBuilder } from 'discord.js';

export default {
    name: "supportmessage",
    description: "Support message",
    devOnly: true,
    callback: async (client, interaction) => {
      await interaction.deferReply();
      await interaction.deleteReply(); //  Delete command for cleanliness

      // Create Buttons
      const report_button = new ButtonBuilder()
        .setCustomId('report_button')
        .setLabel('Report A Member')
        .setEmoji('<:icon_report3:1140826083525132339>')
        .setStyle('Danger'); // You can set this to SECONDARY, SUCCESS, DANGER, or LINK too
      const technical_issues_button = new ButtonBuilder()
        .setCustomId('technical_issues_button')
        .setLabel('Technical Issues')
        .setEmoji('<:icon_tech3:1140826085311922266>')
        .setStyle('Primary');
      const creator_inquiries_button = new ButtonBuilder()
        .setCustomId('creator_inquiries_button')
        .setLabel('Content Creator Inquiries')
        .setEmoji('<:icon_vip3:1140826086394056764>')
        .setStyle('Secondary');
      const general_support_button = new ButtonBuilder()
        .setCustomId('general_support_button')
        .setLabel('General Support')
        .setEmoji('<:icon_general3:1140826082623365170>')
        .setStyle('Success');

      // Create Button Row
      const row = new ActionRowBuilder()
            .addComponents(report_button, technical_issues_button, creator_inquiries_button, general_support_button);

      
      await interaction.channel.send({
        content: `# Need to Contact Staff?
        \n<:icon_redline:1140786363277512724><:icon_redline:1140786363277512724><:icon_redline:1140786363277512724>
        \nPlease use the buttons below to open up a support ticket with Sanctuary's Staff Team.
        \n# <:icon_report3:1140826083525132339> Report A Member
        \n<:icon_repline2:1140826151716143125> Press the Report A Member button if you need to report rule-breaking behavior within the walls of Sanctuary.
        \n# <:icon_tech3:1140826085311922266> Technical Issues
        \n<:icon_techline2:1140826153091878922> Press the Technical Issues button if you require technical support regarding the Discord server: issues with roles, cannot access channels, etc.
        \n# <:icon_vip3:1140826086394056764> Content Creator Inquiries
        \n<:icon_vipline2:1140826154442428558> Press the Content Creator Inquiries button to inquire about receiving the Content Creator role in Sanctuary.
        \n# <:icon_general3:1140826082623365170> Support
        \n<:icon_genline2:1140826149828702300> Press the General Support button if none of the above categories suit your questions or concerns!
        \n<:icon_redline:1140786363277512724><:icon_redline:1140786363277512724><:icon_redline:1140786363277512724>
        `,
        components: [row]
      });
    }
}