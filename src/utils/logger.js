import Log from '../schemas/log.js';
import clientSingleton from '../utils/DiscordClientInstance.js';
import config from '../../config.json' assert { type: 'json' };

const log = async (ticketId, type, userId, classType, message) => {
    // Get the highest role of the user
    const roleId = await getHighestRole(userId);
    // Create the log entry
    const logEntry = new Log({
        ticketId: ticketId,
        messageType: type,
        userId: userId,
        classType: classType,
        userRole: roleId,
        logMessage: message
    });
    // Save the log entry to the database
    try {
        await logEntry.save();
    } catch (error) {
        console.error('Error saving log:', error);
    }
};

// Helper functions
const roleCache = new Map();
const client = clientSingleton.getClient();
// Caching the highest role of a user, to reduce API calls
async function getHighestRole(userId) {
    const now = Date.now();
    // Check if role is cached
    if (roleCache.has(userId)) {
        const { role, timestamp } = roleCache.get(userId);
        // If the role was fetched less than 10 minutes ago, use cached role
        if (now - timestamp < 10 * 60 * 1000) {
            return role;
        }
    }
    // Fetch the highest role
    const guild = client.guilds.cache.get(config.modServer);
    const member = await guild.members.fetch(userId);
    const highestRole = member.roles.highest;
    // Cache the role with current timestamp
    roleCache.set(userId, { role: highestRole.id, timestamp: now });
    return highestRole.id;
}

export default log;