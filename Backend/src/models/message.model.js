import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chats",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['User', 'AI'],
        required: true,
    }
},{ timestamps: true });


const messageModel = mongoose.model("Messages",messageSchema);

export default messageModel;