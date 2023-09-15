// Command to get the forum tag IDs for the parent forums
/*---- Dev Only ----*/

export default {
    name: 'getforumtags',
    description: 'Gets the forum tag IDs for the parent forums',
    devOnly: true,
    callback: async (client, interaction) => {
        try {
            // Fetch the parent channel using the Discord.js client
            const parentChannel = await client.channels.fetch(interaction.channel.parentId);
            
            await interaction.reply(`Parent channel ID: ${parentChannel.id}`);
            
            if (parentChannel.availableTags && parentChannel.availableTags.length > 0) {
                const tagObjects = parentChannel.availableTags.map(tag => JSON.stringify(tag, null, 2));
                interaction.channel.send(`Available tags: \n${tagObjects.join('\n')}`);
            } else {
                interaction.channel.send('No available tags found.');
            }

        } catch (error) {
            console.error('Error fetching parent channel or accessing tags:', error);
            interaction.channel.send('Error fetching tags.');
        }
    }
}