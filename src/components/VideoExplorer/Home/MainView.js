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
      autoScroll: false,
      cableDistanceFilter: 0,
      cableMinNumberFilter: 0,
      cableMaxNumberFilter: 4,
    };

    this.frameRef = React.createRef();
    this.feedbackRef = React.createRef();

    this.onPlayerReady = this.onPlayerReady.bind(this);
    this.onPlayerProgress = this.onPlayerProgress.bind(this);
    this.onPlayerPause = this.onPlayerPause.bind(this);

    this.handleFrameClick = this.handleFrameClick.bind(this);
    this.toggleBoundingBoxes = this.toggleBoundingBoxes.bind(this);
    this.toggleAutoScroll = this.toggleAutoScroll.bind(this);

    this.handleCableDistanceChange = this.handleCableDistanceChange.bind(this);
    this.handleCableMinNumberChange = this.handleCableMinNumberChange.bind(this);
    this.handleCableMaxNumberChange = this.handleCableMaxNumberChange.bind(this);

    this.handleFeedbackSubmit = this.handleFeedbackSubmit.bind(this)

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

      const frameIndex = Math.round(
        currentTime * videoExplorerStore.frames.length / duration
      );
      videoExplorerStore.setFrameIndex(frameIndex)

      if (
        this.frameRef &&
          this.frameRef.current
      ) {
        this.frameRef.current.parentNode.scrollTop =
          this.frameRef.current.offsetTop;
      }

      this.setState({currentTime: currentTime});
    }
  }

  onPlayerPause() {
    const { videoExplorerStore } = this.props;

    const currentTime = this.player.getCurrentTime();
    const duration = this.player.getDuration();

    const frameIndex = Math.round(
      currentTime * videoExplorerStore.frames.length / duration
    );

    videoExplorerStore.setFrameIndex(frameIndex)

    if(
      this.frameRef &&
        this.frameRef.current
    ) {
      this.frameRef.current.parentNode.scrollTop =
        this.frameRef.current.offsetTop;
    }

    this.setState({currentTime: currentTime});
  }

  handleCableDistanceChange(event) {
    this.setState({cableDistanceFilter: event.target.value})
  }

  handleCableMinNumberChange(event) {
    this.setState({cableMinNumberFilter: event.target.value})
  }

  handleCableMaxNumberChange(event) {
    this.setState({cableMaxNumberFilter: event.target.value})
  }

  handleFeedbackSubmit(event) {
    const { videoExplorerStore } = this.props;

    event.preventDefault();

    videoExplorerStore.writeFeedback(this.feedbackRef.current.value)
    this.feedbackRef.current.value = "";
  }

  render() {
    const { configStore, gpuStore, videoExplorerStore } = this.props;
    const {
      cableMinNumberFilter,
      cableMaxNumberFilter,
      cableDistanceFilter
    } = this.state;

    let mainClassNames = [
      "main-view",
      "content-wrapper"
    ];

    if (configStore.isComponentBlacklisted("Header")) {
      mainClassNames.push("header-blacklisted")
    }

    if (
      typeof configStore.gpuInfo !== "undefined" &&
        gpuStore.servers.length > 0
    ) {
      mainClassNames.push("with-right-sidebar");
    }

    const { selectedVideo, selectedFrame, frames, settings } = videoExplorerStore;
    const { chronoItemSelectors } = settings;

    const isLoadingFrames = selectedVideo && frames.length === 0;

    let frameTitle = ""

    if(selectedFrame) {
      frameTitle = `Frame ${selectedFrame.index}`

      if(
        settings.selectedFrameTitleAttributes &&
          settings.selectedFrameTitleAttributes.length > 0 &&
          selectedFrame.stats
      ) {

        settings.selectedFrameTitleAttributes.forEach(attr => {

          if(selectedFrame.stats[attr]) {
            frameTitle += ` - ${attr}: ${selectedFrame.stats[attr]}`;
          }

        })

      }
    }

    const feedbackAvailable =
          typeof settings.feedbackPath !== 'undefined' &&
          settings.feedbackPath.length > 0;

    if(selectedVideo) {

      return (
        <div className={mainClassNames.join(" ")}>
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
                          download={`${selectedVideo.name}.mp4`}
                          className="badge badge-secondary"
                        >
                          <i className="fas fa-download" /> Original video
                        </a> &nbsp;
                        <a
                          href={`${selectedVideo.path}output_bbox.mp4`}
                          download={`${selectedVideo.name}_bbox.mp4`}
                          className="badge badge-secondary"
                        >
                          <i className="fas fa-download" /> Video with bounding boxes
                        </a>
                      </p>
                    </div>

                  {
                    selectedFrame ?
                    <div className="col-md-6" key={selectedFrame.id}>
                      <h4>
                        <i className="far fa-image"></i> {frameTitle}
                      </h4>
                      <p>
                        <a
                          href={`${selectedVideo.path}${selectedFrame.jsonFile}`}
                          download={`${selectedVideo.name}_{selectedFrame.jsonFile}`}
                          className="badge badge-secondary"
                        >
                          <i className="fas fa-download" /> JSON
                        </a>
                        &nbsp;
                        <a
                          href={`${selectedVideo.path}${selectedFrame.jsonFile.replace('.json', '.png')}`}
                          download={`${selectedVideo.name}_{selectedFrame.jsonFile.replace('.json', '.png')}`}
                          className="badge badge-secondary"
                        >
                          <i className="fas fa-download" /> Image
                        </a>
                      </p>
                      <SyntaxHighlighter
                        language={"json"}
                        style={docco}
                      >
                        {JSON.stringify(selectedFrame.stats, null, 2)}
                      </SyntaxHighlighter>

                      {
                      feedbackAvailable ?
                          <div>
                            <h4>
                              <i className="fas fa-pencil-alt"></i> Feedback
                            </h4>

                            <form
                              onSubmit={this.handleFeedbackSubmit}
                            >
                              <div className="form-group">
                                <label
                                  for="feedbackTextArea"
                                >
                                  Leave a feedback about this frame:
                                </label>
                                <textarea
                                  className="form-control"
                                  id="feedbackTextArea"
                                  rows="3"
                                  ref={this.feedbackRef}
                                />
                                <button
                                  type="submit"
                                  className="btn btn-primary"
                                >
                                  Send feedback
                                </button>
                              </div>
                            </form>
                          </div>
                          :
                        null
                      }

                    </div>
                    : null
                  }

                  </div>
                </div>

                <div className="col-3">
                  <div className="d-flex">
                    <form>
                      <div className="form-group row">
                        <legend className="col-form-label col-4">Number of Cables</legend>
                        <div className="col-4">
                          <input
                            id="cableMinNumberFilter"
                            type="number"
                            className="form-control"
                            onChange={this.handleCableMinNumberChange}
                            value={this.state.cableMinNumberFilter}
                          />
                          <label
                            for="cableMinNumberFilter"
                            className="col-form-label"
                          >
                            Min
                          </label>
                        </div>
                        <div className="col-4">
                          <input
                            id="cableMaxNumberFilter"
                            className="form-control"
                            type="number"
                            onChange={this.handleCableMaxNumberChange}
                            value={this.state.cableMaxNumberFilter}
                          />
                          <label
                            for="cableMaxNumberFilter"
                            className="col-form-label"
                          >
                            Max
                          </label>
                        </div>
                      </div>
                      <div className="form-group row">
                        <legend className="col-form-label col-4">Exclude cable distance from center</legend>
                        <div class="col-8">
                          <input
                            id="cableDistanceFilter"
                            type="number"
                            className="form-control"
                            onChange={this.handleCableDistanceChange}
                            value={this.state.cableDistanceFilter}
                          />
                        </div>
                      </div>
                    </form>
                  </div>

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
                        .filter(f => {

                          let visible = typeof f !== undefined;

                          visible = visible &&
                            f.stats &&
                            f.stats['cables'] &&
                            f.stats['cables'].length >= cableMinNumberFilter &&
                            f.stats['cables'].length <= cableMaxNumberFilter

                          if(
                             cableDistanceFilter > 0 &&
                             f.stats &&
                             f.stats['cables'] &&
                             f.stats['cables'].length > 0
                            ) {
                            visible = visible &&
                              f.stats['cables'].some(c => {

                                // If cable value is inferior to 0
                                //    - cable on the left position from center
                                //    - value is visible if inferior to negative cableDistanceFilter

                                // If cable value is superior to 0
                                //    - cable on the right position from center
                                //    - value is visible if superior to cableDistanceFilter

                                const value = parseInt(c * 100);

                                return value < 0 ?
                                  value <= 0 - cableDistanceFilter
                                :
                                  value >= cableDistanceFilter
                              })
                          }

                          return visible;
                        })
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
        <div className={mainClassNames.join(" ")}>
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
