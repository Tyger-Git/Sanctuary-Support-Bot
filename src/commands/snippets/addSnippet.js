// This command adds a snippet to the snippets.json file
/*--- DEV ONLY ---*/

import { ApplicationCommandOptionType } from 'discord.js';
import snippets from '../../snippets.json' assert { type: "json" };
import fs from 'fs';

export default {
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
        snippets.push({ label: label, value: label, message: message });

        fs.writeFile("./snippets.json", JSON.stringify(snippets, null, 2));

        await interaction.editReply(`${label} snippet successfully added.`);
    }
}