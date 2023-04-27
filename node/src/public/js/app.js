const messgaeList = document.querySelector("ul");
const messageForm = document.querySelector("#message");
const nicknameForm = document.querySelector("#nickname");

const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
    console.log("Connected to Server!");
});

socket.addEventListener("message", (mes) => {
    const li = document.createElement("li");
    li.innerText = mes.data;
    messgaeList.append(li);
});

socket.addEventListener("close", () => {
    console.log("Closed connection...");
});

messageForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const input = messageForm.querySelector("input");
    socket.send(makeMessage("new_message", input.value));
    input.value = "";
});


nicknameForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const input = nicknameForm.querySelector("input");
    socket.send(makeMessage("nickname", input.value));
    // input.value = "";
});

const makeMessage = (type, payload) => {
    const message = {
        type: type,
        payload: payload
    }
    return JSON.stringify(message);
}