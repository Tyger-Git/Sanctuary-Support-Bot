// Initial user message upon ticket creation

import { EmbedBuilder } from 'discord.js';
import emojis from '../../emojis.json' assert { type: 'json' };

async function handleInitialUserMessage(client, ticket) {
    try {
        // Fetch the user using the client and userId from ticket
        const user = await client.users.fetch(ticket.userId);
        // If the user doesn't exist, log an error and return
        if (!user) {
            console.error(`Failed to find user with ID: ${ticket.userId}`);
            return;
        }
        const date = new Date();
        const embed = new EmbedBuilder()
            .setTitle(`${emojis.ticketRecieved} Ticket Created - Ticket ID: ${ticket.ticketId.toString()}`)
            .setDescription('Thanks for contacting us! Our Staff-Members have been notified and will respond as soon as possible.')
            .setFooter({ text: `©️ Sanctuary Development Team · ${date.getFullYear()}` })
            .setColor([0, 255, 0]); // Green

        // Send the DM
        await user.send({ embeds: [embed] });

    } catch (error) {
        console.error('Error sending DM:', error);
    }
}

export default handleInitialUserMessage;