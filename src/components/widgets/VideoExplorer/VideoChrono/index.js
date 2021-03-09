import React from "react";
import { inject, observer } from "mobx-react";
import { Chrono } from "react-chrono-lazy-loading";

import Frame from './Frame'

@inject("videoExplorerStore")
@inject("deepdetectStore")
@observer
class SourceFolderSelector extends React.Component {

    render() {

        const { videoExplorerStore } = this.props;
        const { frames } = videoExplorerStore;

        if(frames.length === 0)
            return null;

        return (
            <div className='video-chrono'>
              <Chrono mode={"VERTICAL"}>
                {
                    frames.map(f => <Frame
                                      key={f.id}
                                      frame={f}
                                      {...this.props}
                                    />
                              )

                }
              </Chrono>
            </div>
        )

    }

};

export default SourceFolderSelector
