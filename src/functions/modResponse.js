const { EmbedBuilder } = require('discord.js');

async function modResponse(client, ticket, response) {
    try {
        // Fetch the user using the client and userId from ticket
        const user = await client.users.fetch(ticket.userId);

        if (!user) {
            console.error(`Failed to find user with ID: ${ticket.userId}`);
            return;
        }

        // Create a message embed for a richer DM content (optional)
        const embed = new EmbedBuilder()
            .setTitle('Ticket Response')
            .setDescription('A moderator has responded to your ticket:')
            .addFields(
                {name: `Ticket ID: ${ticket.ticketId.toString()}`,value: response}
            )

        // Send the DM
        await user.send({ embeds: [embed] });

    } catch (error) {
        console.error('Error sending DM:', error);
    }
}

module.exports = modResponse;