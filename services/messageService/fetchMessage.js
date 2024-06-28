import Conversation from "../../model/conversation.js";
// import Message from "../../models/message.js";

const fetchMessage = async (senderId, receiverId) => {
  try {
    // console.log(senderId)
    // console.log(receiverId)
    // Find the conversation where the sender and receiver match
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    }).populate("messages");

    if (!conversation) {
      return [];
    }
    // Fetch messages associated with the conversation
    // const messages = await Message.find({ conversationId: conversation._id });
    const messages = conversation.messages.map(msg => ({
      sender: msg.sender,
      message: msg.imageData || msg.message,
      isImage: !!msg.imageData
    }));
    // console.log(message);
    return messages
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};

export default fetchMessage;
