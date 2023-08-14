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

      const escalateMenu = new MessageSelectMenu()
        .setCustomId('escalate')
        .setPlaceholder('Select an option')
        .addOptions([
          
          {
            label: 'Senior Mods',
            value: '1139585052628500541',
          },
          {
            label: 'Head Mods',
            value: '1139584967098253383',
          },
          {
            label: 'Administrators',
            value: '1139582498536423454',
          },
            {
            label: 'Ketraies',
            value: '328617978985709568',
          },
             {
            label: 'Demonly',
            value: '91598701352476672',
          },
        ]);

      const row = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('claim')
            .setLabel('Claim')
            .setStyle('PRIMARY')
        )
        .addComponents(
          new MessageButton()
            .setCustomId('close')
            .setLabel('Close')
            .setStyle('DANGER')
        )
        .addComponents(escalateMenu);

      const initialMessage = await threadChannel.send({
        content: 'Thread created for user ' + message.author.tag,
        components: [row],
      });

      // TODO: Add interaction handling for buttons and dropdown
    }
  });

  // InteractionCreate event
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton() && !interaction.isSelectMenu()) return;

    if (interaction.isButton()) {
      if (interaction.customId === 'claim') {
        // Check if the member has one of the allowed roles
        const allowedRoles = ['1139585052628500541', '1139584967098253383', '1139582498536423454'];
        const member = interaction.guild.members.cache.get(interaction.user.id);

        if (member.roles.cache.some((role) => allowedRoles.includes(role.id))) {
          // Update the thread title to include "claimed"
          await interaction.channel.setName('Thread (Claimed)');
          // Handle claim button interaction
        } else {
          // Reply with a message saying they don't have permission
          interaction.reply({ content: 'You do not have permission to claim tickets.', ephemeral: true });
        }
      }

      if (interaction.customId === 'close') {
        // Check if the member is the one who claimed the ticket
        const claimedRole = interaction.guild.roles.cache.get('1139585052628500541'); // Change to the claimed role's ID
        const member = interaction.guild.members.cache.get(interaction.user.id);

        if (member.roles.cache.has(claimedRole.id)) {
          // Handle close button interaction
          await interaction.channel.delete();
        } else {
          // Reply with a message saying they don't have permission
          interaction.reply({ content: 'You do not have permission to close this ticket.', ephemeral: true });
        }
      }
    }

    if (interaction.isSelectMenu()) {
      if (interaction.customId === 'escalate') {
        const selectedValue = interaction.values[0];

        if (selectedValue === 'escalate') {
          // Handle escalation
        } else if (selectedValue === 'senior') {
          // Handle escalation to senior mods
        } else if (selectedValue === 'head') {
          // Handle escalation to head mods
        } else if (selectedValue === 'admin') {
          // Handle escalation to administrators
        }
      }
    }
  });
};

