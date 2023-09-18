import Ticket from '../schemas/ticket.js';
import { handleThreadName, getThreadTag, handleTicketMessageUpdate } from './threadFunctions.js'; 

// Check for specific roles
const hasRole = (interaction, roles) => {
    return roles.some(roleName => interaction.member.roles.cache.some(role => role.name === roleName));
};

// Can the user claim the ticket?
const canClaim = (ticket, interaction) => {
    switch (ticket.ticketType) {
        case 'User Report':
            return hasRole(interaction, ['Helper']) ? 'Helpers cannot claim User Report tickets.' : '✅';
        case 'Staff Report':
            const staffRoles = ['Senior Moderator', 'Head Moderator', 'Administrator', 'Developers'];
            return hasRole(interaction, staffRoles) ? '✅' : 'You do not have permissions to claim Staff Report tickets.';
        case 'VIP Application':
            return hasRole(interaction, ['Administrator', 'Developers']) ? '✅' : 'You do not have permissions to claim VIP Application tickets.';
        default:
            return '✅';
    }
};

// Can the user unclaim the ticket?
const canUnclaim = (ticket, interaction) => {
    if (!ticket.isClaimed) return 'This ticket has not been claimed.';

    if (ticket.claimantModId === interaction.user.id) return '✅';

    const higherRoles = ['Senior Moderator', 'Head Moderator', 'Administrator', 'Developers'];
    return hasRole(interaction, higherRoles) ? '✅' : 'You cannot unclaim a ticket that you have not claimed.';
};

const vibeCheck = async (action, interaction) => {
    const threadId = interaction.channel.id;
    const ticket = await Ticket.findOne({ ticketThread: threadId });

    if (action === 'claim') return canClaim(ticket, interaction);
    if (action === 'unclaim') return canUnclaim(ticket, interaction);
};

const claimTicket = async (interaction) => {
    const threadId = interaction.channel.id;
    const claimantMod = interaction.user.username;
    const claimantModId = interaction.user.id;
    const thread = interaction.channel;
    try {
        const ticket = await Ticket.findOne({ ticketThread: threadId });
        // Update the ticket's info in MongoDB and save
        ticket.isClaimed = true;
        ticket.claimantModId = claimantModId;
        ticket.claimantModName = claimantMod;
        await ticket.save();

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
        await interaction.reply({ content: `Ticket claimed by **${claimantMod}**`});
        await logger(ticket.ticketId, 'Event', interaction.user.id, 'Bot', `Ticket Claimed by **${claimantMod}**`);
    } catch (error) {
        console.error('Error claiming ticket:', error);
    }
};

const unclaimTicket = async (interaction) => {
    const threadId = interaction.channel.id;
    const thread = interaction.channel;
    try {
        const ticket = await Ticket.findOne({ ticketThread: threadId });
        // Update the ticket's info in MongoDB and save
        ticket.isClaimed = false;
        ticket.claimantModId = 0;
        let modUnclaiming = interaction.user.username;
        ticket.claimantModName = 'Unclaimed';
        await ticket.save();

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
        await interaction.reply({ content: `Ticket unclaimed by **${modUnclaiming}**`});
        await logger(ticket.ticketId, 'Event', interaction.user.id, 'Bot', `Ticket Unclaimed by **${modUnclaiming}**`)
    } catch (error) {
        console.error('Error unclaiming ticket:', error);
    }
};

export {
    claimTicket,
    unclaimTicket,
    vibeCheck
}