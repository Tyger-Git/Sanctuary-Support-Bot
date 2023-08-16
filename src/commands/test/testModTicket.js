const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ButtonBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    Message,
    MessageEmbed,
    Attachment,
  } = require("discord.js");

module.exports = {
    name: 'testmodticket',
    description: 'Shows the mod ticket embed',
    devOnly: true,
    callback: async (client, interaction) => {
        await interaction.deferReply();
        
        const channel = interaction.channel;
        const testModTicket = new EmbedBuilder()
            .setColor([96,0,169]) // Purple
            .setTitle("Technical Support Ticket")
            .setDescription("<:icon_redline:1140786363277512724><:icon_redline:1140786363277512724><:icon_redline:1140786363277512724><:icon_redline:1140786363277512724><:icon_redline:1140786363277512724>")
            .addFields(
                { name: 'User Name:', value: 'Tyger'},
                { name: 'User ID:', value: '151862710424961024', inline: true },{ name: 'Account Age:', value: '5 years, 4 months', inline: true },{ name: 'Membership Age:', value: '0 years, 8 months', inline: true },
                { name: 'Ticket ID:', value: '154413288', inline: true },{ name: 'Total Tickets Opened:', value: '8', inline: true },{ name: 'Ticket Status', value: 'Open', inline: true },
                { name: 'Mod Assigned:', value: 'Gojira', inline: true },{ name: 'DEFCON:', value: '5', inline: true },{ name: 'Created On:', value: '8/16/23 - 22:16', inline: true },
                { name: "<:icon_redline:1140786363277512724><:icon_redline:1140786363277512724><:icon_redline:1140786363277512724><:icon_redline:1140786363277512724><:icon_redline:1140786363277512724>", value: '\u200B' },
                { name: 'User Message 1 :', value: "I can't create a new thread in the trade forums..." },
                { name: 'User Message 2 :', value: "Am I banned?!?" },
            )
            .setImage('attachment://support.png')
            ;
        
        // Create Buttons
        const claim_button = new ButtonBuilder()
            .setCustomId('claim_button')
            .setLabel('Claim Ticket')
            .setStyle('Success'); // You can set this to SECONDARY, SUCCESS, DANGER, or LINK too
        const unclaim_button = new ButtonBuilder()
            .setCustomId('unclaim_button')
            .setLabel('Unclaim Ticket')
            .setStyle('Danger'); // You can set this to SECONDARY, SUCCESS, DANGER, or LINK too
        const escalate_button = new ButtonBuilder()
            .setCustomId('escalate_button')
            .setLabel('Escalate Ticket')
            .setStyle('Primary');
        const snippets_button = new ButtonBuilder()
            .setCustomId('snippets_button')
            .setLabel('Snippets')
            .setStyle('Primary');
        const close_button = new ButtonBuilder()
            .setCustomId('close_button')
            .setLabel('Close Ticket')
            .setStyle('Danger');

        // Create Button Row
        const row1 = new ActionRowBuilder()
            .addComponents(unclaim_button, escalate_button, snippets_button, close_button);
        const row2 = new ActionRowBuilder()
            .addComponents(snippets_button, close_button);


        await interaction.deleteReply(); //  Delete command for cleanliness
        await channel.send({ embeds: [testModTicket], files: [{attachment: './resources/support.png', name: 'support.png'}], components: [row1] });
    }
}; 
