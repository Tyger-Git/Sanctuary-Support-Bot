// Testing some embeds and buttons for the logs embed
/*---------- Will Not Be In Final Product ----------*/

import { ButtonBuilder, EmbedBuilder, ActionRowBuilder } from 'discord.js';

export default {
    name: 'testlogs',
    description: 'Shows the logs embed',
    devOnly: true,
    callback: async (client, interaction) => {
        await interaction.deferReply();
        
        const channel = interaction.channel;
        const testModTicket = new EmbedBuilder()
            .setColor([255,255,255]) // White
            .setTitle("Ticket Logs - 154413288 - 6 Commands Ran - 42 External Thread Comments")
            .setDescription("<:icon_redline:1140786363277512724><:icon_redline:1140786363277512724><:icon_redline:1140786363277512724><:icon_redline:1140786363277512724><:icon_redline:1140786363277512724>")
            .addFields(
                { name: '<:icon_redline:1140786363277512724>\n:shield: Abbot (User)', value: "Well Costello, I'm going to New York with you. You know Bucky Harris, the Yankee's manager, gave me a job as coach for as long as you're on the team."},
                { name: '<:icon_redline:1140786363277512724>\n:speech_balloon: Costello (Mod)', value: "Look Abbot, if you're the coach, you must know all the players."},
                { name: '<:icon_redline:1140786363277512724>\n:shield: Abbot (User)', value: "I certainly do."},
                { name: '<:icon_redline:1140786363277512724>\n:speech_balloon: Costello (Mod)', value: "Well you know I've never met the guys. So you'll have to tell me their names, and then I'll know who's playing on the team."},
                { name: '<:icon_redline:1140786363277512724>\n:shield: Abbot (User)', value: "Oh, I'll tell you their names, but you know it seems to me they give these ball players now-a-days very peculiar names."},
                { name: '<:icon_redline:1140786363277512724>\n:speech_balloon: Costello (Mod)', value: "You mean funny names?"},
                { name: '<:icon_redline:1140786363277512724>\n<:sanctLOGOlined:1141181151231352852> Lilith-Mail', value: 'Escalated ticket to Senior Moderators. Action taken manually by: Lavender'},
                { name: '<:icon_redline:1140786363277512724>\n:shield: Abbot (User)', value: "I say Who's on first, What's on second, I Don't Know's on third."},
                { name: '<:icon_redline:1140786363277512724>\n:speech_balloon: Costello (Mod)', value: "Are you the manager?"},
                { name: '<:icon_redline:1140786363277512724>\n:shield: Abbot (User)', value: "Yes."},
                { name: '<:icon_redline:1140786363277512724>\n:speech_balloon: Costello (Mod)', value: "You gonna be the coach too?"},
                { name: '<:icon_redline:1140786363277512724>\n<:sanctLOGOlined:1141181151231352852> Lilith-Mail ', value: 'Escalated ticket to Senior Moderators. Action taken manually by: Lavender'},
                { name: '<:icon_redline:1140786363277512724>\n:shield: Abbot (User)', value: "Yes."},
                { name: '<:icon_redline:1140786363277512724>\n:speech_balloon: Costello (Mod)', value: "And you don't know the fellows' names?"},
                { name: '<:icon_redline:1140786363277512724>\n:shield: Abbot (User)', value: "Well I should."},
                { name: '<:icon_redline:1140786363277512724>\n:speech_balloon: Costello (Mod)', value: "Well then who's on first?"},
                { name: '<:icon_redline:1140786363277512724>\n:shield: Abbot (User)', value: "Yes."},
                { name: '<:icon_redline:1140786363277512724>\n<:sanctLOGOlined:1141181151231352852> Lilith-Mail', value: 'Escalated ticket to Senior Moderators. Action taken manually by: Lavender'},
                { name: '<:icon_redline:1140786363277512724>\n:speech_balloon: Costello (Mod)', value: "I mean the fellow's name."},
                { name: '<:icon_redline:1140786363277512724>\n:shield: Abbot (User)', value: "Who."},

            )
            .setFooter({text: "Ticket ID: 154413288", iconURL: 'https://i.imgur.com/AfFp7pu.png'})
            ;
        
        // Create Buttons
        const hide_logs_button = new ButtonBuilder()
            .setCustomId('hide_logs_button')
            .setLabel('Hide Logs')
            .setStyle('Primary'); // You can set this to SECONDARY, SUCCESS, DANGER, or LINK too
        const show_logs_button = new ButtonBuilder()
            .setCustomId('show_logs_button')
            .setLabel('Show Logs')
            .setStyle('Primary'); // You can set this to SECONDARY, SUCCESS, DANGER, or LINK too
        const show_full_logs_button = new ButtonBuilder()
            .setCustomId('show_full_logs_button')
            .setLabel('Show Full Logs')
            .setStyle('Success'); // You can set this to SECONDARY, SUCCESS, DANGER, or LINK too

        // Create Button Row
        const row1 = new ActionRowBuilder()
            .addComponents(hide_logs_button, show_full_logs_button);
        const row2 = new ActionRowBuilder()
            .addComponents(show_logs_button, show_full_logs_button);

        let logs_hidden = false;

        if (logs_hidden) {
            await interaction.editReply({ embeds: [testModTicket], components: [row2] });
        } else {
            await interaction.editReply({ embeds: [testModTicket], components: [row1] });
        }
    }
}; 
