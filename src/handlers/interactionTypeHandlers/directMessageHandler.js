const Ticket = require('../../schemas/ticket');
const clientSingleton = require('../../utils/DiscordClientInstance');
const config = require('../../../config.json');

module.exports = async (message) => {
    console.log(`Got DM from ${message.author.tag}`);

    // Check if the user has an open ticket
    const ticket = await Ticket.findOne({ userId: message.author.id, isOpen: true });

    if (ticket) {
        // Use the client singleton to get the Discord client
        const client = clientSingleton.getClient();

        // Fetch the associated thread using the stored ticketThread ID
        const thread = await client.channels.fetch(ticket.ticketThread);

        if (thread) {
            // Send the user's message to the thread
            await thread.send(`**${message.author.tag} replied to ticket:**\n\n${message.content}`);
        } else {
            // This is just a safety check in case the thread doesn't exist for some reason.
            await message.reply("Sorry, there seems to be an issue with your ticket's thread. Please contact support.");
        }
    } else {
        // Reply to the user if they don't have an open ticket
        await message.reply(`You don't have an open ticket. If you wish to create one, please follow the instructions here: <${config.supportmessage}>`);
    }
};
