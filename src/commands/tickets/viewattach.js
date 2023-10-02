import Ticket from '../../schemas/ticket.js';
import emojis from '../../emojis.json' assert { type: "json" };
import { EmbedBuilder, ApplicationCommandOptionType } from 'discord.js';

export default {
    name: 'viewattach',
    description: 'View the attachments of a ticket',
    options: [
        {
            name: 'ticket-id',
            description: 'The ID of the ticket you want to view the attachments of.',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
    ],
    callback: async (client, interaction) => {
        await interaction.deferReply();

        // Get ticket
        let ticket;
        if (interaction.options.get('ticket-id')) {
            ticket = await Ticket.findOne({ ticketId: interaction.options.get('ticket-id').value });
        } else {
            ticket = await Ticket.findOne({ ticketThread: interaction.channelId });
        }
        if (!ticket) return await interaction.editReply(await ticketErrorMessageObject(`Ticket not found.`));
        // Return attachments
        let ticketAttachments = ``;
        ticket.ticketAttachments.forEach(attachment => {
            ticketAttachments += emojis.redDot + attachment + `\n`;
        });
        const embed = new EmbedBuilder()
            .setTitle(`🔗 Ticket Attachments for ticket #${ticket.ticketId} 🔗`)
            .setDescription(ticketAttachments)
            .setColor([255, 255, 255]); // White
        
        await interaction.editReply({ embeds: [embed] });
    }
}