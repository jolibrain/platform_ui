import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import ReactPlayer from 'react-player'

import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/cjs/styles/hljs";

import RightPanel from "../commons/RightPanel";

import SourceFolderSelector from "../../widgets/VideoExplorer/SourceFolderSelector"
import VideoChrono from "../../widgets/VideoExplorer/VideoChrono"

@inject("videoExplorerStore")
@inject("configStore")
@inject("gpuStore")
@withRouter
@observer
class MainView extends React.Component {

  ref = player => {
    this.player = player
  }

  constructor(props) {
    super(props);

    this.state = {
    };

    this.handleFrameClick = this.handleFrameClick.bind(this);

  }

  componentDidMount() {
    const { videoExplorerStore } = this.props;

    if (videoExplorerStore.loaded === false) {
      videoExplorerStore.refresh();
    }
  }

  handleFrameClick(frameId) {
    const { videoExplorerStore } = this.props;
    videoExplorerStore.setFrame(frameId)

    const frameFraction = videoExplorerStore.selectedFrame.index / videoExplorerStore.frames.length;

    this.player.seekTo(frameFraction, 'fraction')
  }

  render() {
    const { configStore, gpuStore, videoExplorerStore } = this.props;

    let mainClassnames = "main-view content-wrapper"
    if (
      typeof configStore.gpuInfo !== "undefined" &&
        gpuStore.servers.length > 0
    ) {
      mainClassnames = "main-view content-wrapper with-right-sidebar"
    }

    const { selectedVideo, selectedFrame } = videoExplorerStore;

    return (
      <div className={mainClassnames}>
        <div className="container-fluid">
          <div className="content">

            <SourceFolderSelector/>

            <div className="row">

              <div className="col-9 justify-content-center">
                {
                  selectedVideo ?
                  <div className='video-main-display player-wrapper'>
                    <ReactPlayer
                      ref={this.ref}
                      className='react-player'
                      url={videoExplorerStore.videoSrc}
                      width='100%'
                      height='100%'
                      controls={true}
                    />
                  </div>
                  : null
                }

                <div className="row">
                {
                  selectedVideo ?
                            <div className="col-md-6">
                              <h4><i className="fas fa-film"></i> {selectedVideo.name}</h4>
                              <p>
                                <a
                                  href={`${selectedVideo.path}output.mp4`}
                                  className="badge badge-secondary"
                                >
                                  <i className="fas fa-download" /> output.mp4
                                </a>
                                <br/>
                                <a
                                  href={`${selectedVideo.path}output_bbox.mp4`}
                                  className="badge badge-secondary"
                                >
                                  <i className="fas fa-download" /> output_bbox.mp4
                                </a>
                              </p>
                            </div>
                  : null
                }
                {
                  selectedFrame ?
                            <div className="col-md-6">
                              <h4><i className="far fa-image"></i> Frame {selectedFrame.index}</h4>
                              <p>Model: {selectedFrame.model}</p>
                              <p>Stats:</p>
                              <SyntaxHighlighter
                                language={"json"}
                                style={docco}
                              >
                                {JSON.stringify(selectedFrame.stats, null, 2)}
                              </SyntaxHighlighter>
                            </div>
                  : null
                }
                </div>
              </div>

              <div className="col-3">

                <VideoChrono
                  onFrameClick={this.handleFrameClick}
                />

              </div>

            </div>

            <RightPanel />
          </div>
        </div>
      </div>
    );
  }
}
export default MainView;
