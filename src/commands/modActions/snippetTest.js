const {
    ApplicationCommandOptionType,
    PermissionFlagsBits,
  } = require('discord.js');

module.exports = {
    name: 'generatesnippet',
    description: 'Generate a snippet',
    options: [{
            name: 'snippet',
            description: 'The snippet you want to generate',
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: [
                {
                    name: 'Snippet1',
                    value: 'Thank you for submitting a ticket, we will get back to you as soon as possible.'
                },
                {
                    name: 'Snippet2',
                    value: 'More stuff'
                },
                {
                    name: 'Snippet3',
                    value: 'asdfasdfasdfasdf'
                },
                {
                    name: 'Snippet4',
                    value: 'sdfjbnsledkbvnsadifvbunsdflik'
                },
            ]
    }
    ],
    callback: async (client, interaction) => {
        await interaction.deferReply();
        const snippetToSend = interaction.options.getString('snippet');
        await interaction.editReply(snippetToSend);
    }
}