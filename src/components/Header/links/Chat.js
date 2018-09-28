import React from "react";
import { inject } from "mobx-react";

@inject("configStore")
class Chat extends React.Component {
  render() {
    const { configStore } = this.props;

    if (configStore.isComponentBlacklisted("LinkChat")) return null;

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
