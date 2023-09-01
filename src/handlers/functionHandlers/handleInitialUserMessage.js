const { EmbedBuilder } = require('discord.js');

async function handleDMKickoff(client, ticket) {
    try {
        // Fetch the user using the client and userId from ticket
        const user = await client.users.fetch(ticket.userId);

        if (!user) {
            console.error(`Failed to find user with ID: ${ticket.userId}`);
            return;
        }

        // Create a message embed for a richer DM content (optional)
        const embed = new EmbedBuilder()
            .setTitle('Ticket Created')
            .setDescription('Your ticket has been created and will be processed shortly.')
            .addFields(
                {name: 'Ticket ID',value: ticket.ticketId.toString()}
                )

        // Send the DM
        await user.send({ embeds: [embed] });

    } catch (error) {
        console.error('Error sending DM:', error);
    }
}

/*------------------------------------------------------------------------------------------------------------------------*/
// Export the functions
/*------------------------------------------------------------------------------------------------------------------------*/

module.exports = handleDMKickoff;