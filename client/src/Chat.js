import React, {useEffect, useState} from 'react';
import ScrolltoBottom from 'react-scroll-to-bottom';
// scroll to bottom is used to automatically scroll down the page when the chat goes down.
function Chat ({socket, username, room}) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    // for sending the messages along with time and username 
    // async is used as we need to wait for the message till the time it does not come 
    // and make a promise for that.
   
    const sendMessage = async () => {
        if (currentMessage !== "") {
          const messageData = {
            room: room,
            author: username,
            message: currentMessage,
            time:
              new Date(Date.now()).getHours() +
              ":" +
              new Date(Date.now()).getMinutes(),
          };
         
          
          await socket.emit("send_message", messageData);
          // for displaying the message on user 1 screen send by user 1.
          setMessageList((list) => [...list, messageData]);
          setCurrentMessage("");
          // an empty array is made so that if when we click the arrow button 
          // all which is written in the send box is removed.
        }
      };
    
      // for receiving the messages from the backend so that 
      // it could be displayed on the screen
      useEffect(() => {
        
        socket.on("receive_message", (data) => {
            // // for displaying the message on user 2 screen send by user 1.
          setMessageList((list) => [...list, data]);
          
        });
      }, [socket]);
      
  return (
    <div className="chat-window">
         <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className='chat-body'>
      <ScrolltoBottom className='message-container'>
        {messageList.map((messageContent)=>{
            return (
              <div
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
        })}
        </ScrolltoBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;