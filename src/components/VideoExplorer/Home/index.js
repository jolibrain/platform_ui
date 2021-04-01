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

    return (
      <div>
        <Header />
        <div className="layout-page page-gutter page-with-contextual-sidebar right-sidebar-collapsed page-with-icon-sidebar video-explorer-home-component">
          <LeftPanel />
          <MainView />
        </div>
      </div>
    );
  }
}
export default VideoExplorerHome;
