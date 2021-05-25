import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import moment from "moment"

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
    const { settings, processingVideos } = videoExplorerStore;

    const processingItems = processingVideos
          .filter(v => {

              // filter video in sidebar when video contains a timestamp
              // and excludeAfterSecondsDelay setting is available
              let includeVideoItem = true;

              if(settings.processingStatusSidebar &&
                 settings.processingStatusSidebar.excludeAfterSecondsDelay &&
                 v.timestamp
                ) {
                  const { excludeAfterSecondsDelay } = settings.processingStatusSidebar;

                  // video is included in sidebar list
                  // when its timestamp + settings delay in seconds
                  // happens after current timestamp
                  includeVideoItem = moment(v.timestamp)
                      .add(excludeAfterSecondsDelay, 'seconds')
                      .isAfter(moment());
              }
              return includeVideoItem;
          })
          .map((video, index) => {
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
