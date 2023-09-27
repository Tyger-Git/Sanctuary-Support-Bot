// This command is used to claim a ticket

import { claimTicket } from "../../functions/ticketFunctions.js";
import { ApplicationCommandOptionType } from 'discord.js';

export default {
    name: 'claim',
    description: 'Claim a ticket.',
    options: [
        {
            name: 'ticket-id',
            description: 'The ID of the ticket you want to claim.',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
    ],
    callback: async (client, interaction) => {
        await interaction.deferReply();
        await claimTicket(interaction, 'slash');
    }
}