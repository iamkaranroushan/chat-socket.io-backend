import Message from "../../model/message.js";
import Conversation from "../../model/conversation.js";

const saveMessage = async ({ sender, receiver, content, isImage }) => {
  try {
    let conversationId;
    let conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
    });

    if (conversation) {
      conversationId = conversation._id;
    } else {
      conversation = new Conversation({
        participants: [sender, receiver],
        messages: [],
      });

      conversationId = conversation._id;
    }

    const newMessageData = {
      conversationId,
      sender,
      receiver,
    };

    if (isImage) {
      newMessageData.imageData = content;
      newMessageData.isImage = true;
    } else {
      newMessageData.message = content;
      newMessageData.isImage = false;
      
    }

    const newMessage = new Message(newMessageData);

    const savedMessage = await newMessage.save();

    conversation.messages.push(savedMessage._id);
    await conversation.save();

    console.log("saved");
  } catch (error) {
    console.log(error);
  }
};

export default saveMessage;
