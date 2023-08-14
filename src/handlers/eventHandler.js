const path = require('path');
const getAllFiles = require('../utils/getAllFiles');
const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');

module.exports = (client) => {
  const eventFolders = getAllFiles(path.join(__dirname, '..', 'events'), true);

  for (const eventFolder of eventFolders) {
    let eventFiles = getAllFiles(eventFolder);
    eventFiles = eventFiles.sort();

    const eventName = eventFolder.replace(/\\/g, '/').split('/').pop();

    client.on(eventName, async (arg) => {
      for (const eventFile of eventFiles) {
        const eventFunction = require(eventFile);
        await eventFunction(client, arg);
      }
    });
  }

  // MessageCreate event
  client.on('messageCreate', async (message) => {
    if (message.guild.id === '989899054815281243') {
      const threadChannel = await message.guild.channels.create('Thread', {
        type: 'GUILD_PUBLIC_THREAD', // Change to the appropriate thread type
        parent: '1139567290560557197', // Parent category ID
      });

      const row = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('claim')
            .setLabel('Claim')
            .setStyle('PRIMARY')
        )
        .addComponents(
          new MessageSelectMenu()
            .setCustomId('escalate')
            .setPlaceholder('Select an option')
            .addOptions([
              {
                label: 'Escalate',
                value: 'escalate',
              },
            ])
        );

      const initialMessage = await threadChannel.send({
        content: 'Thread created for user ' + message.author.tag,
        components: [row],
      });

      // TODO: Add interaction handling for buttons and dropdown
    }
  });

  // InteractionCreate event
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'claim') {
      // Handle claim button interaction
    }

    if (interaction.customId === 'escalate') {
      // Handle escalate dropdown interaction
    }
  });
};
