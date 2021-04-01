import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import ReactPlayer from 'react-player'

import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/cjs/styles/hljs";

import RightPanel from "../commons/RightPanel";

import SourceFolderSelector from "../../widgets/VideoExplorer/SourceFolderSelector"
import Frame from "../../widgets/VideoExplorer/Frame"

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
      currentTime: null,
      autoScroll: false
    };

    this.frameRef = React.createRef();

    this.onPlayerReady = this.onPlayerReady.bind(this);
    this.onPlayerProgress = this.onPlayerProgress.bind(this);
    this.onPlayerPause = this.onPlayerPause.bind(this);

    this.handleFrameClick = this.handleFrameClick.bind(this);
    this.toggleBoundingBoxes = this.toggleBoundingBoxes.bind(this);
    this.toggleAutoScroll = this.toggleAutoScroll.bind(this);

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

    const frameIndex = videoExplorerStore.selectedFrame.index > 0 ?
          videoExplorerStore.selectedFrame.index - 1
          :
          videoExplorerStore.selectedFrame.index

    const frameFraction = frameIndex / videoExplorerStore.frames.length;

    this.player.seekTo(frameFraction, 'fraction')
  }

  toggleBoundingBoxes() {
    const { videoExplorerStore } = this.props;

    this.setState({currentTime: this.player.getCurrentTime()});

    videoExplorerStore.toggleBoundingBoxes();
  }

  toggleAutoScroll() {
    this.setState({autoScroll: !this.state.autoScroll});
  }

  onPlayerReady() {
    if(this.state.currentTime) {
      this.player.seekTo(this.state.currentTime, 'seconds');
    }

    this.setState({currentTime: null})
  }

  onPlayerProgress(progress) {
    if(this.state.autoScroll) {
      const { videoExplorerStore } = this.props;

      const currentTime = this.player.getCurrentTime();
      const duration = this.player.getDuration();

      const frameIndex = parseInt(
        currentTime * videoExplorerStore.frames.length / duration
      );
      videoExplorerStore.setFrameIndex(frameIndex + 1)

      this.frameRef.current.parentNode.scrollTop =
        this.frameRef.current.offsetTop;

      this.setState({currentTime: currentTime});
    }
  }

  onPlayerPause() {
    const { videoExplorerStore } = this.props;

    const currentTime = this.player.getCurrentTime();
    const duration = this.player.getDuration();

    const frameIndex = parseInt(
      currentTime * videoExplorerStore.frames.length / duration
    );
    videoExplorerStore.setFrameIndex(frameIndex + 1)

    this.frameRef.current.parentNode.scrollTop =
      this.frameRef.current.offsetTop;

    this.setState({currentTime: currentTime});
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

    const { selectedVideo, selectedFrame, frames, settings } = videoExplorerStore;
    const { chronoItemSelectors } = settings;

    const isLoadingFrames = selectedVideo && frames.length === 0;

    if(selectedVideo) {

      return (
        <div className={mainClassnames}>
          <div className="container-fluid">
            <div className="content">

              <SourceFolderSelector/>

              <div className="row">

                <div className="col-9 justify-content-center">

                  <div className='video-main-display player-wrapper'>
                    <ReactPlayer
                      ref={this.ref}
                      className='react-player'
                      url={videoExplorerStore.videoSrc}
                      width='100%'
                      height='100%'
                      controls={true}
                      onReady={this.onPlayerReady}
                      onProgress={this.onPlayerProgress}
                      onPause={this.onPlayerPause}
                    />
                  </div>

                  <div className="row d-flex justify-content-end">
                    <div className="toggleBoundingBoxes">
                      <input
                        type="checkbox"
                        onChange={this.toggleBoundingBoxes}
                        checked={videoExplorerStore.settings.boundingBoxes}/>
                      &nbsp; Bounding Boxes
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <h4><i className="fas fa-film"></i> {selectedVideo.name}</h4>
                      <p>
                        <a
                          href={`${selectedVideo.path}output.mp4`}
                          className="badge badge-secondary"
                        >
                          <i className="fas fa-download" /> output.mp4
                        </a> &nbsp;
                        <a
                          href={`${selectedVideo.path}output_bbox.mp4`}
                          className="badge badge-secondary"
                        >
                          <i className="fas fa-download" /> output_bbox.mp4
                        </a>
                      </p>
                    </div>

                  {
                    selectedFrame ?
                    <div className="col-md-6" key={selectedFrame.id}>
                      <h4>
                        <i className="far fa-image"></i> Frame {selectedFrame.index}
                      </h4>
                      <p>
                        <a
                          href={`${selectedVideo.path}${selectedFrame.jsonFile}`}
                          className="badge badge-secondary"
                        >
                          <i className="fas fa-download" /> {selectedFrame.jsonFile}
                        </a>
                        &nbsp;
                        <a
                          href={`${selectedVideo.path}${selectedFrame.jsonFile.replace('.json', '.png')}`}
                          className="badge badge-secondary"
                        >
                          <i className="fas fa-download" /> frame{String(selectedFrame.index).padStart(8, '0')}.png
                        </a>
                      </p>
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

                  <div className="toggleAutoScroll d-flex justify-content-end">
                    Auto-scroll frames &nbsp;
                    <input
                      type="checkbox"
                      onChange={this.toggleAutoScroll}
                      checked={this.state.autoScroll}/>
                  </div>

                  <div className='video-chrono'>
                    {
                      isLoadingFrames ?
                        <span>
                          <i className="fas fa-spinner fa-spin" />
                          &nbsp; loading frames...
                        </span>
                        : null
                    }
                    {
                      frames
                        .filter(f => f)
                        .map(f =>
                              <div
                                key={f.id}
                                className="scrollFrame"
                                ref={f.isSelected ? this.frameRef : null}
                              >
                                <Frame
                                  frame={f}
                                  selectors={chronoItemSelectors}
                                  onFrameClick={this.handleFrameClick}
                                />
                              </div>
                            )
                    }
                  </div>
                </div>

              </div>

              <RightPanel />
            </div>
          </div>
        </div>
      );

    } else {

      return (
        <div className={mainClassnames}>
          <div className="container-fluid">
            <div className="content">

              <SourceFolderSelector/>

              <RightPanel />
            </div>
          </div>
        </div>
      )
    }
  }
}
export default MainView;
