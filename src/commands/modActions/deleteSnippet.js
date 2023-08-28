// This command is used to delete a snippet from the snippets.json file
/*--- DEV ONLY ---*/

const { ApplicationCommandOptionType } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'deletesnippet',
    description: 'Delete a snippet',
    options: [
        {
            name: 'label',
            description: 'The label for the snippet',
            required: true,
            type: ApplicationCommandOptionType.String
        }
    ],
    devOnly: true,
    callback: async (client, interaction) => {
        await interaction.deferReply();
        const label = interaction.options.getString('label');
        const snippets = require("../../snippets.json");
        const index = snippets.findIndex(snippet => snippet.label === label);
        if (index > -1) {
            snippets.splice(index, 1);
        }

        fs.writeFile("./snippets.json", JSON.stringify(snippets, null, 2));

        await interaction.editReply(`${label} snippet successfully deleted.`);
    }
}