// This command is used to toggle alerts on or off for a ticket

import { ApplicationCommandOptionType } from 'discord.js';
import Ticket from '../../schemas/ticket.js';
import { handleTicketMessageUpdate } from '../../functions/threadFunctions.js';
import logger from '../../utils/logger.js';
import { checkPerms } from '../../functions/permissions.js';

export default {
    name: 'inactivetimer',
    description: 'Change the inactivity timer for a ticket',
    options: [
        {
            name: 'time',
            description: 'The time in hours to change the inactivity timer to',
            required: true,
            type: ApplicationCommandOptionType.Integer,
            choices: [
                {
                    name: '12 Hours',
                    value: 12
                },
                {
                    name: '24 Hours',
                    value: 24
                },
                {
                    name: '48 Hours',
                    value: 48
                },
                {
                    name: 'Disable Inactivity Timer',
                    value: 0
                }
            ]
        },
        {
            name: 'ticketid',
            description: 'The ticket ID to be changed',
            required: false,
            type: ApplicationCommandOptionType.Integer
        }
    ],
    callback: async (client, interaction) => {
        await interaction.deferReply();
        const ticketId = interaction.options.getInteger('ticketid');
        const time = interaction.options.getInteger('time');
        
        // Grab the ticket
        let ticket;
        if (!ticketId) { // Find by thread ID
            const threadId = interaction.channel.id;
            ticket = await Ticket.findOne({ ticketThread: threadId });
            if (!ticket) {
                await interaction.editReply(await messageObjectError('Ticket not found', true));
                return;
            }
        } else { // Find by ticket ID
            ticket = await Ticket.findOne({ ticketId: ticketId });
            if (!ticket) {
                await interaction.editReply(await messageObjectError('Ticket not found', true));
                return;
            }
        }

        // Permissions Check
        const isSeniorMod = await checkPerms(interaction, 2);
        if (interaction.user.id !== ticket.claimantModId && !isSeniorMod) {
            await interaction.editReply(await messageObjectError('You do not have permission to modify this ticket', true));
            return;
        }
        if(time === 0 || time === 48) {
            if (!isSeniorMod) {
                await interaction.editReply(await messageObjectError(`Only Senior Moderators and above may set inactivity timers to ${time}`, true));
                return;
            }
        }

        // Update the ticket
        ticket.inactivityTimer = time;
        await ticket.save();
        await logger(ticket.ticketId, 'Event', interaction.user.id, interaction.user.username, 'Staff', `Inactivity timer modified. Timer set to ${time}`);
        await interaction.editReply(await messageObjectAction(`Inactivity timer modified. Timer set to ${time}`, false));
        await handleTicketMessageUpdate(ticket);
    }
}
