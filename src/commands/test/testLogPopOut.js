// Test command to pop out logs into a thread, in plain text (No emebeds, scroll through the entire log)
/*---------- Will Not Be In Final Product ----------*/

const { SlashCommandBuilder } = require("discord.js");

function chunkStringArrayByCharCount(array, charLimit) {
    let chunk = "";
    const result = [];

    for (const log of array) {
        const nextLog = `${log.name}\n${log.value}\n\n`;
        if ((chunk.length + nextLog.length) <= charLimit) {
            chunk += nextLog;
        } else {
            result.push(chunk);
            chunk = nextLog;
        }
    }

    if (chunk) result.push(chunk);
    return result;
}

module.exports = {
    name: 'tlogpopout',
    description: 'Test Log Pop Out',
    callback: async (client, interaction) => {
        await interaction.deferReply(/*{ ephemeral: true }*/);

        // Create a string representation of the logs and chunk them
        const chunkedLogs = chunkStringArrayByCharCount(whosOnFirstSkitArray, 1900); // 1900 to allow room for potential other characters

        // Send each chunk as an individual message
        for (const chunk of chunkedLogs) {
            await interaction.followUp({ content: chunk/*, ephemeral: true */});
        }
    }
}

let whosOnFirstSkitArray = [ // GPT broke down mid array so this is just nonsense at this point:
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon:  Abbot (User)",
        "value": "Well Costello, I'm going to New York with you. You know Bucky Harris, the Yankee's manager, gave me a job as coach for as long as you're on the team."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "Look Abbot, if you're the coach, you must know all the players."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "I certainly do."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "Well you know I've never met the guys. So you'll have to tell me their names, and then I'll know who's playing on the team."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "Oh, I'll tell you their names, but you know it seems to me they give these ball players nowadays very peculiar names."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "You mean funny names?"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "Strange names, pet names...like Dizzy Dean..."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "His brother Daffy."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "Daffy Dean..."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "And their French cousin."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "French?"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "Goofé Dean."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "Goofé Dean. Well, let's see, we have on the bags, Who's on first, What's on second, I Don't Know is on third..."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "That's what I want to find out."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "I say Who's on first, What's on second, I Don't Know's on third."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "Are you the manager?"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "Yes."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "You gonna be the coach too?"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "Yes."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "And you don't know the fellows' names?"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "Well I should."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "Well then who's on first?"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "Yes."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "I mean the fellow's name."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "Who."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "The guy on first."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "Who."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "The first baseman."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "Who."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "The guy playing..."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "Who is on first!"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "I'm asking you who's on first."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "That's the man's name."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "That's whose name?"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "Yes."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "Well go ahead and tell me."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "That's it."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "That's who?"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "Yes."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "Look, you gotta first baseman?"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "Certainly."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "Who's playing first?"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "That's right."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "When you pay off the first baseman every month, who gets the money?"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "Every dollar of it. And why not, the man's entitled to it."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "Who is?"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "Yes."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "So who gets it?"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "Why shouldn't he? Sometimes his wife comes down and collects it."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "Who's wife?"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "Yes. After all, the man earns it."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "All I'm trying to find out is what's the guy's name on first base."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "No. No. What is on second base."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "I'm not asking you who's on second."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "Who's on first!"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "That's what I'm trying to find out!"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "Well, don't change the players around."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "I'm not changing nobody!"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "Take it easy, buddy."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "I'm only asking you, who's the guy on first base?"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "That's right."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "Ok."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "Alright!"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "What's the guy's name on first base?"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "No. What is on second."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "I'm not asking you who's on second."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "Who's on first!"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "I don't know!"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "He's on third. We're not talking about him."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "Now how did I get on third base?"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "You mentioned his name!"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "If I mentioned the third baseman's name, who did I say is playing third?"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "No. Who's playing first!"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "Stay off of first, will ya?"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "Well, what do you want me to do?"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "What's the guy's name on third base?"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "What's on second."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "I'm not asking you who's on second."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "Who's on first!"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "I don't know."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "He's on third."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "There I go, back on third again!"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "Would you just stay on third base and don't go off it?"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "Alright, what do you want to know?"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "Now who's playing third base?"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "Why do you insist on putting Who on third base?"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "What am I putting on third."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "You don't want who on third?"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "Who is playing first."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "I don't want him there. I want Who on third!"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "We're not talking about him."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "Now how did I get on third base?"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "You mentioned his name."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "If I mentioned the third baseman's name, who did I say is playing third?"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "No, Who's playing first!"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "Nevermind first base! I want to know what's the guy's name on third base!"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "No, What is on second."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "I'm not asking you who's on second."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "Who's on first!"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "I don't know."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "He's on third."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "There I go, back on third again!"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "Would you just stay on third base and don't go off it?"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "Alright, alright, I’m staying right here on third base. I want to know what’s the guy’s name on third base."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "What is on second."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "I’m not asking you who’s on second."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "Who's on first!"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "I don’t know!"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "He’s on third base."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "I can’t change their names!"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "Please don't get excited. Now what is the fellow's name on third base?"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "What is the fellow’s name on second base."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "I am not asking you who’s on second!"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "Who’s on first!"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "I don’t know!"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "Third base!"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "So who's playing first?"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "Yes."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "I mean the fellow's name."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "Who."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "The guy on first base."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "Who."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "The first baseman."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "Who."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "The guy playing..."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "Who is on first!"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "I'm asking YOU who's on first."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "That's the man's name."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "That's whose name?"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "Yes."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "When you pay off the first baseman every month, who gets the money?"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "Every dollar of it."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "All I'm trying to find out is the fellow's name on first base."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "Who."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "The guy that gets..."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "That's it."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "Who gets the money..."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "He does, every dollar. Sometimes his wife comes down and collects it."
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:shield: Costello (Mod)",
        "value": "Whose wife?"
    },
    {
        "name": "<:icon_redline:1140786363277512724>\n:speech_balloon: Abbot (User)",
        "value": "Yes."
    },
];