import { Server as SocketIOServer } from "socket.io";

const setupSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  const userSocketMap = new Map();

  const disconnect = (socket) => {
    console.log(`Client is disconnected: ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };
  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (!userId) {
      console.log("No userId provided in socket connection.");
      socket.emit("error", "User ID is required.");
      return;
    }
    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
    } else {
      console.log("Id was not provided during connection");
    }

    socket.on("disconnect", () => disconnect(socket));
  });
};

export default setupSocket;
