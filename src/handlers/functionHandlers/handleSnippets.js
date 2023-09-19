import { ButtonBuilder, ActionRowBuilder } from "discord.js";
import { outgoingDirectMessage } from "../interactionTypeHandlers/directMessageHandler.js";
import Ticket from "../../schemas/ticket.js";
import Snippet from "../../schemas/snippet.js";
import { ticketActionMessageObject, ticketErrorMessageObject } from "../../functions/responseFunctions.js";

const snippetWorkflow = async (interaction) => {
    if (interaction.customId === "snippet_menu") {
        const selectedValue = interaction.values[0];
        
        // Fetch the snippet from the database instead of JSON
        const selectedSnippet = await Snippet.findOne({ snippetName: selectedValue });

        if (!selectedSnippet) {
            console.log("Selected snippet is undefined.");
            return;
        }

        // Create the confirmation buttons
        const sendReplyButton = new ButtonBuilder()
            .setLabel("Send Reply")
            .setCustomId(`send_snippet_reply_button:${selectedSnippet.snippetName}`) // Embed the value here
            .setStyle("Success");

        const cancelButton = new ButtonBuilder()
            .setLabel("Cancel")
            .setCustomId("cancel_snippet_reply_button")
            .setStyle("Danger");

        const row = new ActionRowBuilder().addComponents(sendReplyButton, cancelButton);

        // Update the message with the snippet's content and the confirmation buttons
        await interaction.update({
            content: `Would you like to reply with this snippet?\n\`\`\`${selectedSnippet.snippetContent}\`\`\``,
            components: [row],
            ephemeral: true
        });
    } else if (interaction.customId.startsWith("send_snippet_reply_button")) {
        const threadId = interaction.channel.id;
        const ticket = await Ticket.findOne({ ticketThread: threadId });
        const [_, snippetIdentifier] = interaction.customId.split(':'); // Split the customId to retrieve the snippet value
        
        // Fetch the snippet from the database again
        const selectedSnippet = await Snippet.findOne({ snippetName: snippetIdentifier });

        if (selectedSnippet) {
            await outgoingDirectMessage(interaction, ticket, selectedSnippet.snippetContent);

            await interaction.update({ 
                content: `Snippet sent.`, 
                components: [],  // Remove all components to disable further interactions
                ephemeral: true
            });
            await interaction.channel.send(ticketActionMessageObject(`A Snippet was sent to the user:\n\`\`\`${selectedSnippet.snippetContent}\`\`\``, false));
        } else {
            await interaction.reply(ticketErrorMessageObject(`Snippet not found.`, true));
        }
    } else if (interaction.customId === "cancel_snippet_reply_button") {
        await interaction.update({
            content: "Snippet sending cancelled.",
            components: [],  // Remove all components to disable further interactions
            ephemeral: true
        });
    }
};

export { snippetWorkflow }