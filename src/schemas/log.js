const { Schema, model } = require('mongoose');

const logSchema = new Schema({
    ticketId: {
        type: Number,
        required: true,
        index: true,
    },
    timeStamp: {
        type: Date,
        default: Date.now,
    },
    messageType: { // 'Primary', 'Secondary', 'Command'
        type: String,
        required: true,
        enum: ['Primary', 'Secondary', 'Event'],
    },
    userId: {  // Capturing the user ID of the person who triggered the log
        type: String,
        required: true,
    },
    classType: { // Capturing the user type - What emoji shows up next to the log
        type: String,
        required: true,
        enum: ['User', 'Staff', 'Bot'],
    },
    userRole: { // Capturing the user role for traceability
        type: String,
        required: true,
    },
    logMessage: { 
        type: String,
        required: true,
    },
});

module.exports = model('log', logSchema);
