const { ButtonBuilder, EmbedBuilder, ActionRowBuilder, } = require('discord.js');
const emojis = require("../emojis.json");

module.exports = async function modTicket(ticket) {
    let messageObject = {};
    let ticketStatus = ticket.isOpen ? 'Open' : 'Closed';
    let ticketCloseDate = ticket.closeDate;
    if (ticketCloseDate === null) {ticketCloseDate = 'Ticket Unresolved';}

    // Turn attachment array's into strings
    // Format of masked links: [Guide](https://discordjs.guide/ 'optional hovertext')
    let ticketAttachments = '';
    if (ticket.ticketAttachments.length === 0) {
        ticketAttachments = 'No attachments';
    } else {
        ticket.ticketAttachments.forEach(attachment => {
            ticketAttachments += attachment + '\n';
        });
    }
    let socialLinks = '';
    if (ticket.socialMediaLinks.length === 0) {
        socialLinks = 'No links provided';
    } else {
        ticket.socialMediaLinks.forEach(link => {
            socialLinks += link + '\n';
        });
    }

    let embedColor = [0,0,0] // Black
    let contentName1 = '\u200B';
    let contentValue1 = '\u200B';
    let contentName2 = '\u200B';
    let contentValue2 = '\u200B';
    let contentName3 = '\u200B';
    let contentValue3 = '\u200B';
    switch (ticket.ticketType) {
        case 'Player Report':
            embedColor = [219,53,62] // Red 
            contentName1 = "Reported User:";
            contentValue1 = ticket.reportedUser;
            contentName2 = "Report Reason:";
            contentValue2 = ticket.playerReportReason;
            break;
        case 'VIP Application':
            embedColor = [78,79,88] // Grey
            contentName1 = "Social Media Name:";
            contentValue1 = ticket.socialMediaName;
            contentName2 = "Application Description:";
            contentValue2 = ticket.vipAppDescription;
            contentName3 = "Social Media Links:";
            contentValue3 = socialLinks;
            break;
        case 'Technical Support':
            embedColor = [88,100,241] // Blue
            contentName1 = "Issue Type:";
            contentValue1 = ticket.techIssueType;
            contentName2 = "Issue Description:";
            contentValue2 = ticket.techIssueDescription;
            break;
        case 'Staff Report':
            embedColor = [219,53,62] // Red
            contentName1 = "Reported Mod:";
            contentValue1 = ticket.reportedMod;
            contentName2 = "Report Reason:";
            contentValue2 = ticket.modReportReason;
            break;
        case 'General Support':
            embedColor = [36,123,68] // Green
            contentName1 = "Support Description:";
            contentValue1 = ticket.generalSupportDescription;
            break;
        default:
            console.error('Unsupported ticket type.');
            return null;
    }

    const modTicketEmbedTop = new EmbedBuilder()
        .setColor(embedColor)
        .setTitle(`${ticket.ticketType} Ticket`)
        .setDescription(`${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`)
        .addFields(
            { name: 'Display Name:', value: ticket.userDisplayName, inline: true},{ name: 'User Name:', value: ticket.userName, inline: true},{ name: 'User ID:', value: ticket.userId, inline: true },
            { name: 'Total Tickets:', value: `${ticket.userTicketTotal}`, inline: true },{ name: 'Account Age:', value: daysToYearsMonthsDays(ticket.userAge), inline: true },{ name: 'Server Join Date:', value: daysToYearsMonthsDays(ticket.guildAge), inline: true },
            { name: `${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`, value: '\u200B' },
            { name: 'Ticket ID:', value: `${ticket.ticketId}`, inline: true },{ name: '\u200B', value: '\u200B', inline: true },{ name: 'Ticket Status', value: ticketStatus, inline: true },
            { name: 'Mod Assigned:', value: ticket.claimantModName, inline: true },{ name: 'Ticket Level:', value: `${ticket.ticketLevel}`, inline: true },{ name: 'Opened On:', value: formatDate(ticket.openDate), inline: true },
            { name: `${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`, value: '\u200B' },
        )
        .setImage('attachment://1px.png')
        ;
    const modTicketEmbedBottom = new EmbedBuilder()
    if (ticket.ticketType === 'VIP Application') {
        modTicketEmbedBottom
            .setColor(embedColor)
            .setTitle(`${ticket.ticketType} Ticket Information`)
            .setDescription(`${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`)
            .addFields(
                { name: contentName1, value: contentValue1},
                { name: contentName2, value: contentValue2},
                { name: contentName3, value: contentValue3},
                { name: `${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`, value: '\u200B' },
                { name: 'Last User Response:', value: formatDate(ticket.lastUserResponse), inline: true},{ name: '\u200B', value: '\u200B', inline: true},{ name: 'Last Mod Response:', value: formatDate(ticket.lastModResponse), inline: true},
                { name: `${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`, value: '\u200B' },
                { name: 'Ticket Close Date:', value: formatDate(ticket.closeDate) },
                { name: 'Mod Notes:', value: ticket.modNotes },
                { name: `${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`, value: '\u200B' },
                { name: 'Attachments:', value: ticketAttachments},
            )
            .setImage('attachment://1px.png')
            ;
    } else if (ticket.ticketType === 'General Support') {
        modTicketEmbedBottom
            .setColor(embedColor)
            .setTitle(`${ticket.ticketType} Ticket Information`)
            .setDescription(`${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`)
            .addFields(
                { name: contentName1, value: contentValue1},
                { name: `${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`, value: '\u200B' },
                { name: 'Last User Response:', value: formatDate(ticket.lastUserResponse), inline: true},{ name: '\u200B', value: '\u200B', inline: true},{ name: 'Last Mod Response:', value: formatDate(ticket.lastModResponse), inline: true},
                { name: `${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`, value: '\u200B' },
                { name: 'Ticket Close Date:', value: formatDate(ticket.closeDate) },
                { name: 'Mod Notes:', value: ticket.modNotes },
                { name: `${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`, value: '\u200B' },
                { name: 'Attachments:', value: ticketAttachments},
            )
            .setImage('attachment://1px.png')
            ;
    } else {
        modTicketEmbedBottom
            .setColor(embedColor)
            .setTitle(`${ticket.ticketType} Ticket Information`)
            .setDescription(`${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`)
            .addFields(
                { name: contentName1, value: contentValue1},
                { name: contentName2, value: contentValue2},
                { name: `${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`, value: '\u200B' },
                { name: 'Last User Response:', value: formatDate(ticket.lastUserResponse), inline: true},{ name: '\u200B', value: '\u200B', inline: true},{ name: 'Last Mod Response:', value: formatDate(ticket.lastModResponse), inline: true},
                { name: `${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`, value: '\u200B' },
                { name: 'Ticket Close Date:', value: formatDate(ticket.closeDate) },
                { name: 'Mod Notes:', value: ticket.modNotes },
                { name: `${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`, value: '\u200B' },
                { name: 'Attachments:', value: ticketAttachments},
            )
            .setImage('attachment://1px.png')
            ;
    }
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
    const reopen_button = new ButtonBuilder()
        .setCustomId('reopen_button')
        .setLabel('Reopen')
        .setStyle('Success');

    // Create Button Row
    const claimedRow = new ActionRowBuilder()
        .addComponents(unclaim_button, escalate_button, logs_button, snippets_button, close_button);
    const unclaimedRow = new ActionRowBuilder()
        .addComponents(claim_button, escalate_button, logs_button, snippets_button, close_button);
    const closingRow = new ActionRowBuilder()
        .addComponents(reopen_button, logs_button);

    // Display Logic
    if (!ticket.isClaimed && ticket.isOpen) {
        messageObject = { embeds: [modTicketEmbedTop, modTicketEmbedBottom], files: [{attachment: './resources/1px.png', name: '1px.png'}], components: [unclaimedRow] };
    } else if (ticket.isClaimed && ticket.isOpen) {
        messageObject = { embeds: [modTicketEmbedTop, modTicketEmbedBottom], files: [{attachment: './resources/1px.png', name: '1px.png'}], components: [claimedRow] };
    } else if (!ticket.isOpen) {
        messageObject = { embeds: [modTicketEmbedTop, modTicketEmbedBottom], files: [{attachment: './resources/1px.png', name: '1px.png'}], components: [closingRow] };
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
    // Check if the date is valid
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
        return 'Ticket Unresolved';
    }
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