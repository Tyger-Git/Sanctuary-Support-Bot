// Various functions for handling ticket threads

import { modTicket } from '../functions/modTicket.js';
import clientSingleton from '../utils/DiscordClientInstance.js';
import emojis from '../emojis.json' assert { type: 'json' };
import threadInfo from '../threadInformation.json' assert { type: "json" };
import Ticket from '../schemas/ticket.js';
import DyingTicket from '../schemas/dyingTicket.js';
import logger from '../utils/logger.js';

async function handleTicketMessageUpdate(ticket) {
    // Get the Discord client
    const client = clientSingleton.getClient();
    // Get the thread ID and message ID from the ticket
    const threadId = ticket.ticketThread;
    const messageId = ticket.ticketThreadMessage;
    // Fetch the thread
    const parentChannelID = await getParentChannelID(ticket);
    const parentChannel = await client.channels.fetch(parentChannelID);
    const thread = await parentChannel.threads.fetch(threadId);
    // Check if the thread exists and is not partial
    if (!thread || thread.partial) {
        console.error('Thread not found or partial.');
        return;
    }
    try {
        // Fetch the message
        const message = await thread.messages.fetch(messageId);
        // Modify the message
        const messageObject = await modTicket(ticket);
        await message.edit(messageObject);
    } catch (error) {
        console.error('Error modifying ticket thread message:', error);
    }
};

async function handleThreadName(ticket) {
    // Set thread emoji based on ticket status
    let statusEmoji = ticket.isClaimed ? emojis.claimedTicket : emojis.unclaimedTicket;
    if (!ticket.isOpen) {
        statusEmoji = emojis.closedTicket;
    }
    const name = `${statusEmoji} | ${ticket.userDisplayName} (${ticket.userName}) | #${ticket.ticketId}`;
    
    return name;
}

// Map for parent channel IDs
const threadMapping = {
    0: { // Helper Category
        'General Support': 'GeneralSupportForum0',
        'Technical Support': 'TechSupportForum0'
    },
    1: { // Moderator Category
        'General Support': 'GeneralSupportForum1',
        'Technical Support': 'TechSupportForum1',
        'User Report': 'UserReportForum1'
    },
    2: { // Senior Moderator Category
        'General Support': 'GeneralSupportForum2',
        'Technical Support': 'TechSupportForum2',
        'User Report': 'UserReportForum2',
        'Appeal': 'AppealForum2'
    },
    3: { // Head Moderator Category
        'General Support': 'GeneralSupportForum3',
        'Technical Support': 'TechSupportForum3',
        'User Report': 'UserReportForum3',
        'Appeal': 'AppealForum3'
    },
    4: { // Admin Category
        'VIP Application': 'VIPAppForum4',
        'Appeal': 'AppealForum4'
    },
    5: 'StaffSupportForum', // Staff Support Category
    6: 'DemonlyForum',     // Demonly Category
    7: 'KetForum',         // Ket Category
    8: 'DevSupportForum'   // Dev Category
};

async function getParentChannelID(ticket) {
    const levelMapping = threadMapping[ticket.ticketLevel];
    
    if (!levelMapping) {
        console.error('Issue getting parent channel ID.');
        return null;
    }

    if (typeof levelMapping === 'string') {
        return threadInfo[levelMapping];
    }

    const channelID = levelMapping[ticket.ticketType];
    if (!channelID) {
        console.error('Issue getting parent channel ID.');
        return null;
    }

    return threadInfo[channelID];
}

