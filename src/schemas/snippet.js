import mongoose from "mongoose";

const { Schema, model } = mongoose;

const snippetSchema = new Schema({
    snippetName: {
        type: String,
        required: true,
        index: true,
    },
    snippetContent: {
        type: String,
        required: true,
    },
});

export default model("snippet", snippetSchema);