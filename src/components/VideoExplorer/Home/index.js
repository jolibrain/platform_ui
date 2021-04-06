import React from "react";
import { inject, observer } from "mobx-react";

import Header from "../../Header";
import LeftPanel from "../commons/LeftPanel";
import MainView from "./MainView";

@inject("configStore")
@observer
class VideoExplorerHome extends React.Component {

  render() {
    if (
      this.props.configStore.isComponentBlacklisted("VideoExplorer") ||
      this.props.configStore.isComponentBlacklisted("VideoExplorerHome")
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
      !this.props.configStore.isComponentBlacklisted("RightPanel")
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
}
export default VideoExplorerHome;
