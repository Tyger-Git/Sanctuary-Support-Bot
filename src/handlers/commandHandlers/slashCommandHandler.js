import path from 'path';
import getAllFiles from '../../commandUtils/getAllFiles.js';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const setupCommandEvents = (client) => {
    const commandFolders = getAllFiles(path.join(__dirname, '..', '..', 'commandEvents'), true);
    // Loop through all the command folders, and add a listener for each event
    for (const commandFolder of commandFolders) {
        let commandFiles = getAllFiles(commandFolder);
        commandFiles = commandFiles.sort();
        const eventName = commandFolder.replace(/\\/g, '/').split('/').pop();
        // Listener depending on the event name
        client.on(eventName, async (arg) => {
            for (const commandFile of commandFiles) {
                const commandFileURL = pathToFileURL(commandFile).href;
                const commandFunction = await import(commandFileURL);
                await commandFunction.default(client, arg);
            }
        });
    }
};

export default setupCommandEvents;
