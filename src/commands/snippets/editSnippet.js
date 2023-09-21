// This command is used to delete a snippet from the snippets collection
/*--- DEV ONLY ---*/

import { ApplicationCommandOptionType } from 'discord.js';
import Snippet from '../../schemas/snippet.js';

export default {
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
        //await interaction.deferReply({ ephemeral: true });
        await interaction.deferReply();
        const label = interaction.options.getString('label');
        const message = interaction.options.getString('message');
        // Search for the snippet in the database collection
        const snippet = await Snippet.findOne({ snippetName: label });
        // If the snippet is found, update the snippet content
        if (snippet) {
            snippet.snippetContent = message;
            await snippet.save();
            //await interaction.editReply({content: `${label} snippet successfully edited.`, ephemeral: true});
            await interaction.editReply({content: `${label} snippet successfully edited.` });
        } else {
            //await interaction.editReply({ content: `${label} snippet not found.`, ephemeral: true });
            await interaction.editReply({ content: `${label} snippet not found.` });
        }
    }
}