import Log from '../schemas/log.js';
import clientSingleton from '../utils/DiscordClientInstance.js';
import config from '../../config.json' assert { type: 'json' };
import winston from './winston.js';

const log = async (ticketId, type, userId, userName, classType, message) => {
    // Get the highest role of the user
    const roleName = await getHighestRole(userId);
    // Create the log entry
    const logEntry = new Log({
        ticketId: ticketId,
        messageType: type,
        userId: userId,
        userName: userName,
        classType: classType,
        userRole: roleName,
        logMessage: message
    });
    // Save the log entry to the database
    try {
        await logEntry.save();
        winston.debug(`Saved log to database: ${logEntry}`);
    } catch (error) {
        winston.error(`Error saving log: ${error}\n Stack Trace: \n${error.stack}`);
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
    roleCache.set(userId, { role: highestRole.name, timestamp: now });
    return highestRole.name;
}

export default log;