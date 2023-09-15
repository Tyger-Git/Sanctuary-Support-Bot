import path from 'path';
import getAllFiles from '../commandUtils/getAllFiles.js';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const getLocalCommands = async (exceptions = []) => {
    let localCommands = [];
    
    const commandCategories = getAllFiles(path.join(__dirname, '..', 'commands'), true);
    
    for (const commandCategory of commandCategories) {
        const commandFiles = getAllFiles(commandCategory);
        
        for (const commandFile of commandFiles) {
            const commandFileURL = pathToFileURL(commandFile).href;
            const commandObject = await import(commandFileURL).then(module => module.default);
            
            if (exceptions.includes(commandObject.name)) {
                continue;
            }

            localCommands.push(commandObject);
        }
    }

    return localCommands;
};

export default getLocalCommands;
