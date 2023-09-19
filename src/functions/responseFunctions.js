import { EmbedBuilder } from "discord.js";
import emojis from "../emojis.json" assert { type: "json" };

const ticketActionMessageObject = async (message, bool) => {
    let messageObj = {};
    const embed = new EmbedBuilder()
        .setTitle(`${emojis.bolt} Ticket Action ${emojis.bolt}`)
        .setDescription(`${message}`)
        .setColor([255, 255, 255]); // White
    messageObj = { embeds: [embed], ephemeral: bool };
    return messageObj;
};

const ticketErrorMessageObject = async (message) => {
    let messageObj = {};
    const embed = new EmbedBuilder()
        .setTitle(`${emojis.outage} Ticket Error ${emojis.outage}`)
        .setDescription(`${message}`)
        .setColor([255, 0, 0]); // Red
    messageObj = { embeds: [embed], ephemeral: true };
    return messageObj;
};

export {
    ticketActionMessageObject,
    ticketErrorMessageObject
}