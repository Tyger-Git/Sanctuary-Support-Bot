import winston from "winston/lib/winston/config";

const cacheFetch = async (client) => {
    for (const guild of client.guilds.cache.values()) {
        // Fetch roles only if they're not in the cache
        if (!guild.roles.cache.size) {
            await guild.roles.fetch();
        }

        // Fetch members in chunks, but only if they're not already in the cache
        if (guild.members.cache.size !== guild.memberCount) {
            let fetchedMembers = guild.members.cache.size;
            while (fetchedMembers < guild.memberCount) {
                await guild.members.fetch({ after: fetchedMembers });
                fetchedMembers = guild.members.cache.size;
            }
        }

        winston.info(`Checked cache for guild: ${guild.name}`);
    }

    winston.info('Finished checking and fetching missing cache data.');
};
export default cacheFetch;