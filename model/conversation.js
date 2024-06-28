import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  // Other conversation fields such as lastMessage, timestamp, etc.
});

const Conversation =
  mongoose.models.Conversation ||
  mongoose.model("Conversation", conversationSchema);
export default Conversation;
