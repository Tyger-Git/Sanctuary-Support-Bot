const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'togglealerts',
    description: 'Toggle alerts on or off',
    options: [
        {
            name: 'toggle',
            description: 'Toggle alerts on or off',
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: [
                {
                    name: 'on',
                    value: 'on'
                },
                {
                    name: 'off',
                    value: 'off'
                }
            ]
        },
        {
            name: 'ticketid',
            description: 'The ticket ID to toggle alerts for',
            required: false,
            type: ApplicationCommandOptionType.Integer
        },
    ],
    devOnly: true,
    callback: async (client, interaction) => {
        await interaction.deferReply();
        // ticket ID needs to be found out from the thread if the field is empty
        const givenTicketId = interaction.options.getInteger('ticketId');
        const toggle = interaction.options.getString('toggle');
        const ticketSchema = require("../../schemas/ticket");



        await interaction.editReply(`Alerts successfully toggled to ${toggle}.`);

    }
}
