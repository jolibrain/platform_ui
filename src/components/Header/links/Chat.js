import React from "react";

class Chat extends React.Component {
  render() {

    return (
      <li id="chat-link">
        <a
          href="/chat/"
          style={{ textDecoration: "none" }}
          target="_blank"
          rel="noreferrer noopener"
        >
          <i className="fab fa-rocketchat" />&nbsp; Chat
        </a>
      </li>
    );
  }
}

export default Chat;
