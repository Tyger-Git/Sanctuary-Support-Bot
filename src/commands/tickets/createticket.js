import { ApplicationCommandOptionType } from 'discord.js';

export default {
    name: 'createticket',
    description: 'Create a ticket',
    options: [ 
        {
            name: 'ticket-type',
            description: 'What type of ticket are you creating?',
            type: ApplicationCommandOptionType.String,
            choices: [
                {
                    name: 'User Report',
                    value: 'User Report',
                },
                {
                    name: 'Appeal',
                    value: 'Appeal',
                },
                {
                    name: 'Technical Support',
                    value: 'Technical Support',
                },
                {
                    name: 'VIP Application',
                    value: 'VIP Application',
                },
                {
                    name: 'General Support',
                    value: 'General Support',
                },
            ],
            required: true,
        },
        {
            name: 'user-id',
            description: 'The ID of the user you are opening a ticket for',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'link-ticket',
            description: 'The ID of the ticket you are linking to',
            type: ApplicationCommandOptionType.Integer,
            required: false,
        },
    ],
    callback: async (client, interaction) => {
        await interaction.deferReply();
        const ticketType = interaction.options.getString('ticket-type');

        let specificFields = {};
        switch (ticketType) {
            case "User Report":
                specificFields = {
                reportedUser: 'a',
                userReportReason: 'a'
                };
                ticketLevel = 1;
                break;

            case "Technical Support":
                specificFields = {
                    techIssueType: 'a',
                    techIssueDescription: 'a',
                };
                break;

            case "VIP Application":
                specificFields = {
                    socialMediaName: 'a',
                    vipAppDescription: 'a',
                    socialMediaLinks: 'a',
                };
                ticketLevel = 4;
                break;
            
            case "Appeal":
                specificFields = {
                    ticketToAppeal: 'a',
                    appealReasoning: 'a',
                };
                ticketLevel = 2;
                break;

            case "General Support":
                specificFields = {
                    generalSupportDescription: 'a',
                };
                break;

            default:
                // Handle unsupported ticket types
                break;
        }
    }
}