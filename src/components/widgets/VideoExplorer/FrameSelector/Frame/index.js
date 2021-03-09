import React from "react";
import { withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";

@inject("videoExplorerStore")
@observer
@withRouter
class Frame extends React.Component {

    render() {

        const {
            frame,
            onFrameClick,
            videoExplorerStore
        } = this.props;

        const totalFrames = videoExplorerStore.selectedVideo.frames.length;
        const frameFraction = frame.index / totalFrames;

        return <div className="col">
                 <img
                   className="img-thumbnail"
                   src={frame.imageSrc}
                   alt={frame.imageAlt}
                   onClick={onFrameClick.bind(this, frameFraction)}
                 />
               </div>

    }

};

export default Frame
