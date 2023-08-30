const { ButtonBuilder, ActionRowBuilder } = require("discord.js");
const snippets = require("../../snippets.json");
const modResponse = require("../../functions/modResponse");

const snippetSelectMenu = async (interaction) => {
    const selectedValue = interaction.values[0];
    const selectedSnippet = snippets.find(snippet => snippet.value === selectedValue);

    if(!selectedSnippet) {
        console.log("Selected snippet is undefined.");
        return;
    }

    // Create the buttons
    const sendReplyButton = new ButtonBuilder()
        .setLabel("Send Reply")
        .setCustomId("send_snippet_reply_button")
        //.setValue(selectedValue) Carry over the value from the select menu?
        .setStyle("Success");

    const cancelButton = new ButtonBuilder()
        .setLabel("Cancel")
        .setCustomId("cancel_snippet_reply_button")
        .setStyle("Danger");

    const row = new ActionRowBuilder().addComponents(sendReplyButton, cancelButton);

    // Send the snippet's message with the confirmation buttons
    await interaction.reply({
        content: `Would you like to reply with this snippet?\n\`\`\`${selectedSnippet.message}\`\`\``,
        components: [row],
        //ephemeral: true
    });
};

module.exports = {
    snippetSelectMenu,
}