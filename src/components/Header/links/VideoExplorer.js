import React from "react";
import { Link } from "react-router-dom";
import { inject } from "mobx-react";

@inject("configStore")
class VideoExplorer extends React.Component {
    render() {
        const { configStore } = this.props;

        const videoExplorerPatt = /^#\/video-explorer/g;
        const selectedItem = videoExplorerPatt.test(window.location.hash);

        const linkIconClassName = configStore.videoExplorer.icon ?
              `fas ${configStore.videoExplorer.icon}`
        :
              "fas fa-photo-video";

        const linkTitle = configStore.videoExplorer.title ?
              configStore.videoExplorer.title : "Video Explorer"

        return (
            <li id="video-explorer-link" className={selectedItem ? "selected" : ""}>
              <Link to="/video-explorer" style={{ textDecoration: "none" }}>
                <i className={linkIconClassName}/>
                &nbsp; {linkTitle}
              </Link>
            </li>
        );
    }
}

export default VideoExplorer;
