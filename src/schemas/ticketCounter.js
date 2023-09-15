import mongoose from 'mongoose';

const TicketCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true, default: 'ticketCounter' },
  currentTicketID: { type: Number, default: 10000000 }
});

export default mongoose.model('TicketCounter', TicketCounterSchema);
