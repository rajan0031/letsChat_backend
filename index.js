const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const app = express();
const socket = require("socket.io");
require("dotenv").config();

app.use(cors());
app.use(express.json());

// mongoose
//   .connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("DB Connetion Successfull");
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });


// start of the  mongo atlas connection 


mongoose.connect("mongodb+srv://raykushwaha0031:C1k4maJXzH2vAmh4@blog.zlf5agh.mongodb.net/Chat", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,  // Example: Increased timeout to 10 seconds
  socketTimeoutMS: 45000,           // Example: Increased socket timeout to 45 seconds
}).then(() => {
  console.log("Database connected successfully");
}).catch((err) => {
  console.error("Error connecting to database:", err);
});


// end of the mongo a;tlss connnection

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.get("/home", (req, res) => {
  res.send("this is the home beta ji");
});

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
