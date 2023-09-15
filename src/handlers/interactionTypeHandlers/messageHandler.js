import logger from '../../utils/logger.js';
import Ticket from '../../schemas/ticket.js';

const watchedMessage = async (message) => {
    const ticket = await Ticket.findOne({ ticketThread: message.channel.id, isOpen: true });
    await logger(ticket.ticketThread, 'Secondary', message.author.id, 'Staff', message.content);
    console.log(`Got message from ${message.author.tag} in ${message.channel.name} - Forum ${message.channel.parentId}, logged to ${ticket.ticketThread}`);
};

export default watchedMessage;
