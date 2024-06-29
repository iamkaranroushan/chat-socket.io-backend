import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import apiRoute from "./routes/apiRoute.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js";
import connectDb from "./config/database.js";
import jwt from "jsonwebtoken";
import User from "./model/user.js";
import saveMessage from "./services/messageService/saveMessage.js";
import fetchMessage from "./services/messageService/fetchMessage.js";
import sendMail from "./services/emailService/nodemailer.js";

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  // Add other CORS options if needed
};

// Create an Express app instance
const app = express();
const port = process.env.PORT || 8000;

// Apply middleware to the Express app
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

//routes
app.use("/api", apiRoute);
app.use("/auth", authRoutes); //login & register
app.use("/user", userRoutes); // user fetching
app.use("/media",mediaRoutes); //media saving and fetching

// Create a HTTP server instance using the Express app
const server = createServer(app);

// Create a Socket.IO server instance and mount it on the HTTP server
const io = new Server(server, {
  cors: {
    origin: "https://chat-socket-io-frontend-g6wj-beryl.vercel.app/",
    credentials: true,
  },
});

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    // console.log(token)
    if (!token) {
      console.log("no token");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      console.log("invalid token");
    }
    const user = await User.findById(decoded.id).select("-password");
    socket.user = user;
    socket.userId = user._id;
    next();
  } catch (err) {
    console.log(err);
  }
});

/// Listening to Socket.IO connection events
io.on("connection", (socket) => {
  // Log when a client connects
  console.log(`${socket.user.username} connected`);

  socket.on("sendMessage", async (message, recId, roomId, isImage) => {
    // console.log(message);
    
    let sender = socket.userId;
    if (isImage == false) {
      saveMessage({
        sender: socket.userId,
        receiver: recId,
        content: message,
        isImage: false,
      });
      console.log("text received");
    } else{
      saveMessage({
        sender: socket.userId,
        receiver: recId,
        content: message,
        isImage: true,
      });
      console.log("image received");
    }
    // let messages = await fetchMessage(socket.userId, recId);
    // console.log(`this is final  ${messages}`);
    //todo:change the message receiving just after sending it without fetching the data;
    io.to(roomId).emit("receiveMessage", { message: message, sender: sender, isImage: isImage });
  });

  socket.on("mailSending", async (to, subject, message) => {
    console.log(`${to}, ${subject}, ${message}`);
    //todo:take the mail contents and send the mail her in the backend
    //todo:i can have access to the mail address of both sender and reciever
    const from = socket.user.email;
    const infoData = await sendMail(from, to, subject, message);
    console.log(infoData);
  });

  socket.on("startConversation", async (recId, username) => {
    console.log("start conversation event");
    const roomId = createRoomId(socket.userId, recId);
    socket.join(roomId);
    console.log(`${socket.user.username} joined  the room with ${username}`);
    socket.emit("conversationStarted", recId, roomId, username);
    let sender = socket.user.username;
    let messages = await fetchMessage(socket.userId, recId);
    console.log(`this is final  ${messages}`);

    messages.forEach((msg) => {
      // Send each message to the client
      socket.emit("receiveMessage", {
        message: msg.message,
        sender: msg.sender,
        isImage: msg.isImage,
      });
      console.log(msg.isImage)
    });

    socket.to(roomId).emit("receiveMessage", {
      message: `🤖: ${socket.user.username} joined the room`,
      sender: "Bot",
      isImage:false
    });
    socket.emit("receiveMessage", {
      message: `🤖: welcome to ${username}'s room`,
      sender: "Bot",
      isImage:false
    });
    // io.to(roomId).emit("receiveMessage", messages);
  });

  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
    socket.to(roomId).emit("receiveMessage", {
      message: `🤖: ${socket.user.username} left the room`,
      sender: "Bot",
    });
    socket.emit("userLeft", "user has left the room");
  });

  // Listen for a "disconnect" event from the client and log it
  socket.on("disconnect", () => {
    socket.emit("userLeft", "user has left the room");
    console.log(`${socket.user.username} disconnected`);
  });
});

// Start listening to the server on port 8000
connectDb()
  .then(() =>
    server.listen(port, () => {
      console.log(`Server is running on port:${port}`);
    })
  )
  .catch((err) => console.log(err));

const createRoomId = (id_1, id_2) => {
  const sortedUserIds = [id_1, id_2].sort();
  return sortedUserIds.join("_");
};
