const express = require("express");
const app = express();
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
const io = require("socket.io")(server);
// Peer
const port = process.env.PORT  || 3030
var portForPeer='3030'

const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});


const {generatemessage} = require('./utils/messages')
const {addUser, removeUser, getUser, getUserInRoom} = require('./utils/users')


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/peerjs", peerServer);

app.get('/leftleft', (req, res) => {
    res.render('homepage')
    })
  
app.get("/", (req, rsp) => {
  rsp.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room,portForPeer:portForPeer });
});

io.on("connection", (socket) => {
  console.log("I am in")
  socket.on("join-room", (roomId, userId,username) => {
    console.log("Join room on event")
    socket.join(roomId);
    const user = addUser({id:userId,username,room:roomId})
    const users = getUserInRoom(roomId)
    //getting the list
    io.to(roomId).emit('roomData',{
      
      users:getUserInRoom(roomId)
  })
    console.log(users)
    socket.to(roomId).emit("user-connected", userId);
      
      socket.on("message", (message,username) => {
        io.to(roomId).emit("createMessage",generatemessage(message,username));
      });
      



      socket.on('disconnect',()=>{
        const user = removeUser(userId)
        const users = getUserInRoom(roomId)
        //getting the list
        io.to(roomId).emit('roomData',{
      
         users:getUserInRoom(roomId)
        }) 
    
        console.log(`${username} disconnected`);
        console.log(users)
        socket.to(roomId).emit("user-disconnected", userId);
      })
  
    })

  });
  


server.listen(port,function(req,res){
  console.log("Server running at port",port)
});