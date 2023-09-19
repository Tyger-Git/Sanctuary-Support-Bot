// This is an example of a user response shown in ticket thread
/*---------- Will Not Be In Final Product ----------*/

import { EmbedBuilder } from 'discord.js';
import emojis from '../../emojis.json' assert { type: 'json' };
export default {
    name: 'testuserresponse',
    description: 'Example of a user response shown in ticket thread',
    devOnly: true,
    callback: async (client, interaction) => {
        await interaction.deferReply();
        const date = new Date();
        const embed = new EmbedBuilder()
            .setTitle(`A Senior Moderator has replied to your ticket :\n\n${emojis.redDash1}${emojis.redDash2}${emojis.redDash3}`)
            .setDescription(`Thank you for contacting us, and I can understand your concern about potentially inflating the cost of bids using an "alt" account, this does go against the rules and we will handle this. To prevent this as best as possible from your side, we recommend to request the seller only accept bids from verified BNet accounts, though it is not required at this time. Some buyers will even state that they only bid against other verified BNet accounts, but the seller doesn't have to agree to those requests.\n\nIf you have reason to believe a seller may be using an alt to artificially drive up the cost of a bid, which does go against the rules, you can report here as part of this ticket or as a new ticket if it happens in the future. Please include the users' discord usernames, a link to the thread(s), as well as any screenshots of DMs or in-game messages that may provide evidence to support these claims.\n\n${emojis.redDash1}${emojis.redDash2}${emojis.redDash3}`)
            .setImage('attachment://ContactStaff.gif')
            .setColor([255,0,0]) // Red
            .setFooter({text : `©️ Sanctuary Development Team · ${date.getFullYear()}`});


        await interaction.editReply({ embeds: [embed], files: [{attachment: './resources/ContactStaff.gif', name: 'ContactStaff.gif' }]});
    }
};