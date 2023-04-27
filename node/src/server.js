import express from "express";
import http from "http";
// import { WebSocketServer } from "ws";
import {Server} from "socket.io";
import path from 'path';

const __dirname = path.resolve();
const app = express();


app.set("view engine", "pug");
app.set("views", __dirname + '/src/views');

app.use("/public", express.static(__dirname + "/src/public"));

app.get("/", (req, res) => res.render("socketIO"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log("Listen on http://localhost:3000");

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);

const getPublicRooms = () => {
    const { rooms, sids } = wsServer.sockets.adapter;
    
    const publicRooms = [];
    rooms.forEach((_, key) => {
        if(sids.get(key) === undefined){
            publicRooms.push(key);
        }
    });

    return publicRooms;
}

wsServer.on("connection", socket => {
    socket["nickname"] = "익명";

    socket.on("enter_room", (roomName, callback) => {
        socket.join(roomName);

        socket.to(roomName).emit("welcome", socket.nickname);
        wsServer.emit("public_rooms", getPublicRooms());

        callback();
    });

    socket.on("new_message", (message, roomName) => {
        socket.to(roomName).emit("new_message", `${socket.nickname} : ${message}`);
    });

    socket.on("nickname", (nickname) => {
        socket["nickname"] = nickname;
    });

    socket.on("disconnecting", () => {
        socket.rooms.forEach(room => {
            socket.to(room).emit("leave", socket.nickname);
            wsServer.emit("public_rooms", getPublicRooms());
        })
    });
});

// // http도 같이 하기 위해 server 주입
// const wss = new WebSocketServer({server});
// const sockets = [];
// let num = 1;

// wss.on("connection", (socket) => {
//     socket["nickname"] = `User${num++}`
//     sockets.push(socket);
//     console.log(socket["nickname"]);


//     console.log("Connected socket from client");
//     socket.on("close", (code, reason) => { console.log(`Closed connection, code : ${code}, reason : ${reason}`) });
//     socket.on("message", (message) => { 
//         const mes = JSON.parse(message);
//         switch(mes.type){
//             case "nickname":
//                 socket["nickname"] = mes.payload;
//                 break;
//             case "new_message":
//                 sockets.forEach(aSocket => { aSocket.send(`${socket.nickname} : ${mes.payload}`); });
//                 break;
//         }
//      });
// });

httpServer.listen(3000, handleListen);