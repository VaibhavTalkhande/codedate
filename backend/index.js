const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const cors = require("cors");
const {connectDB} = require("./db/connection");
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const exp = require("constants");


const io = new Server(server,{
    cors:{
        origin:"*",
    },
})


app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // This should match the origin of your React app
    methods: 'GET,POST,PUT,DELETE',
    credentials: true // If you're using cookies or authentication
}));

connectDB();

app.get('/',(req,res)=>{
    res.send("helLo world");

});

app.use("/api",require("./routes/route"));

const users = {};

io.on("connection",(socket)=>{
    console.log(socket.id,"connected");
    //send a welcome message to the client
    socket.emit("welcome",`Welcome ${socket.id}`);
    //handle the initiate chat event
    socket.on("initiate-chat",({senderEmail,recipientEmail})=>{
        console.log("initiate chat",senderEmail,recipientEmail);
        //store the sender and recipient in the users object
        users[senderEmail] = socket.id;
        
        console.log(Object.keys(users).length);
        if(users[recipientEmail]){
        // notify both the sender and the recipient that the chat is initiated
         io.to(users[recipientEmail]).emit("chat-initiated",senderEmail);  
         io.to(users[senderEmail]).emit("chat-initiated",recipientEmail);
 
        }else{
            //handle offline user
            console.log("User ${recipientEmail} is offline");
            io.to(users[senderEmail]).emit("recipient-offline",recipientEmail);
        }
    }
    );
    //handle the send-message event
  socket.on("send-message", ({ senderEmail, recipientEmail, message }) => {
    // send the message to the recipient/receiver
    console.log({ senderEmail, recipientEmail, message });
    if (users[recipientEmail]) {
      // send the message only to the recipient
      io.to(users[recipientEmail]).emit("receive-message", {
        senderEmail,
        message,
      });
    } else {
      // handle offline user
      console.log(`User ${recipientEmail} is offline`);
      // notify the sender that the recipient is offline
      io.to(users[senderEmail]).emit("recipient-offline", recipientEmail);
    }
  });

    socket.on("disconnect",()=>{
        console.log(socket.id,"disconnected");
        //remove the user from the users object
        // if(Object.values(users).includes(socket.id)){
        //     const email = Object.keys(users).find(key=>users[key]===socket.id);
        //     delete users[email];
        // }
        const email = Object.keys(users).find((key)=> users[key]===socket.id);
        if(email){
            delete users[email];
        }
        console.log(Object.keys(users));
    }
    );
})
server.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
}
);