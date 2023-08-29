// Small schema for the open tickets collection. This is used to keep track of open tickets and their thread ID's, as to make querying for open tickets easier.

const { Schema, model, mongoose } = require('mongoose');

const openTicketSchema = new Schema({
    userId: { // Discord ID
        type: String,
        required: true,
    },
    guildId: { // Server ID
        type: String,
        required: true,
    },
    ticketId: { // Ticket ID
        type: Number,
        default:0
    },
    ticketThread: { // Discord thread ID
        type: String,
        required: false,
        default: '',
    }
});

module.exports = model('openTicket', openTicketSchema);