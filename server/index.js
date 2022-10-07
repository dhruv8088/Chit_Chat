const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
// cors is used  to relax the security applied to an API which allows a server to indicate any origins (domain, scheme, or port) other than its own 
// from which a browser should permit loading resources.
const { Server } = require("socket.io");
// used curly brackets as server is something in the socket.io library and it is not the whole library
app.use(cors());
const server=http.createServer(app);


const io = new Server(server,{
    cors:{
        origin: "http://localhost:3000",
        methods: ["GET","POST"],
    },
});

io.on("connection",(socket)=>{
        console.log(`user ${socket.id} connected`);
   // to determine whwn a user wants to connect
        socket.on("join_room",(data)=>{
            socket.join(data);
            // data is nothing but the room id we got from the front end
            console.log(`User with id: ${socket.id} joined room: ${data}`);
        });
        socket.on("send_message",(data)=>{
            socket.to(data.room).emit("receive_message",data);
        })
        socket.on("disconnect",()=>{
              console.log("User disconnected",socket.id); // socket.id to get which user disconnected
        })
});


server.listen(9000, () => {
    console.log("SERVER RUNNING");
  });