import Ticket from '../../schemas/ticket.js';
import { EmbedBuilder, ApplicationCommandOptionType } from 'discord.js';
import logger from '../../utils/logger.js';
import { handleTicketMessageUpdate } from '../../functions/threadFunctions.js';
import { ticketErrorMessageObject } from '../../functions/responseFunctions.js';

export default {
    name: 'addattach',
    description: 'Adds an attachment to a ticket.',
    options: [
        {
            name: 'attachment',
            description: 'The attachment you want to add to the ticket.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'ticket-id',
            description: 'The ID of the ticket you want to add an attachment to.',
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
            ticket = await Ticket.findOne({ ticketThread: interaction.channel.id, isOpen: true });
        }
        if (!ticket) {
            await interaction.editReply(await ticketErrorMessageObject('Ticket not found', true));
            return;
        }
        const attachment = interaction.options.get('attachment').value;
        const regex = /https?:\/\/[^\s]+/g;
        const hyperlinks = attachment.match(regex) || [];

        if (hyperlinks.length){
            // Spread Operator to add the hyperlinks to the ticketAttachments array, then remove duplicates
            ticket.ticketAttachments = [...ticket.ticketAttachments, ...hyperlinks];
            ticket.ticketAttachments = [...new Set(ticket.ticketAttachments)];
            let attachmentEmbed = new EmbedBuilder()
                .setTitle(`🔗 Hyperlinks Manually Added 🔗`)
                .setDescription(`Added ${hyperlinks.length} link(s) to the ticket`);
            await interaction.editReply({ embeds: [attachmentEmbed] });
            await ticket.save();
            await handleTicketMessageUpdate(ticket);
            await logger(ticket.ticketId, 'Event', interaction.user.id, interaction.user.username, 'Staff', 'Hyperlinks manually added to ticket.');
        }
    }
}