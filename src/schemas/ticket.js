const { Schema, model, mongoose } = require('mongoose');

const ticketSchema = new Schema({
    // User information
    /******************************************************************************************************************************************************/
    userId: { // Discord ID
        type: String,
        required: true,
    },
    userName: { // Discord username
        type: String,
        required: true,
    },
    userDisplayName: { // Discord nickname
        type: String,
        required: true,
    },
    userAge: { // Days user has had a discord account
        type: Number, 
        required: true,
    },
    userTicketTotal: { // Total tickets submitted by user
        type: Number,
        required: true,
    },
    lastUserResponse: { // Used with a listener to determine if a ticket is inactive and close
        type: Date,
        required: true,
    },

    // Server information
    /******************************************************************************************************************************************************/
    guildId: { // Server ID
        type: String,
        required: true,
    },
    guildAge: { // Days in server
        type: Number,
        required: true,
    },

    // Ticket information
    /******************************************************************************************************************************************************/
    ticketId: { // Ticket ID
        type: Number,
        default:0,
        index: true,
    },
    threadCreated: { // Mainly for debugging and devs
        type: Boolean,
        required: true,
        default: false,
    },
    threadDeleted: { // To be used when referencing an older ticket
        type: Boolean,
        required: true,
        default: false,
    },
    ticketThread: { // Discord thread ID
        type: String,
        required: false,
        default: '',
        index: true,
    },
    ticketThreadMessage: { // Discord message ID
        type: String,
        required: false,
        default: '',
    },
    isOpen: { // Is the ticket open?
        type: Boolean,
        required: true,
        default: true,
    },
    isArchiving: { // Is the ticket closing?
        type: Boolean,
        required: true,
        default: false,
    },
    ticketType: { // General Support, Technical Support, VIP Applications, Player Reports, Staff Reports
        type: String,
        enum: ['General Support', 'Technical Support', 'VIP Application', 'Player Report', 'Staff Report'],
        required: true,
        default: 'General Support',
    },
    isClaimed: { // Is the ticket claimed by a mod?
        type: Boolean,
        required: true,
        default: false,
    },
    claimantModId: { // Discord ID of the mod who claimed the ticket
        type: Number,
        required: false,
        default: 0,
    },
    claimantModName: { // Discord username of the mod who claimed the ticket
        type: String,
        required: false,
        default: 'Unclaimed',
    },
    lastModResponse: { // Used with a listener to determine when to ping the mod
        type: Date,
        required: false,
    },
    ticketLevel: { // 0 = Helper, 1 = Mod, 2 = SeniorMod, 3 = Admin
        type: Number,
        required: true,
        default: 0,
    },
    openDate: { // Date the ticket was opened
        type: Date,
        required: true,
    },
    closeDate: { // Date the ticket was closed
        type: Date,
        required: false,
    },
    closeTimer: { // How long until the ticket is closed, in hours
        type: String,
        required: false,
        default: '.5',
    },
    ticketAttachments: { // Attachments submitted with the ticket
        type: [String],
        required: false,
        default: [],
    },
    isAlertOn: { // Should the mod be alerted when the user responds?
        type: Boolean,
        required: true,
        default: true,
    },
    modNotes: { // Notes added by the mod
        type: String,
        required: false,
        default: 'Ticket Unresolved',
    },


    // Ticket Content
    /******************************************************************************************************************************************************/
    // Player Reports
    reportedUser: { // Who is the report against?
        type: String,
        required: false,
        default: 'N/A',
    },
    playerReportReason: { // Why is the user being reported?
        type: String,
        required: false,
        default: 'N/A',
    },

    // Staff Reports
    reportedMod: { // Who is the report against?
        type: String,
        required: false,
        default: 'N/A',
    },
    modReportReason: { // Why is the user being reported?
        type: String,
        required: false,
        default: 'N/A',
    },

    // Technical Support
    techIssueType: { // What type of issue is the user having?
        type: String,
        required: false,
        default: 'N/A',
    },
    techIssueDescription: { // What is the issue?
        type: String,
        required: false,
        default: 'N/A',
    },

    // VIP Applications
    socialMediaName: { // What is the user's social media name?
        type: String,
        required: false,
        default: 'N/A',
    },
    vipAppDescription: { // Why should the user be accepted?
        type: String,
        required: false,
        default: 'N/A',
    },
    socialMediaLinks: { // Links to the user's social media
        type: Array, // Todo: parse string answer into array
        required: false,
        default: [],
    },

    // General Support
    generalSupportDescription: { // What is the issue?
        type: String,
        required: false,
        default: 'N/A',
    },
});

module.exports = model('ticket', ticketSchema);