// Flex Command: test
/*---------- Will Not Be In Final Product ----------*/
import { EmbedBuilder } from "discord.js";


export default {
    name: 'test',
    description: 'Adjustable Testing Command',
    devOnly: true,
    callback: async (client, interaction) => {
        await interaction.deferReply();
        // Get the highest role from the user
        const highestRole = interaction.member.roles.highest;
        winston.info(highestRole.name);
        let text = `[Test](https://old.discordjs.dev/#/docs/discord.js/main/class/Message?scrollTo=attachments)`;
        const embed = new EmbedBuilder()
            .setTitle(`Test`)
            .setDescription(text);
        await interaction.editReply({ embeds: [embed]});
    }
};