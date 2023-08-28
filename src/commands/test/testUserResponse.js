// This is an example of a user response shown in ticket thread
/*---------- Will Not Be In Final Product ----------*/

module.exports = {
    name: 'testuserresponse',
    description: 'Example of a user response shown in ticket thread',
    devOnly: true,
    callback: async (client, interaction) => {
        await interaction.deferReply();
        let string = "I've been trying to reach you about your car's extended warranty. No but really, I still can't make a thread in the druid wts channel...Did you ban me?";
        let modID = '151862710424961024';
        let pingOn = true;
        let pingText = '';
        const channel = interaction.channel;

        if (pingOn === false) {
            pingText = '';
        } else {
            pingText = `<@${modID}>\n`;
        }

        await interaction.deleteReply(); //  Delete command for cleanliness
        await channel.send(`${pingText}User has responded to this ticket: \n\`\`\`${string}\`\`\`\n`);
    }
};