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
        index: true,
    },
    closeTimer: { // How long until the ticket is closed, in hours
        type: String,
        required: false,
        default: '.5',
        index: true,
    },
});

module.exports = model('dyingTicket', dyingTicketSchema);