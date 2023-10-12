import logger from '../../utils/logger.js';
import Ticket from '../../schemas/ticket.js';

const watchedMessage = async (message) => {
    const ticket = await Ticket.findOne({ ticketThread: message.channel.id, isOpen: true });
    
    let content = `${message.content}\n`;
    let attachCount = 0;

    // Handle attachments regardless of whether the original message has content
    if (message.attachments.size > 0) {
        message.attachments.forEach(attachment => {
            attachCount++;
            content += `[User Link #${attachCount}](${attachment.url})\n`;
        });
    }

    await logger(ticket.ticketId, 'Secondary', message.author.id, message.author.username, 'Staff', content);
    winston.info(`Got message from ${message.author.tag} in ${message.channel.name} - Forum ${message.channel.parentId}, logged to ${ticket.ticketId}`);
};

export default watchedMessage;
