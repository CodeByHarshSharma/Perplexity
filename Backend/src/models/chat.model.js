import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    title: {
        type: String,
        default: 'New Chat',
        trime: true
    },
},
{
    timestamps: true
})


const chatModel = mongoose.model("Chats", chatSchema);

export default chatModel