import { ApplicationCommandOptionType } from "discord.js";
import Ticket from "../../schemas/ticket.js";
import { popoutLogs } from "../../functions/logView.js";

export default {
    name: 'popoutlogs',
    description: 'View the logs popped out of a ticket',
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
        if (!ticket) return await interaction.editReply(await messageObjectError(`Ticket not found.`));

        await popoutLogs(interaction, ticket);
    }
}