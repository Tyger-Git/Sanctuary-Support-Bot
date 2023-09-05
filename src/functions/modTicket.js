const { ButtonBuilder, EmbedBuilder, ActionRowBuilder, } = require('discord.js');
const emojis = require("../emojis.json");

module.exports = async function modTicket(ticket) {
    let messageObject = {};
    let ticketStatus = ticket.isOpen ? 'Open' : 'Closed';
    let ticketAttachments = '';
    if (ticket.ticketAttachments.length === 0) {
        ticketAttachments = 'No attachments';
    } else {
        ticket.ticketAttachments.forEach(attachment => {
            ticketAttachments += attachment + '\n';
        });
    }
    embedColor = [0,0,0] // Black
    switch (ticket.ticketType) {
        case 'Player Report':
            embedColor = [219,53,62] // Red 
            break;
        case 'VIP Application':
            embedColor = [78,79,88] // Grey
            break;
        case 'Technical Support':
            embedColor = [88,100,241] // Blue
            break;
        case 'Staff Report':
            embedColor = [219,53,62] // Red
            break;
        case 'General Support':
            embedColor = [36,123,68] // Green
            break;
        default:
            console.error('Unsupported ticket type.');
            return null;
    }

    const modTicketEmbed = new EmbedBuilder()
        .setColor(embedColor) // Purple
        .setTitle(`${ticket.ticketType} Ticket`)
        .setDescription(`${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`)
        .addFields(
            { name: 'User Name:', value: ticket.userName},
            { name: 'User ID:', value: ticket.userId, inline: true },{ name: 'Account Age:', value: daysToYearsMonthsDays(ticket.userAge), inline: true },{ name: 'Membership Age:', value: daysToYearsMonthsDays(ticket.guildAge), inline: true },
            { name: 'Ticket ID:', value: `${ticket.ticketId}`, inline: true },{ name: 'Total Tickets Opened:', value: `${ticket.userTicketTotal}`, inline: true },{ name: 'Ticket Status', value: ticketStatus, inline: true },
            { name: 'Mod Assigned:', value: ticket.claimantModName, inline: true },{ name: 'Ticket Level:', value: `${ticket.ticketLevel}`, inline: true },{ name: 'Created On:', value: formatDate(ticket.openDate), inline: true },
            { name: `${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`, value: '\u200B' },
            { name: 'Mod Notes:', value: ticket.modNotes },
            { name: 'Attachments:', value: ticketAttachments},
        )
        .setImage('attachment://support.png')
        ;
    
    // Create Buttons
    const claim_button = new ButtonBuilder()
        .setCustomId('claim_button')
        .setLabel('Claim')
        .setStyle('Success'); // You can set this to SECONDARY, SUCCESS, DANGER, or LINK too
    const unclaim_button = new ButtonBuilder()
        .setCustomId('unclaim_button')
        .setLabel('Unclaim')
        .setStyle('Danger'); // You can set this to SECONDARY, SUCCESS, DANGER, or LINK too
    const escalate_button = new ButtonBuilder()
        .setCustomId('escalate_button')
        .setLabel('Escalate')
        .setStyle('Primary');
    const snippets_button = new ButtonBuilder()
        .setCustomId('snippets_button')
        .setLabel('Snippets')
        .setStyle('Primary');
    const close_button = new ButtonBuilder()
        .setCustomId('close_button')
        .setLabel('Close')
        .setStyle('Danger');
    const logs_button = new ButtonBuilder()
        .setCustomId('logs_button')
        .setLabel('Logs')
        .setStyle('Secondary');

    // Create Button Row
    const row1 = new ActionRowBuilder()
        .addComponents(unclaim_button, escalate_button, logs_button, snippets_button, close_button);
    const row2 = new ActionRowBuilder()
        .addComponents(claim_button, escalate_button, logs_button, snippets_button, close_button);

    // Logic for what buttons to show
    const ticketClaimed = ticket.isClaimed; // Placeholder for now, would pull from DB
    if (ticketClaimed) {
        messageObject = { embeds: [modTicketEmbed], files: [{attachment: './resources/support.png', name: 'support.png'}], components: [row1] };
    } else {
        messageObject = { embeds: [modTicketEmbed], files: [{attachment: './resources/support.png', name: 'support.png'}], components: [row2] };
    }
    return messageObject;
};

function daysToYearsMonthsDays(age) {
    const daysInYear = 365.25; // Taking into account leap years
    const daysInMonth = 30.44; // Average days in a month considering all months

    // Calculate total years, and then the remaining days
    const years = Math.floor(age / daysInYear);
    age -= years * daysInYear;

    // Calculate total months from the remaining days, then the remaining days again
    const months = Math.floor(age / daysInMonth);
    age -= months * daysInMonth;

    // What's left now is the days
    const days = Math.round(age); // Rounding to nearest day

    return `${years}y - ${months}m - ${days}d`;
}

function formatDate(date) {
    // Get the day, month, and year
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = String(date.getFullYear()).slice(-2); // Last two digits of the year

    // Get the hours and minutes
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // Return the formatted string
    return `${month}/${day}/${year} - ${hours}:${minutes}`;
}