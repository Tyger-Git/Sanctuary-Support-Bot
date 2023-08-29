const snippets = require("../../snippets.json");
const modResponse = require("../../modResponse.json");

module.exports = async (interaction) => {
    const snippetIdentifier = interaction.values[0];
    const selectedSnippet = snippets.find(snippet => snippet.value === snippetIdentifier);
    //modResponse();
};