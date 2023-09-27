import { ApplicationCommandOptionType } from "discord.js";
import Ticket from "../../schemas/ticket.js";
import { longLogs } from "../../functions/logView.js";

export default {
    name: 'fulllogs',
    description: 'View the full logs of a ticket',
    options: [
        {
            name: 'ticket-id',
            description: 'The ID of the ticket you want to view the logs of.',
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
        if (!ticket) return await interaction.editReply(ticketErrorMessageObject(`Ticket not found.`));

        await longLogs(interaction, ticket);
    }
}