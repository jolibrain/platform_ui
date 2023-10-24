import React from "react";
import { observer } from "mobx-react";

import Header from "../../Header";
import LeftPanel from "../commons/LeftPanel";
import MainView from "./MainView";

import stores from "../../../stores/rootStore";

const VideoExplorerHome = observer(class VideoExplorerHome extends React.Component {
  render() {

    const { configStore } = stores;

    if (
      configStore.isComponentBlacklisted("VideoExplorer") ||
      configStore.isComponentBlacklisted("VideoExplorerHome")
    )
      return null;

    let mainClassNames = [
      "layout-page",
      "page-gutter",
      "right-sidebar-collapsed",
      "page-with-icon-sidebar",
      "video-explorer-home-component"
    ]

    if (
      !configStore.isComponentBlacklisted("RightPanel")
    )
      mainClassNames.push("page-with-contextual-sidebar")

    return (
      <div>
        <Header />
        <div className={mainClassNames.join(" ")}>
          <LeftPanel />
          <MainView />
        </div>
      </div>
    );
  }
});
export default VideoExplorerHome;
