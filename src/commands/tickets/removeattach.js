import Ticket from '../../schemas/ticket.js';
import { ActionRowBuilder, ApplicationCommandOptionType, StringSelectMenuBuilder } from 'discord.js';
import { messageObjectError } from '../../functions/responseFunctions.js';

export default {
    name: 'removeattach',
    description: 'Removes an attachment from a ticket.',
    options: [
        {
            name: 'ticket-id',
            description: 'The ID of the ticket you want to remove an attachment from.',
            type: ApplicationCommandOptionType.String,
            required: false,
        }
    ],
    callback: async (client, interaction) => {
        await interaction.deferReply();
        let ticket;
        if (interaction.options.get('ticket-id')) {
            ticket = await Ticket.findOne({ ticketId: interaction.options.get('ticket-id').value });
        } else {
            ticket = await Ticket.findOne({ ticketThread: interaction.channel.id});
        }
        if (!ticket) {
            await interaction.editReply(await messageObjectError('Ticket not found', true));
            return;
        }

        if (ticket.ticketAttachments.length === 0) {
            await interaction.editReply(await messageObjectError('This ticket has no attachments', true));
            return;
        }

        // Create a select menu from the attachments
        const attachmentsSelect = new StringSelectMenuBuilder()
            .setCustomId('remove_attachment_select')
            .setPlaceholder('Select an attachment to remove')
            .addOptions(ticket.ticketAttachments.map((link, index) => {
                let label = link.replace(/^https?:\/\//, '');

                // If the link is longer than the max length, truncate and append '...'
                if (label.length > 25) {
                    label = label.substring(0, 25 - 3) + '...'; // Max length 25 char
                }

                return {
                    label: label,  // Shows the truncated link or full link if it's short
                    value: link  // The actual link used when an item is selected
                };
            }));

        const row = new ActionRowBuilder().addComponents(attachmentsSelect);

        await interaction.editReply({
            content: 'Select the attachment you want to remove:',
            components: [row]
        });
    }
}