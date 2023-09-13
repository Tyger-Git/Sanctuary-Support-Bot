const { ButtonBuilder, EmbedBuilder, ActionRowBuilder } = require("discord.js");
const { outgoingDirectMessage } = require("../interactionTypeHandlers/directMessageHandler");
const Ticket = require("../../schemas/ticket");
const threadReCreation = require("../functionHandlers/handleThreadReCreation");
const clientSingleton = require("../../utils/DiscordClientInstance");

// Helper Function to Delete and Recreate a Thread
const deleteAndRecreateThread = async (interaction, ticket) => {
    // Get Client Singleton
    const client = clientSingleton.getClient();
    // Get and Delete the thread
    const thread = await client.channels.fetch(ticket.ticketThread);
    await thread.delete();

    // Recreate the thread
    await threadReCreation(client, ticket);
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
        });
    } else if (interaction.customId.startsWith("send_escalate_reply_button")) {
        const [_, targetCatagory] = interaction.customId.split(':'); // Split the customId to retrieve the target catagory
        const threadId = interaction.channel.id;
        const ticket = await Ticket.findOne({ ticketThread: threadId });

        switch (targetCatagory) {
            case "Helpers":
                if (ticket.ticketType === 'User Report' || ticket.ticketType === 'Staff Report' || ticket.ticketType === 'VIP Application') {
                    await interaction.update({
                        content: `${ticket.ticketType} tickets cannot be de-escalated to Helpers.`,
                        components: []  // Remove all components to disable further interactions
                    });
                } else {
                    ticket.ticketLevel = 0;
                    await ticket.save();
                    await deleteAndRecreateThread(interaction, ticket);
                }
                break;
            case "Moderators":
                if (ticket.ticketType === 'Staff Report' || ticket.ticketType === 'VIP Application') {
                    await interaction.update({
                        content: `${ticket.ticketType} tickets cannot be de-escalated to Moderators.`,
                        components: []  // Remove all components to disable further interactions
                    });
                } else {
                    ticket.ticketLevel = 1;
                    await ticket.save();
                    await deleteAndRecreateThread(interaction, ticket);
                }
                break;
            case "Senior Moderators":
                if (ticket.ticketType === 'VIP Application') {
                    await interaction.update({
                        content: `${ticket.ticketType} tickets cannot be de-escalated to Senior Moderators.`,
                        components: []  // Remove all components to disable further interactions
                    });
                } else {
                    ticket.ticketLevel = 2;
                    await ticket.save();
                    await deleteAndRecreateThread(interaction, ticket);
                }
                break;
            case "Head Moderators":
                if (ticket.ticketType === 'VIP Application') {
                    await interaction.update({
                        content: `${ticket.ticketType} tickets cannot be de-escalated to Head Moderators.`,
                        components: []  // Remove all components to disable further interactions
                    });
                } else {
                    ticket.ticketLevel = 3;
                    await ticket.save();
                    await deleteAndRecreateThread(interaction, ticket);
                }
                break;
            case "Server Support":
                if (ticket.ticketType === 'VIP Application') {
                    await interaction.update({
                        content: `${ticket.ticketType} tickets cannot be de-escalated to Server Support.`,
                        components: []  // Remove all components to disable further interactions
                    });
                } else {
                    ticket.ticketLevel = 5;
                    await ticket.save();
                    await deleteAndRecreateThread(interaction, ticket);
                }
                break;
            case "Demonly":
                if (ticket.ticketType === 'VIP Application') {
                    await interaction.update({
                        content: `${ticket.ticketType} tickets cannot be de-escalated to Demonly.`,
                        components: []  // Remove all components to disable further interactions
                    });
                } else {
                    ticket.ticketLevel = 6;
                    await ticket.save();
                    await deleteAndRecreateThread(interaction, ticket);
                }
                break;
            case "Ketraies":
                ticket.ticketLevel = 7;
                await ticket.save();
                    await deleteAndRecreateThread(interaction, ticket);
                break;
            case "Developers":
                if (ticket.ticketType !== 'Technical Support') {
                    await interaction.update({
                        content: `${ticket.ticketType} tickets cannot be escalated to Developers.`,
                        components: []  // Remove all components to disable further interactions
                    });
                } else {
                    ticket.ticketLevel = 8;
                    await ticket.save();
                    await deleteAndRecreateThread(interaction, ticket);
                }
                break;
            default:
                await interaction.update({
                    content: "Error: Catagory not found.",
                    components: []  // Remove all components to disable further interactions
                });
                break;
        }
    } else if (interaction.customId === "cancel_escalate_reply_button") {
        await interaction.update({
            content: "Escalation cancelled.",
            components: []  // Remove all components to disable further interactions
        });
    }
};

module.exports = {
    escalateWorkflow,
}