// Map for thread tags
const tagMapping = {
    0: {  // Helper Category
        'General Support': {
            claimed: 'GeneralSupportForumClaimedTag0',
            unclaimed: 'GeneralSupportForumUnclaimedTag0',
            archiving: 'GeneralSupportForumArchivingTag0'
        },
        'Technical Support': {
            claimed: 'TechSupportForumClaimedTag0',
            unclaimed: 'TechSupportForumUnclaimedTag0',
            archiving: 'TechSupportForumArchivingTag0'
        }
    },
    1: {  // Moderator Category
        'General Support': {
            claimed: 'GeneralSupportForumClaimedTag1',
            unclaimed: 'GeneralSupportForumUnclaimedTag1',
            archiving: 'GeneralSupportForumArchivingTag1'
        },
        'Technical Support': {
            claimed: 'TechSupportForumClaimedTag1',
            unclaimed: 'TechSupportForumUnclaimedTag1',
            archiving: 'TechSupportForumArchivingTag1'
        },
        'User Report': {
            claimed: 'UserReportForumClaimedTag1',
            unclaimed: 'UserReportForumUnclaimedTag1',
            archiving: 'UserReportForumArchivingTag1'
        }
    },
    2: {  // Senior Moderator Category
        'General Support': {
            claimed: 'GeneralSupportForumClaimedTag2',
            unclaimed: 'GeneralSupportForumUnclaimedTag2',
            archiving: 'GeneralSupportForumArchivingTag2'
        },
        'Technical Support': {
            claimed: 'TechSupportForumClaimedTag2',
            unclaimed: 'TechSupportForumUnclaimedTag2',
            archiving: 'TechSupportForumArchivingTag2'
        },
        'User Report': {
            claimed: 'UserReportForumClaimedTag2',
            unclaimed: 'UserReportForumUnclaimedTag2',
            archiving: 'UserReportForumArchivingTag2'
        },
        'Appeal': {
            claimed: 'AppealForumClaimedTag2',
            unclaimed: 'AppealForumUnclaimedTag2',
            archiving: 'AppealForumArchivingTag2'
        }
    },
    3: {  // Head Moderator Category
        'General Support': {
            claimed: 'GeneralSupportForumClaimedTag3',
            unclaimed: 'GeneralSupportForumUnclaimedTag3',
            archiving: 'GeneralSupportForumArchivingTag3'
        },
        'Technical Support': {
            claimed: 'TechSupportForumClaimedTag3',
            unclaimed: 'TechSupportForumUnclaimedTag3',
            archiving: 'TechSupportForumArchivingTag3'
        },
        'User Report': {
            claimed: 'UserReportForumClaimedTag3',
            unclaimed: 'UserReportForumUnclaimedTag3',
            archiving: 'UserReportForumArchivingTag3'
        },
        'Appeal': {
            claimed: 'AppealForumClaimedTag3',
            unclaimed: 'AppealForumUnclaimedTag3',
            archiving: 'AppealForumArchivingTag3'
        }
    },
    4: {  // Admin Category
        'Appeal': {
            claimed: 'AppealForumClaimedTag4',
            unclaimed: 'AppealForumUnclaimedTag4',
            archiving: 'AppealForumArchivingTag4'
        },
        'VIP Application': {
            claimed: 'VIPAppForumClaimedTag4',
            unclaimed: 'VIPAppForumUnclaimedTag4',
            archiving: 'VIPAppForumArchivingTag4'
        }
    },
    5: { // Staff Support Category
        claimed: 'StaffSupportForumClaimedTag',
        unclaimed: 'StaffSupportForumUnclaimedTag',
        archiving: 'StaffSupportForumArchivingTag'
    },
    6: { // Demonly Category
        claimed: 'DemonlyForumClaimedTag',
        unclaimed: 'DemonlyForumUnclaimedTag',
        archiving: 'DemonlyForumArchivingTag'
    },
    7: { // Ket Category
        claimed: 'KetForumClaimedTag',
        unclaimed: 'KetForumUnclaimedTag',
        archiving: 'KetForumArchivingTag'
    },
    8: { // Dev Category
        claimed: 'DevSupportForumClaimedTag',
        unclaimed: 'DevSupportForumUnclaimedTag',
        archiving: 'DevSupportForumArchivingTag'
    }
};


async function getThreadTag(ticket) {
    let mapping;

    // If the ticketLevel is between 5 and 8, 
    if (ticket.ticketLevel >= 5 && ticket.ticketLevel <= 8) {
        mapping = tagMapping[ticket.ticketLevel];
    } else {
        mapping = tagMapping[ticket.ticketLevel] && tagMapping[ticket.ticketLevel][ticket.ticketType];
    }

    if (!mapping) {
        console.error('Error getting thread tag.');
        return null;
    }

    let tagKey;
    if (!ticket.isOpen) {
        tagKey = 'archiving';
    } else {
        tagKey = ticket.isClaimed ? 'claimed' : 'unclaimed';
    }
    
    return threadInfo[mapping[tagKey]];
}



async function closeThread(interaction) {
    const threadId = interaction.channel.id;
    const thread = interaction.channel;
    const closeTimer = interaction.fields.getTextInputValue('closeTimer');
    const modNotes = interaction.fields.getTextInputValue('modNotes');
    try {
        const ticket = await Ticket.findOne({ ticketThread: threadId });
        // Update the ticket's info in MongoDB and save
        ticket.isOpen = false;
        ticket.isArchiving = true;
        ticket.closeDate = new Date();
        ticket.modNotes = modNotes;
        ticket.closeTimer = closeTimer;
        await ticket.save();

        // Update the ticket embed
        await handleTicketMessageUpdate(ticket);

        // Create a new dying ticket entry
        const dyingTicket = new DyingTicket({
            ticketId: ticket.ticketId,  // Assuming ticket has a unique _id field
            ticketThread: ticket.ticketThread,
            closeDate: ticket.closeDate,
            closeTimer: ticket.closeTimer
        });
        await dyingTicket.save();

        // Get the thread and edit the thread name
        const newThreadName = await handleThreadName(ticket);
        const threadTag = await getThreadTag(ticket);
        await thread.edit({
            name: newThreadName,
            appliedTags: [threadTag],
        });

        //Update Ticket Message
        await handleTicketMessageUpdate(ticket);

        // Reply to the interaction
        if (closeTimer === 0) {
            await interaction.reply(await ticketActionMessageObject("Ticket Closed...Thread scheduled for deletion **immediately.**", false));
        } else {
            await interaction.reply(await ticketActionMessageObject("Ticket Closed...Thread scheduled for deletion in **" + closeTimer + " hour(s).**", false));
        }
        await logger(ticket.ticketId, 'Event', interaction.user.id, interaction.user.username, 'Bot', `Ticket closed by **${interaction.user.username}**`);
    } catch (error) {
        console.error('Error ending thread:', error);
    }
}

export {
    handleTicketMessageUpdate,
    handleThreadName,
    getThreadTag,
    getParentChannelID,
    closeThread
};