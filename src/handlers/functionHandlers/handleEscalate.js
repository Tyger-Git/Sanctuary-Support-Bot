// Purpose: Handle the escalation workflow

import { ButtonBuilder, ActionRowBuilder } from "discord.js";
import Ticket from "../../schemas/ticket.js";
import logger from "../../utils/logger.js";
import threadReCreation from "../functionHandlers/handleThreadReCreation.js";
import clientSingleton from '../../utils/DiscordClientInstance.js';

// Helper Function to Delete and Recreate a Thread
const deleteAndRecreateThread = async (interaction, ticket, escalatorId) => {
    // Get Client Singleton
    const client = clientSingleton.getClient();
    // Get and Delete the thread
    const thread = await client.channels.fetch(ticket.ticketThread);
    await thread.delete();
    // Recreate the thread
    await threadReCreation(client, ticket, escalatorId);
};


// Function to handle the escalation workflow
const escalateWorkflow = async (interaction) => {
    if (interaction.customId === "escalate_menu") {
        const selectedValue = interaction.values[0];

        // Create the confirmation buttons
        const sendReplyButton = new ButtonBuilder()
            .setLabel("Escalate")
            .setCustomId(`send_escalate_reply_button:${selectedValue}`) // Embed the value here
            .setStyle("Success");
        const cancelButton = new ButtonBuilder()
            .setLabel("Cancel")
            .setCustomId("cancel_escalate_reply_button")
            .setStyle("Danger");
        const row = new ActionRowBuilder().addComponents(sendReplyButton, cancelButton);

        // Update the message with the snippet's content and the confirmation buttons
        await interaction.update({
            content: `Confirm escalation to ${selectedValue}?`,
            components: [row],
            ephemeral: true,
        });

    } else if (interaction.customId.startsWith("send_escalate_reply_button")) {
        const [_, targetCatagory] = interaction.customId.split(':'); // Split the customId to retrieve the target catagory
        const threadId = interaction.channel.id;
        const ticket = await Ticket.findOne({ ticketThread: threadId });

        switch (targetCatagory) {
            case "Helpers":
                if (ticket.ticketType === 'User Report' || ticket.ticketType === 'Appeal' || ticket.ticketType === 'VIP Application') {
                    await interaction.update({
                        content: `${ticket.ticketType} tickets cannot be de-escalated to Helpers.`,
                        components: [],  // Remove all components to disable further interactions
                        ephemeral: true,
                    });
                } else {
                    ticket.ticketLevel = 0;
                    await ticket.save();
                    await deleteAndRecreateThread(interaction, ticket, interaction.user.id);
                    await logger(ticket.ticketId, 'Event', interaction.user.id, interaction.user.username, 'Bot', 'Ticket De-Escalated to Helpers');
                }
                break;
            case "Moderators":
                if (ticket.ticketType === 'Appeal' || ticket.ticketType === 'VIP Application') {
                    await interaction.update({
                        content: `${ticket.ticketType} tickets cannot be de-escalated to Moderators.`,
                        components: [],  // Remove all components to disable further interactions
                        ephemeral: true,
                    });
                } else {
                    ticket.ticketLevel = 1;
                    await ticket.save();
                    await deleteAndRecreateThread(interaction, ticket, interaction.user.id);
                    await logger(ticket.ticketId, 'Event', interaction.user.id, interaction.user.username, 'Bot', 'Ticket Escalated to Moderators');
                }
                break;
            case "Senior Moderators":
                if (ticket.ticketType === 'VIP Application') {
                    await interaction.update({
                        content: `${ticket.ticketType} tickets cannot be de-escalated to Senior Moderators.`,
                        components: [],  // Remove all components to disable further interactions
                        ephemeral: true,
                    });
                } else {
                    ticket.ticketLevel = 2;
                    await ticket.save();
                    await deleteAndRecreateThread(interaction, ticket, interaction.user.id);
                    await logger(ticket.ticketId, 'Event', interaction.user.id, interaction.user.username, 'Bot', 'Ticket Escalated to Senior Moderators');
                }
                break;
            case "Head Moderators":
                if (ticket.ticketType === 'VIP Application') {
                    await interaction.update({
                        content: `${ticket.ticketType} tickets cannot be de-escalated to Head Moderators.`,
                        components: [],  // Remove all components to disable further interactions
                        ephemeral: true,
                    });
                } else {
                    ticket.ticketLevel = 3;
                    await ticket.save();
                    await deleteAndRecreateThread(interaction, ticket, interaction.user.id);
                    await logger(ticket.ticketId, 'Event', interaction.user.id, interaction.user.username, 'Bot', 'Ticket Escalated to Head Moderators');
                }
                break;
            case "Server Support":
                if (ticket.ticketType === 'VIP Application') {
                    await interaction.update({
                        content: `${ticket.ticketType} tickets cannot be de-escalated to Server Support.`,
                        components: [],  // Remove all components to disable further interactions
                        ephemeral: true,
                    });
                } else {
                    ticket.ticketLevel = 5;
                    await ticket.save();
                    await deleteAndRecreateThread(interaction, ticket, interaction.user.id);
                    await logger(ticket.ticketId, 'Event', interaction.user.id, interaction.user.username, 'Bot', 'Ticket Escalated to Server Support');
                }
                break;
            case "Demonly":
                if (ticket.ticketType === 'VIP Application') {
                    await interaction.update({
                        content: `${ticket.ticketType} tickets cannot be moved to Demonly.`,
                        components: [],  // Remove all components to disable further interactions
                        ephemeral: true,
                    });
                } else {
                    ticket.ticketLevel = 6;
                    await ticket.save();
                    await deleteAndRecreateThread(interaction, ticket, interaction.user.id);
                    await logger(ticket.ticketId, 'Event', interaction.user.id, interaction.user.username, 'Bot', 'Ticket Escalated to Demonly');
                }
                break;
            case "Ketraies":
                ticket.ticketLevel = 7;
                await ticket.save();
                    await deleteAndRecreateThread(interaction, ticket, interaction.user.id);
                    await logger(ticket.ticketId, 'Event', interaction.user.id, interaction.user.username, 'Bot', 'Ticket Escalated to Ketraies');
                break;
            case "Developers":
                if (ticket.ticketType !== 'Technical Support') {
                    await interaction.update({
                        content: `${ticket.ticketType} tickets cannot be escalated to Developers.`,
                        components: [],  // Remove all components to disable further interactions
                        ephemeral: true,
                    });
                } else {
                    ticket.ticketLevel = 8;
                    await ticket.save();
                    await deleteAndRecreateThread(interaction, ticket, interaction.user.id);
                    await logger(ticket.ticketId, 'Event', interaction.user.id, interaction.user.username, 'Bot', 'Ticket Escalated to Developers');
                }
                break;
            default:
                await interaction.update({
                    content: "Error: Catagory not found.",
                    components: [],  // Remove all components to disable further interactions
                    ephemeral: true,
                });
                break;
        }
    } else if (interaction.customId === "cancel_escalate_reply_button") {
        await interaction.update({
            content: "Escalation cancelled.",
            components: [],  // Remove all components to disable further interactions
            ephemeral: true,
        });
    }
};

export { escalateWorkflow };