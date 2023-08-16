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
    name: 'testlogs',
    description: 'Shows the logs embed',
    devOnly: true,
    callback: async (client, interaction) => {
        await interaction.deferReply();
        
        const channel = interaction.channel;
        const testModTicket = new EmbedBuilder()
            .setColor([255,255,255]) // White
            .setTitle("Ticket Logs - 154413288")
            .setDescription("<:icon_redline:1140786363277512724><:icon_redline:1140786363277512724><:icon_redline:1140786363277512724><:icon_redline:1140786363277512724><:icon_redline:1140786363277512724>")
            .addFields(
                { name: 'Abbott', value: "Well Costello, I'm going to New York with you. You know Bucky Harris, the Yankee's manager, gave me a job as coach for as long as you're on the team."},
                { name: 'Costello', value: "Look Abbott, if you're the coach, you must know all the players."},
                { name: 'Abbott', value: "I certainly do."},
                { name: 'Costello', value: "Well you know I've never met the guys. So you'll have to tell me their names, and then I'll know who's playing on the team."},
                { name: 'Abbott', value: "Oh, I'll tell you their names, but you know it seems to me they give these ball players now-a-days very peculiar names."},
                { name: 'Costello', value: "You mean funny names?"},
                { name: 'Abbott', value: "Strange names, pet names...like Dizzy Dean..."},
                { name: 'Costello', value: "His brother Daffy."},
                { name: 'Abbott', value: "Daffy Dean..."},
                { name: 'Costello', value: "And their French cousin."},
                { name: 'Abbott', value: "French?"},
                { name: 'Costello', value: "Goofè."},
                { name: 'Abbott', value: "Goofè Dean. Well, let's see, we have on the bags, Who's on first, What's on second, I Don't Know is on third..."},
                { name: 'Costello', value: "That's what I want to find out."},
                { name: 'Abbott', value: "I say Who's on first, What's on second, I Don't Know's on third."},
                { name: 'Costello', value: "Are you the manager?"},
                { name: 'Abbott', value: "Yes."},
                { name: 'Costello', value: "You gonna be the coach too?"},
                { name: 'Abbott', value: "Yes."},
                { name: 'Costello', value: "And you don't know the fellows' names?"},
                { name: 'Abbott', value: "Well I should."},
                { name: 'Costello', value: "Well then who's on first?"},
                { name: 'Abbott', value: "Yes."},
                { name: 'Costello', value: "I mean the fellow's name."},
                { name: 'Abbott', value: "Who."},

            )
            ;
        
        // Create Buttons
        const claim_button = new ButtonBuilder()
            .setCustomId('claim_button')
            .setLabel('Claim')
            .setStyle('Success'); // You can set this to SECONDARY, SUCCESS, DANGER, or LINK too
        const unclaim_button = new ButtonBuilder()
            .setCustomId('unclaim_button')
            .setLabel('Unclaim')
            .setStyle('Danger'); // You can set this to SECONDARY, SUCCESS, DANGER, or LINK too
        const escalate_button = new ButtonBuilder()
            .setCustomId('escalate_button')
            .setLabel('Escalate')
            .setStyle('Primary');
        const snippets_button = new ButtonBuilder()
            .setCustomId('snippets_button')
            .setLabel('Snippets')
            .setStyle('Primary');
        const close_button = new ButtonBuilder()
            .setCustomId('close_button')
            .setLabel('Close')
            .setStyle('Danger');
        const logs_button = new ButtonBuilder()
            .setCustomId('logs_button')
            .setLabel('Logs')
            .setStyle('Secondary');

        // Create Button Row
        const row1 = new ActionRowBuilder()
            .addComponents(unclaim_button, escalate_button, logs_button, snippets_button, close_button);
        const row2 = new ActionRowBuilder()
            .addComponents(claim_button, escalate_button, logs_button, snippets_button, close_button);


        await interaction.deleteReply(); //  Delete command for cleanliness

        // Logic for what buttons to show
        const ticketClaimed = true; // Placeholder for now, would pull from DB
        if (ticketClaimed) {
            await channel.send({ embeds: [testModTicket]/*, files: [{attachment: './resources/support.png', name: 'support.png'}], components: [row1]*/ });
        } else {
            await channel.send({ embeds: [testModTicket], files: [{attachment: './resources/support.png', name: 'support.png'}], components: [row2] });
        }
    }
}; 
