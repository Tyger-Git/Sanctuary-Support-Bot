module.exports = {
    name: 'testuserresponse',
    description: 'Example of a user response shown in ticket thread',
    devOnly: true,
    callback: async (client, interaction) => {
        await interaction.deferReply();
        let string = "I've been trying to reach you about your car's extended warranty. No but really, I still can't make a thread in the druid wts channel...Did you ban me?";
        const channel = interaction.channel;

        await interaction.deleteReply(); //  Delete command for cleanliness
        await channel.send(`Tyger responded to this ticket: \n\`\`\`${string}\`\`\`\n`);
    }
};