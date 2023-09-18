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
        //await interaction.deferReply({ ephemeral: true });
        await interaction.deferReply();
        const label = interaction.options.getString('label');
        const snippet = await Snippet.findOne({ snippetName: label });
        if (snippet){
            await snippet.delete();
            //await interaction.editReply({ content:`${label} snippet successfully deleted.`, ephemeral: true});
            await interaction.editReply({ content:`${label} snippet successfully deleted.` });
        } else {
            //await interaction.editReply({ content:`${label} snippet not found.`, ephemeral: true});
            await interaction.editReply({ content:`${label} snippet not found.` });
        }
    }
}