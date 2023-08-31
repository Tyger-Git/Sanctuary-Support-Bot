# Lilith-Mail
Ticket bot for Sanctuary
Lilith-Mail is a Discord bot designed to provide a comprehensive ticketing system for the Sanctuary Discord Server. Built with node.js, discord.js v14 and MongoDB.

## Usage

This discord bot collects support tickets from any number of discord servers deemed "listener" servers, and stores tickets within various MongoDB collections. Once a ticket has been created, a forum thread is made with relevant ticket information, that is used by a "moderator" in conjunction with the various commands and components of the UI to resolve the ticket. All actions and events are logged and accesable with query commands via the bot.

## Features

1. **Chat Input Commands**: Command-driven interactions using slash commands.
2. **Interactive UI Components**: Buttons, embeds, select menus, and modals to enhance user interaction.
3. **Logs**: Stored information about past tickets, actions, and events.

## Getting Started

### Prerequisites

- Node.js
- Discord.js v14 (or your specified version)
- [Any other dependencies or tools]

### Installation

1. Clone the repo:
   ```sh
   git clone https://github.com/[Your-Username]/Lilith-Mail.git
2. Install NPM packages:
   ```sh
   npm install
3. Enter your config:
   ```sh
   {
    "testServer": "[SERVERID]",
    "clientId": "[BOTID]",
    "devs": ["[DEVUSERID]", "[DEVUSERID]", "[DEVUSERID]", "[DEVUSERID]"]
   }
4. Enter your ENV:
   ```sh
   TOKEN = [BOT TOKEN]
   MONGODB_URI = [Your DB Link]
6. Running the bot:
   ```sh
   node index.js

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
