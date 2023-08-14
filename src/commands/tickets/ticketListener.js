const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType,
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
  } = require("discord.js");
  const ticketSchema = require("../../schemas/ticket");

module.exports = {
    name: 'ticketlistener',
    description: 'Adds the ticket listener to the channel',
    devOnly: true,
    callback: async (client, interaction) => {
        await interaction.deferReply();
        
        const ticketEmbed = new EmbedBuilder()
        .setColor(2829617)
        .setDescription(
          "> Stop it, get help."
        );

      const menu = new StringSelectMenuBuilder()
        .setCustomId("Select")
        .setMaxValues(1)
        .setPlaceholder("Select a topic.")
        .addOptions(
          new StringSelectMenuOptionBuilder()
            .setLabel("General Support")
            .setDescription("You've some general questions?")
            .setValue("General Support")
            .setEmoji("1136239180003938346"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Moderation Support")
            .setDescription("You've some moderation related questions?")
            .setValue("Moderation Support")
            .setEmoji("1136239171703418900"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Server Support")
            .setDescription("You've some server related questions?")
            .setValue("Server Support")
            .setEmoji("1136239186266038412"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Something Else")
            .setDescription("You've something else to say?")
            .setValue("Something Else")
            .setEmoji("1136239205551452300")
        );

      const row = new ActionRowBuilder().addComponents(menu);
    
      interaction.editReply({ embeds: [ticketEmbed], components: [row] });
    }
}