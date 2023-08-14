const { Schema, model } = require('mongoose');

const ticketSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    userAge: {
        type: Number, // Days?
        required: true,
    },
    userTicketTotal: {
        type: Number,
        required: true,
    },
    guildId: {
        type: String,
        required: true,
    },
    guildAge: {
        type: Number, // Days in server?
        required: true,
    },
    ticketId: {
        type: Number,
        default: 0,
    },
    ticketOpen: {
        type: Boolean,
        required: true,
        default: true,
    },
    ticketType: {
        type: String,
        required: true,
        default: 'General Support',
    },
    isClaimed: {
        type: Boolean,
        required: true,
        default: false,
    },
    claimantModId: {
        type: String,
        required: true,
    },
    ticketLevel: { // 0 = normal, 1 = SeniorMod, 2 = HeadMod, 3 = Admin
        type: Number,
        required: true,
        default: 0,
    },
    submitDate: {
        type: Date,
        required: true,
    },
    ticketTimer: {
        type: Number,
        required: true,
    },


});

module.exports = model('ticket', ticketSchema);

/* Dev Notes: 
    - add logic to direct admin tickets to demonly/ket specific forums


*/