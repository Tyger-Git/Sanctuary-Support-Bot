const { ApplicationCommandOptionType } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'addsnippet',
    description: 'Add a snippet',
    options: [{
            name: 'label',
            description: 'The label for the snippet',
            required: true,
            type: ApplicationCommandOptionType.String
        },
        {
            name: 'message',
            description: 'The message for the snippet',
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
        snippets.push({ label: label, value: label, message: message });
        const fs = require('fs');

        fs.writeFile("./snippets.json", JSON.stringify(snippets, null, 2));

        await interaction.editReply(`${label} snippet successfully added.`);
    }
}