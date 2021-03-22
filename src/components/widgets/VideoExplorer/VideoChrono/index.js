import React from "react";
import { inject, observer } from "mobx-react";

import Frame from './Frame'

@inject("videoExplorerStore")
@inject("deepdetectStore")
@observer
class VideoChrono extends React.Component {

    render() {

        const { videoExplorerStore } = this.props;
        const { frames } = videoExplorerStore;

        if(frames.length === 0)
            return null;

        const { settings } = videoExplorerStore;
        const { chronoItemSelectors } = settings;

        return (
            <div className='video-chrono'>
              {
                  frames
                      .filter(f => f)
                      .map(f => <Frame
                                  key={f.id}
                                  frame={f}
                                  selectors={chronoItemSelectors}
                                  {...this.props}
                                />
                          )

              }
            </div>
        )

    }

};

export default VideoChrono
