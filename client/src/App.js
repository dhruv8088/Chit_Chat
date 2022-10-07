import './App.css';
import { useState } from "react";
import io from 'socket.io-client'
// this library helps to connect react with socket.io server
import Chat from "./Chat";

const socket = io.connect("http://localhost:9000"); 

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  // for sending the room id to the data in the backend and entering the room
  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div className="App">
    <img src='https://logopond.com/logos/d214b57609013e1397567df7f08d8115.png' alt='logo' />
      {!showChat ? (
        // for asking the name of the client and the room
        <div className="joinChatContainer">
          <h3>Join A Chat</h3>
          <input
            type="text"
            placeholder="Name..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Join A Room</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
