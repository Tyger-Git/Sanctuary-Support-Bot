// This command is used to delete a snippet from the snippets.json file
/*--- DEV ONLY ---*/

import { ApplicationCommandOptionType } from 'discord.js';
import Snippet from '../../schemas/snippet.js';

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
        const snippet = await Snippet.findOne({ snippetName: label });
        if (snippet){
            await snippet.delete();
            await interaction.editReply(`${label} snippet successfully deleted.`);
        } else {
            await interaction.editReply(`${label} snippet not found.`);
        }
    }
}