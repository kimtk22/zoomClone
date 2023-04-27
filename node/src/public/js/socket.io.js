const socket = io();

const welcome = document.querySelector("#welcome");
const welcomeForm = welcome.querySelector("form");

const room = document.querySelector("#room");
const messageForm = room.querySelector("form");

const nickname = document.querySelector("#nickname");
const nicknameForm = nickname.querySelector("form");

const publicRooms = document.querySelector("#publicRooms");

room.hidden = true;

function addMessage(msg){
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    
    li.innerText = msg;
    ul.append(li);
}

welcomeForm.addEventListener("submit", event => {
    event.preventDefault();
    
    const input = welcomeForm.querySelector("input");
    
    socket.emit("enter_room", input.value, () => {
        const subject = room.querySelector("h2");
        subject.innerText = input.value;

        input.value = ""
        room.hidden = false;
        welcome.hidden = true;
    });
});

messageForm.addEventListener("submit", event => {
    event.preventDefault();
    
    const input = messageForm.querySelector("input");
    const roomName = room.querySelector("h2").innerText;

    addMessage(`You : ${input.value}`);
    socket.emit("new_message", input.value, roomName);

    input.value = "";
});

nicknameForm.addEventListener("submit", event => {
    event.preventDefault();
    
    const input = nicknameForm.querySelector("input");
    socket.emit("nickname", input.value);

    input.value = "";
});

socket.on("welcome", (nickname) => {
    addMessage(`${nickname} joined!`);
});

socket.on("new_message", (message) => {
    addMessage(message);
});

socket.on("leave", (nickname) => {
    addMessage(`${nickname} is leaved...`);
});

socket.on("public_rooms", (publicRoomList) => {
    publicRoomList.forEach(publicRoom => {
        const ul = publicRooms.querySelector("ul");
        const li = document.createElement("li");

        li.innerText = publicRoom;
        ul.remove();
        ul.append(li);
    });
});