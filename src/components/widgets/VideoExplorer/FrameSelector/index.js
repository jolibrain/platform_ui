import React from "react";
import { withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";

import ReactPaginate from 'react-paginate';
import Frame from "./Frame"

@inject("videoExplorerStore")
@inject("deepdetectStore")
@observer
@withRouter
class VideoFrameSelector extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            offset: 0,
            perPage: 10
        }

        this.onPageChange = this.onPageChange.bind(this);
    }

    onPageChange(e) {
        const offset = Math.ceil(e.selected * this.state.perPage);
        this.setState({
            ...this.state,
            offset: offset
        })
    }

    render() {

        const { videoExplorerStore } = this.props;

        if(
            !videoExplorerStore.selectedVideo ||
                !videoExplorerStore.selectedVideo.frames ||
                videoExplorerStore.selectedVideo.frames.length === 0
        )
            return null;

        const { frames } = videoExplorerStore.selectedVideo;
        const displayedFrames = frames.slice(
            this.state.offset,
            this.state.offset + this.state.perPage
        )

        const pageCount = Math.ceil(frames.length / this.state.perPage)

        return <div className="frame-selector">
                 <div className="row">
                   {
                       displayedFrames.map((frame, key) => {
                           return <Frame
                                    key={`${key}-${frame.index}`}
                                    frame={frame}
                                    {...this.props}
                                  />
                       })

                   }
                 </div>
                 <div className="row justify-content-center">
                    <ReactPaginate
                        previousLabel={''}
                        nextLabel={''}
                        breakLabel={'...'}
                        breakClassName={'break-me'}
                        pageCount={pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={pageCount}
                        onPageChange={this.onPageChange}
                        containerClassName={'pagination'}
                        pageClassName={'page-item'}
                        pageLinkClassName={'page-link'}
                        activeClassName={'active'}
                    />
                </div>
               </div>

    }

};

export default VideoFrameSelector
