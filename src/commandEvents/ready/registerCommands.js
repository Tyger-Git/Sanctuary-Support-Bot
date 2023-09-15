// Initial runthrough of all slash commands, reading through and initializing them

import config from '../../../config.json' assert { type: 'json' };
import areCommandsDifferent from '../../commandUtils/areCommandsDifferent.js';
import getApplicationCommands from '../../commandUtils/getApplicationCommands.js';
import getLocalCommands from '../../commandUtils/getLocalCommands.js';

const registerCommands = async (client) => {
  try {
    const localCommands = await getLocalCommands();
    const applicationCommands = await getApplicationCommands(client, config.modServer);
    
    for (const localCommand of localCommands) {
      const { name, description, options } = localCommand;

      const existingCommand = await applicationCommands.cache.find(
        (cmd) => cmd.name === name
      );

      if (existingCommand) {
        if (localCommand.deleted) {
          await applicationCommands.delete(existingCommand.id);
          console.log(`🗑 Deleted command "${name}".`);
          continue;
        }

        if (areCommandsDifferent(existingCommand, localCommand)) {
          await applicationCommands.edit(existingCommand.id, {
            description,
            options,
          });

          console.log(`🔁 Edited command "${name}".`);
        }
      } else {
        if (localCommand.deleted) {
          console.log(
            `⏩ Skipping registering command "${name}" as it's set to disabled.`
          );
          continue;
        }

        await applicationCommands.create({
          name,
          description,
          options,
        });

        console.log(`👍 Registered command "${name}."`);
      }
      console.log(`👍 Command ${name} already registered.`)
    }
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }

  console.log('👍 Registered all commands.');
};

export default registerCommands;