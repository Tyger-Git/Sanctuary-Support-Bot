const { ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = async (interaction) => {
    //Import the snippets
    const snippets = require("../../snippets.json");
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