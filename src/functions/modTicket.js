// Main function to return a message object for a mod ticket, or list of tickets

import { ButtonBuilder, EmbedBuilder, ActionRowBuilder } from 'discord.js';
import emojis from '../emojis.json' assert { type: 'json' };
import { getUserLevel } from './permissions.js';

const modTicket = async (ticket) => {
    let messageObject = {};
    let ticketStatus = ticket.isOpen ? `Open` : `Closed`;
    // Turn ticketLevel into a string
    let ticketLevel;
    if (ticket.ticketLevel === 0) {ticketLevel = `Helper`;}
    else if (ticket.ticketLevel === 1) {ticketLevel = `Moderator`;}
    else if (ticket.ticketLevel === 2) {ticketLevel = `Senior Mod`;}
    else if (ticket.ticketLevel === 3) {ticketLevel = `Head Mod`;}
    else if (ticket.ticketLevel >= 4) {ticketLevel = `Admin`;}

    let ticketCloseDate = ticket.closeDate;
    if (ticketCloseDate === null) {ticketCloseDate = `Ticket Unresolved`;}

    let modAssigned = `Unclaimed`;
    if (ticket.claimantModName !== `Unclaimed`) {modAssigned = `<@${ticket.claimantModId}>`;}

    // Turn attachment array`s into strings
    // Format of masked links: [Guide](https://discordjs.guide/ `optional hovertext`)
    let ticketAttachments = ``;
    if (ticket.ticketAttachments.length === 0) {
        ticketAttachments = `No attachments`;
    } else {
        ticket.ticketAttachments.forEach(attachment => {
            ticketAttachments += emojis.redDot + attachment + `\n`;
        });
    }
    let socialLinks = ``;
    if (ticket.socialMediaLinks.length === 0) {
        socialLinks = `No links provided`;
    } else {
        ticket.socialMediaLinks.forEach(link => {
            socialLinks += link + `\n`;
        });
    }

    let embedColor = [0,0,0] // Black
    let contentName1 = `\u200B`;
    let contentValue1 = `\u200B`;
    let contentName2 = `\u200B`;
    let contentValue2 = `\u200B`;
    let contentName3 = `\u200B`;
    let contentValue3 = `\u200B`;
    switch (ticket.ticketType) {
        case `User Report`:
            embedColor = [219,53,62] // Red 
            contentName1 = "Reported User:";
            contentValue1 = ticket.reportedUser;
            contentName2 = "Report Reason:";
            contentValue2 = ticket.userReportReason;
            break;
        case `VIP Application`:
            embedColor = [255,223,0] // Gold
            contentName1 = "Social Media Name:";
            contentValue1 = ticket.socialMediaName;
            contentName2 = "Application Description:";
            contentValue2 = ticket.vipAppDescription;
            contentName3 = "Social Media Links:";
            contentValue3 = socialLinks;
            break;
        case `Technical Support`:
            embedColor = [88,100,241] // Blue
            contentName1 = "Issue Type:";
            contentValue1 = ticket.techIssueType;
            contentName2 = "Issue Description:";
            contentValue2 = ticket.techIssueDescription;
            break;
        case `Appeal`:
            embedColor = [219,53,62] // Red
            contentName1 = "Ticket To Appeal:";
            contentValue1 = ticket.ticketToAppeal;
            contentName2 = "Reason For Appeal:";
            contentValue2 = ticket.appealReasoning;
            break;
        case `General Support`:
            embedColor = [36,123,68] // Green
            contentName1 = "Support Description:";
            contentValue1 = ticket.generalSupportDescription;
            break;
        default:
            winston.error(`Unsupported ticket type.`);
            return null;
    }
    const modTicketEmbedTop = new EmbedBuilder()
        .setColor(embedColor)
        .setTitle(`${ticket.ticketType} Ticket`)
        .setThumbnail(ticket.userThumbnail)
        .setDescription(`${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`)
        .addFields(
            { name: `${emojis.redCircle} Display Name:`, value: `${emojis.redRightHook} ${ticket.userDisplayName}`}
        )
        .setImage(`attachment://1px.png`)
        ;
    const modTicketEmbedMid = new EmbedBuilder()
        .setColor(embedColor)
        .setTitle(`User/Ticket Information`)
        .setDescription(`${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`)
        .addFields(
            { name: `${emojis.redCircle} User Name:`, value: `${emojis.redRightHook} \`${ticket.userName}\``, inline: true},{ name: `${emojis.redCircle} User ID:`, value: `${emojis.redRightHook} \`${ticket.userId}\``, inline: true },{ name: `\u200B`, value: `\u200B`, inline: true},
            { name: `${emojis.redCircle} Total Tickets:`, value: `${emojis.redRightHook} ${ticket.userTicketTotal}`, inline: true },{ name: `${emojis.redCircle} Account Age:`, value: `${emojis.redRightHook} ${daysToYearsMonthsDays(ticket.userAge)}`, inline: true },{ name: `${emojis.redCircle} Server Tenure:`, value: `${emojis.redRightHook} ${daysToYearsMonthsDays(ticket.guildAge)}`, inline: true },
            { name: `${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`, value: `\u200B` },
            { name: `${emojis.redCircle} Ticket ID:`, value: `${emojis.redRightHook} \`${ticket.ticketId}\``, inline: true },{ name: `\u200B`, value: `\u200B`, inline: true },{ name: `${emojis.redCircle} Ticket Status`, value: `${emojis.redRightHook} ${ticketStatus}`, inline: true },
            { name: `${emojis.redCircle} Mod Assigned:`, value: `${emojis.redRightHook} ${modAssigned}`, inline: true },{ name: `${emojis.redCircle} Ticket Level:`, value: `${emojis.redRightHook} ${ticketLevel}`, inline: true },{ name: `${emojis.redCircle} Opened On:`, value: `${emojis.redRightHook} ${formatDate(ticket.openDate)}`, inline: true },
            { name: `${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`, value: `\u200B` },
        )
        .setImage(`attachment://1px.png`)
        ;
    const modTicketEmbedBottom = new EmbedBuilder()
    if (ticket.ticketType === `VIP Application`) {
        modTicketEmbedBottom
            .setColor(embedColor)
            .setTitle(`${ticket.ticketType} Information`)
            .setDescription(`${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`)
            .addFields(
                { name: `${emojis.redCircle} ${contentName1}`, value: `${emojis.redRightHook} ${contentValue1}`},
                { name: `${emojis.redCircle} ${contentName2}`, value: `${emojis.redRightHook} ${contentValue2}`},
                { name: `${emojis.redCircle} ${contentName3}`, value: `${emojis.redRightHook} ${contentValue3}`},
                { name: `${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`, value: `\u200B` },
                { name: `${emojis.redCircle} User Replied:`, value:  `${emojis.redRightHook} ${formatDate(ticket.lastUserResponse)}`, inline: true},{ name: `${emojis.redCircle} Inactivity Timer:`, value: `${emojis.redRightHook} ${ticket.inactivityTimer}`, inline: true },{ name: `${emojis.redCircle} Mod Replied:`, value: `${emojis.redRightHook} ${formatDate(ticket.lastModResponse)}`, inline: true},
                { name: `${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`, value: `\u200B` },
                { name: `${emojis.redCircle} Ticket Close Date:`, value: `${emojis.redRightHook} ${formatDate(ticket.closeDate)}` },
                { name: `${emojis.redCircle} Mod Notes:`, value: `${emojis.redRightHook} *${ticket.modNotes}*` },
                { name: `${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`, value: `\u200B` },
                { name: `🔗 Ticket Attachments 🔗`, value: ticketAttachments},
            )
            .setImage(`attachment://1px.png`)
            ;
    } else if (ticket.ticketType === `General Support`) {
        modTicketEmbedBottom
            .setColor(embedColor)
            .setTitle(`${ticket.ticketType} Information`)
            .setDescription(`${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`)
            .addFields(
                { name: `${emojis.redCircle} ${contentName1}`, value: `${emojis.redRightHook} ${contentValue1}`},
                { name: `${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`, value: `\u200B` },
                { name: `${emojis.redCircle} User Replied:`, value:  `${emojis.redRightHook} ${formatDate(ticket.lastUserResponse)}`, inline: true},{ name: `${emojis.redCircle} Inactivity Timer:`, value: `${emojis.redRightHook} ${ticket.inactivityTimer}`, inline: true },{ name: `${emojis.redCircle} Mod Replied:`, value: `${emojis.redRightHook} ${formatDate(ticket.lastModResponse)}`, inline: true},
                { name: `${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`, value: `\u200B` },
                { name: `${emojis.redCircle} Ticket Close Date:`, value: `${emojis.redRightHook} ${formatDate(ticket.closeDate)}` },
                { name: `${emojis.redCircle} Mod Notes:`, value: `${emojis.redRightHook} *${ticket.modNotes}*` },
                { name: `${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`, value: `\u200B` },
                { name: `🔗 Ticket Attachments 🔗`, value: ticketAttachments},
            )
            .setImage(`attachment://1px.png`)
            ;
    } else {
        modTicketEmbedBottom
            .setColor(embedColor)
            .setTitle(`${ticket.ticketType} Information`)
            .setDescription(`${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`)
            .addFields(
                { name: `${emojis.redCircle} ${contentName1}`, value: `${emojis.redRightHook} ${contentValue1}`},
                { name: `${emojis.redCircle} ${contentName2}`, value: `${emojis.redRightHook} ${contentValue2}`},
                { name: `${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`, value: `\u200B` },
                { name: `${emojis.redCircle} User Replied:`, value:  `${emojis.redRightHook} ${formatDate(ticket.lastUserResponse)}`, inline: true},{ name: `${emojis.redCircle} Inactivity Timer:`, value: `${emojis.redRightHook} ${ticket.inactivityTimer}`, inline: true },{ name: `${emojis.redCircle} Mod Replied:`, value: `${emojis.redRightHook} ${formatDate(ticket.lastModResponse)}`, inline: true},
                { name: `${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`, value: `\u200B` },
                { name: `${emojis.redCircle} Ticket Close Date:`, value: `${emojis.redRightHook} ${formatDate(ticket.closeDate)}` },
                { name: `${emojis.redCircle} Mod Notes:`, value: `${emojis.redRightHook} *${ticket.modNotes}*` },
                { name: `${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`, value: `\u200B` },
                { name: `🔗 Ticket Attachments 🔗`, value: ticketAttachments},
            )
            .setImage(`attachment://1px.png`)
            ;
    }
    // Create Buttons
    const claim_button = new ButtonBuilder()
        .setCustomId(`claim_button`)
        .setLabel(`Claim`)
        .setStyle(`Success`); // You can set this to SECONDARY, SUCCESS, DANGER, or LINK too
    const unclaim_button = new ButtonBuilder()
        .setCustomId(`unclaim_button`)
        .setLabel(`Unclaim`)
        .setStyle(`Danger`); // You can set this to SECONDARY, SUCCESS, DANGER, or LINK too
    const escalate_button = new ButtonBuilder()
        .setCustomId(`escalate_button`)
        .setLabel(`Escalate`)
        .setStyle(`Primary`);
    const snippets_button = new ButtonBuilder()
        .setCustomId(`snippets_button`)
        .setLabel(`Snippets`)
        .setStyle(`Primary`);
    const close_button = new ButtonBuilder()
        .setCustomId(`close_button`)
        .setLabel(`Close`)
        .setStyle(`Danger`);
    const logs_button = new ButtonBuilder()
        .setCustomId(`logs_button:${ticket.ticketId}`) // Embed the ticket ID into the button
        .setLabel(`Logs`)
        .setStyle(`Secondary`);
    const reopen_button = new ButtonBuilder()
        .setCustomId(`reopen_button`)
        .setLabel(`Reopen`)
        .setStyle(`Success`);

    // Create Button Row
    const claimedRow = new ActionRowBuilder()
        .addComponents(unclaim_button, escalate_button, logs_button, snippets_button, close_button);
    const unclaimedRow = new ActionRowBuilder()
        .addComponents(claim_button, escalate_button, logs_button, snippets_button, close_button);
    const closingRow = new ActionRowBuilder()
        .addComponents(reopen_button, logs_button);

    // Display Logic
    if (!ticket.isClaimed && ticket.isOpen) {
        messageObject = { embeds: [modTicketEmbedTop, modTicketEmbedMid, modTicketEmbedBottom], files: [{attachment: `./resources/1px.png`, name: `1px.png`}], components: [unclaimedRow] };
    } else if (ticket.isClaimed && ticket.isOpen) {
        messageObject = { embeds: [modTicketEmbedTop, modTicketEmbedMid, modTicketEmbedBottom], files: [{attachment: `./resources/1px.png`, name: `1px.png`}], components: [claimedRow] };
    } else if (!ticket.isOpen) {
        messageObject = { embeds: [modTicketEmbedTop, modTicketEmbedMid, modTicketEmbedBottom], files: [{attachment: `./resources/1px.png`, name: `1px.png`}], components: [closingRow] };
    }
        return messageObject;
};

