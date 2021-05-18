import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import ProcessingItem from "./Items/ProcessingItem";

@inject("videoExplorerStore")
@inject("configStore")
@withRouter
@observer
class ProcessingStatus extends React.Component {
  render() {
    if (this.props.configStore.isComponentBlacklisted("ProcessingStatus"))
      return null;

    const { videoExplorerStore } = this.props;
    const { processingVideos } = videoExplorerStore;

    const processingItems = processingVideos.map((video, index) => {
      return <ProcessingItem key={index} video={video} />;
    });

    return (<div id="widget-processingStatus">
        <h5>Video Processing</h5>
        {
            processingItems.length === 0 ?
                <p>No video in queue.</p>
            :
            <ul className="processingStatus sidebar-top-level-items">
                {processingItems}
            </ul>
        }
    </div>);
  }
}
export default ProcessingStatus;
