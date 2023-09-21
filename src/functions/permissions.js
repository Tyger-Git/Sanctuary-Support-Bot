// Helper function to check permissions of a user

import config from '../../config.json' assert { type: 'json' };
import clientSingleton from '../utils/DiscordClientInstance.js';

const roleToUserLevel = new Map()
    .set('Helper', 0)
    .set('Moderator', 1)
    .set('Senior Moderator', 2)
    .set('Head Moderator', 3)
    .set('Administrator', 8)
    .set('Developer', 8);

const getUserLevel = async (interaction) => {
    const client = clientSingleton.getClient();
    const guild = client.guilds.cache.get(config.modServer);
    const member = await guild.members.fetch(interaction.user.id);

    const highestRoleName = member.roles.highest.name;
    return roleToUserLevel.get(highestRoleName) || -1;
};

const checkPerms = async (interaction, requiredLevel) => {
    const userLevel = await getUserLevel(interaction);
    console.log(userLevel);
    console.log(requiredLevel);
    return userLevel >= requiredLevel;
};

export { getUserLevel, checkPerms };