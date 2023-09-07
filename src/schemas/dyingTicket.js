// Tickets awaiting thread deletion

const { Schema, model, mongoose } = require('mongoose');

const dyingTicketSchema = new Schema({
    ticketId: { // Ticket ID
        type: Number,
        default:0
    },
    ticketThread: { // Discord thread ID
        type: String,
        required: false,
        default: '',
    },
    closeDate: { // Date the ticket was closed
        type: Date,
        required: false,
    },
});

module.exports = model('dyingTicket', dyingTicketSchema);