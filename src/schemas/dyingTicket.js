import mongoose from 'mongoose';

const { Schema, model } = mongoose;

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

export default model('dyingTicket', dyingTicketSchema);