// Helper function to chunk an array into smaller arrays of a specific size
function chunkArray(array, chunkSize) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
}

const createTicketEmbed = async (id, ticketsChunk, type, userLevel, emojis) => {
    const embed = new EmbedBuilder()
        .setColor([255, 255, 255]) 
        .setTitle(`Results for searching tickets by ${type} ID: ${id}`)
        .setDescription(`${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`)
        .setImage(`attachment://1px.png`);

    ticketsChunk.forEach(ticket => {
        const viewable = userLevel >= ticket.ticketLevel ? `✅` : `❌`;
        const fields = type === `user`
            ? [
                { name: `Ticket ID: `, value: `${ticket.ticketId}`, inline: true },
                { name: `Claimant Mod: `, value: ticket.claimantModName, inline: true },
                { name: `Ticket Type:`, value: ticket.ticketType, inline: true }
              ]
            : [
                { name: `Ticket ID: `, value: `${ticket.ticketId}`, inline: true },
                { name: `User Name: `, value: ticket.userName, inline: true },
                { name: `Ticket Type:`, value: ticket.ticketType, inline: true }
              ];

        fields.push({ name: `Pull Permissions:\n${viewable}`, value: `\n${emojis.whiteDash}${emojis.whiteDash}${emojis.whiteDash}`});
        embed.addFields(fields);
    });

    return embed;
}

const ticketList = async (id, type, tickets, interaction) => {
    const userLevel = await getUserLevel(interaction);
    const ticketChunks = chunkArray(tickets, 5);
    const embeds = await Promise.all(ticketChunks.map(chunk => createTicketEmbed(id, chunk, type, userLevel, emojis)));
    return embeds;
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

    // What`s left now is the days
    const days = Math.round(age); // Rounding to nearest day

    return `${years}y - ${months}m - ${days}d`;
}

function formatDate(date) {
    // Check if the date is valid
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
        return `*Ticket Unresolved*`;
    }
    // Get the day, month, and year
    const day = String(date.getDate()).padStart(2, `0`);
    const month = String(date.getMonth() + 1).padStart(2, `0`); // Months are 0-based
    const year = String(date.getFullYear()).slice(-2); // Last two digits of the year

    // Get the hours and minutes
    const hours = String(date.getHours()).padStart(2, `0`);
    const minutes = String(date.getMinutes()).padStart(2, `0`);

    // Return the formatted string
    return `${month}/${day}/${year} - ${hours}:${minutes}`;
}

export {
    modTicket,
    ticketList,
};