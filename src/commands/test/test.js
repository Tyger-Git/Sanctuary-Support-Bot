// Flex Command: test
/*---------- Will Not Be In Final Product ----------*/


export default {
    name: 'test',
    description: 'Adjustable Testing Command',
    devOnly: true,
    callback: async (client, interaction) => {
        await interaction.deferReply();
        // Get the highest role from the user
        const highestRole = interaction.member.roles.highest;
        winston.info(highestRole.name);
        await interaction.editReply({ content: 'Test Complete' });
    }
};