const {
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
  } = require("discord.js");

module.exports = async (interaction) => {
    //Import the snippets
    const snippets = require("../../snippets.json");

    // Create the select menu
    const snippetMenu = new StringSelectMenuBuilder()
        .setCustomId("snippet_menu")
        .setMaxValues(1)
        .setPlaceholder("Select a snippet to send.")
    
    snippets.forEach(snippet => {
        snippetMenu.addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel(snippet.label)
                .setValue(snippet.value)
        );
    });
    const row = new ActionRowBuilder().addComponents(snippetMenu);

    interaction.reply({
        content: "Select a snippet to send.",
        components: [row],
        //ephemeral: true
    });
};