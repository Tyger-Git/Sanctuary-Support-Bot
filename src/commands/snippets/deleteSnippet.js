// This command is used to delete a snippet from the snippets.json file
/*--- DEV ONLY ---*/

import { ApplicationCommandOptionType } from 'discord.js';
import { promises as fs } from 'fs';
import snippets from '../../snippets.json' assert { type: "json" };

export default {
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
        const index = snippets.findIndex(snippet => snippet.label === label);
        if (index > -1) {
            snippets.splice(index, 1);
        }

        await fs.writeFile("./snippets.json", JSON.stringify(snippets, null, 2));

        await interaction.editReply(`${label} snippet successfully deleted.`);
    }
}