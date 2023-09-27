// This command is used to toggle alerts on or off for a ticket

import { ApplicationCommandOptionType } from 'discord.js';
import Ticket from '../../schemas/ticket.js';
import { handleTicketMessageUpdate } from '../../functions/threadFunctions.js';
import logger from '../../utils/logger.js';

export default {
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
    callback: async (client, interaction) => {
        await interaction.deferReply();
        const toggle = interaction.options.getString('toggle');
        const ticketId = interaction.options.getInteger('ticketid');
        let ticket;

        if (!ticketId) { // Find by thread ID
            const threadId = interaction.channel.id;
            try {
                ticket = await Ticket.findOne({ ticketThread: threadId });
            } catch (error) {
                console.error('Error finding ticket:', error);
            }
            if (!ticket) {
                await interaction.editReply(await ticketErrorMessageObject('Ticket not found', true));
                return;
            }
            ticket.isAlertOn = toggle === 'on';
            await ticket.save();
            await interaction.editReply(await ticketActionMessageObject(`Alerts toggled ${toggle}`, false));
            await handleTicketMessageUpdate(ticket);
        } else { // Find by ticket ID
            try {
                ticket = await Ticket.findOne({ ticketId: ticketId });
            } catch (error) {
                console.error('Error finding ticket:', error);
            }
            if (!ticket) {
                await interaction.editReply(await ticketErrorMessageObject('Ticket not found', true));
                return;
            }
            ticket.isAlertOn = toggle === 'on';
            await ticket.save();
            await logger(ticket.ticketId, 'Event', interaction.user.id, interaction.user.username, 'Bot', `Alerts toggled ${toggle}`);
            await interaction.editReply(await ticketActionMessageObject(`Alerts toggled ${toggle}`, true));
        }
    }
}
