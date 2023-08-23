const mongoose = require('mongoose');

const TicketCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true, default: 'ticketCounter' },
  currentTicketID: { type: Number, default: 10000000 }
});

module.exports = mongoose.model('TicketCounter', TicketCounterSchema);
