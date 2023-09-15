// Test command to create a new ticket thread
/*---------- Will Not Be In Final Product ----------*/

import Ticket from '../../schemas/ticket.js';
import { getParentChannelID } from '../../functions/threadFunctions.js';

export default {
    name: 'newticketthread',
    description: 'Creates a new ticket thread',
    devOnly: true,
    callback: async (client, interaction) => {
        // Fetch ticket from MongoDB (I'm using a mock function, you need to replace this)
        const ticket = await Ticket.findOne({ isOpen: true, threadCreated: false }); // Find an open ticket without a thread
        
        if (!ticket) {
            return interaction.reply('No open tickets found without threads.');
        }

        // Get the correct parent forum ID based on ticket type
        let parentChannelId = getParentChannelID(ticket);

        // Fetch the parent channel using the Discord.js client
        let parentChannel;
        try {
            parentChannel = await client.channels.fetch(parentChannelId);
            console.log(parentChannel.type);
        } catch (error) {
            console.error('Error fetching parent channel:', error);
        }
        
        if (!parentChannel || parentChannel.type !== 15) {
            return interaction.reply('Parent channel not found or not a text channel.');
        }

        // Create a new thread inside the parent channel
        const thread = await parentChannel.threads.create({
            name: `Ticket-${ticket.ticketId}`,
            message: `Thread created for Ticket ID: ${ticket.ticketId}`,
            autoArchiveDuration: 60,  // You can set autoArchiveDuration as per your needs
        });
        const newThreadID = thread.id;

        if (!thread) {
            return interaction.reply('Failed to create the thread.');
        }

        // Update the ticket's threadCreated flag in MongoDB
        ticket.threadCreated = true;
        await ticket.save();
        return interaction.reply(`Thread created for ticket ID: ${ticket.ticketId}\nTicket Type: ${ticket.ticketType}\n[Link to ticket](https://discord.com/channels/${ticket.guildId}/${newThreadID})`);
    }
}