const { ApplicationCommandOptionType } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'editsnippet',
    description: 'Edit a snippet',
    options: [
        {
            name: 'label',
            description: 'The label for the snippet to edit',
            required: true,
            type: ApplicationCommandOptionType.String
        },
        {
            name: 'message',
            description: 'The new message for the snippet',
            required: true,
            type: ApplicationCommandOptionType.String
        }
    ],
    devOnly: true,
    callback: async (client, interaction) => {
        await interaction.deferReply();
        const label = interaction.options.getString('label');
        const message = interaction.options.getString('message');
        const snippets = require("../../snippets.json");
        const index = snippets.findIndex(snippet => snippet.label === label);
        if (index > -1) {
            snippets[index].message = message;
        }

        fs.writeFile("./snippets.json", JSON.stringify(snippets, null, 2));
        
        await interaction.editReply(`${label} snippet successfully edited.`);
    }
}