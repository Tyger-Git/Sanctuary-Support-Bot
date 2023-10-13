//Handler for slash commands

import config from '../../../config.json' assert { type: 'json' };
import getLocalCommands from '../../commandUtils/getLocalCommands.js';

const checkCommands = async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const localCommands = await getLocalCommands();
  try {
    const commandObject = localCommands.find(
      (cmd) => cmd.name === interaction.commandName
    );

    if (!commandObject) return;

    if (commandObject.devOnly) {
      if (!config.devs.includes(interaction.member.id)) {
        interaction.reply(await messageObjectError('Only developers are allowed to run this command.', true));
        return;
      }
    }

    if (commandObject.modServerOnly) {
      if (!(interaction.guild.id === modServer)) {
        interaction.reply(await messageObjectError('This command can not be run here.', true));
        return;
      }
    }

    if (commandObject.permissionsRequired?.length) {
      for (const permission of commandObject.permissionsRequired) {
        if (!interaction.member.permissions.has(permission)) {
          interaction.reply(await messageObjectError('You do need meet the permissions requirements to run this command.', true));
          return;
        }
      }
    }

    if (commandObject.botPermissions?.length) {
      for (const permission of commandObject.botPermissions) {
        const bot = interaction.guild.members.me;

        if (!bot.permissions.has(permission)) {
          interaction.reply(await messageObjectError('I do not have the required permissions to run this command.', true));
          return;
        }
      }
    }

    await commandObject.callback(client, interaction);
  } catch (error) {
    winston.error(`There was an error checking this command: ${error}\n Stack Trace: \n${error.stack}`);
  }
};

export default checkCommands;