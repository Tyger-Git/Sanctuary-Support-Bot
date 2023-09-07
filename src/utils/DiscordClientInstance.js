const { Client, IntentsBitField, Partials } = require('discord.js');

class DiscordClientSingleton {
    constructor() {
        if (!DiscordClientSingleton.instance) {
            this.client = new Client({
                intents: [
                    IntentsBitField.Flags.Guilds,
                    IntentsBitField.Flags.GuildMembers,
                    IntentsBitField.Flags.GuildMessages,
                    IntentsBitField.Flags.MessageContent,
                    IntentsBitField.Flags.GuildPresences,
                    IntentsBitField.Flags.DirectMessages,
                  ],
                  partials: [
                    Partials.Message,
                    Partials.Channel,
                    Partials.Reaction
                  ]
            });
            
            DiscordClientSingleton.instance = this;
        }
        
        return DiscordClientSingleton.instance;
    }

    getClient() {
        return this.client;
    }
}

const instance = new DiscordClientSingleton();
Object.freeze(instance);

module.exports = instance;
