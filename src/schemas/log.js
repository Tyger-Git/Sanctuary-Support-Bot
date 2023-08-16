const { Schema, model } = require('mongoose');

const logSchema = new Schema({
    ticketID: {
        type: Number,
        required: true,
    },
    timeStamp: {
        type: Date,
        required: true,
    },
    isPrimaryMessage: { // For Each logMessage in Log, if (isPrimaryMessage) then primaryMessageCount++ [logic when log is pulled]
        type: Boolean,
        required: true,
        default: false,
    },
    isExternalMessage: { // For Each logMessage in Log, if (isExternalMessage) then externalMessageCount++ [logic when log is pulled]
        type: Boolean,
        required: true,
        default: false,
    },
    isCommand: { // For Each logMessage in Log, if (isCommand) then commandCount++ [logic when log is pulled]
        type: Boolean,
        required: true,
        default: false,
    },
    logMessage: { // Need a message formatter to format the message to be stored in the DB, so when logs are pulled, they can be displayed in a readable format
        type: String,
        required: true,
    },
});

module.exports = model('ticket', logSchema);