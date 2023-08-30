const path = require('path');
const getAllFiles = require('../../commandUtils/getAllFiles');

module.exports = (client) => {
  const commandFolders = getAllFiles(path.join(__dirname, '..', '..', 'commandEvents'), true);

  for (const commandFolder of commandFolders) {
    let commandFiles = getAllFiles(commandFolder);
    commandFiles = commandFiles.sort();
    const eventName = commandFolder.replace(/\\/g, '/').split('/').pop();

    client.on(eventName, async (arg) => {
      for (const commandFile of commandFiles) {
        const commandFunction = require(commandFile);
        await commandFunction(client, arg);
      }
    });
  }
};
