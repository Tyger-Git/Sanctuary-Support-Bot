// Test function to call when the bot receives a DM
/*---------- Will Not Be In Final Product ----------*/

module.exports = async (message) => {

    console.log(`Got DM from ${message.author.tag}`);
    // Reply with "Hello"
    await message.reply("Hello");

    // Reply with the user's ID
    await message.reply(`Your user ID is: ${message.author.id}`);
}
