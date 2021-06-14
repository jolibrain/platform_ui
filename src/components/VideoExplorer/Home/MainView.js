/* eslint jsx-a11y/anchor-is-valid: "off" */
import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import ReactPlayer from 'react-player'

import JSZip from 'jszip'
import saveAs from 'save-as'

import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/cjs/styles/hljs";

import RightPanel from "../commons/RightPanel";

import SourceFolderSelector from "../../widgets/VideoExplorer/SourceFolderSelector"
import FrameFilter from "../../widgets/VideoExplorer/FrameFilter"
import Frame from "../../widgets/VideoExplorer/Frame"
import StatsKeyChart from "../../widgets/VideoExplorer/StatsKeyChart"

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
      filters: [],
      isFeedbackSubmitted: false,
      isGeneratingZip: false,
    };

    this.frameRef = React.createRef();
    this.feedbackRef = React.createRef();

    this.visibleFrames = this.visibleFrames.bind(this);

    this.handleVideoSelection = this.handleVideoSelection.bind(this)

    this.onPlayerReady = this.onPlayerReady.bind(this);
    this.onPlayerProgress = this.onPlayerProgress.bind(this);
    this.onPlayerPause = this.onPlayerPause.bind(this);

    this.handleFrameClick = this.handleFrameClick.bind(this);
    this.toggleBoundingBoxes = this.toggleBoundingBoxes.bind(this);
    this.toggleAutoScroll = this.toggleAutoScroll.bind(this);

    this.handleFilterChange = this.handleFilterChange.bind(this);

    this.handleFeedbackSubmit = this.handleFeedbackSubmit.bind(this)

    this.handleDownloadZipFrames = this.handleDownloadZipFrames.bind(this)

  }

  componentDidMount() {
    const { videoExplorerStore } = this.props;

    if (videoExplorerStore.loaded === false) {
      videoExplorerStore.refresh();
    }
  }

  handleFrameClick(frameId) {

    // remove autoscroll
    this.setState({autoScroll: false});

    const { videoExplorerStore } = this.props;
    videoExplorerStore.setFrame(frameId)

    const { selectedFrameCurrentTime } = videoExplorerStore;
    this.player.seekTo(selectedFrameCurrentTime, 'seconds')
  }

  toggleBoundingBoxes() {
    const { videoExplorerStore } = this.props;

    this.setState({currentTime: this.player.getCurrentTime()});

    videoExplorerStore.toggleBoundingBoxes();
  }

  toggleAutoScroll() {
    this.setState({autoScroll: !this.state.autoScroll});
  }

  handleVideoSelection(value) {
    const { videoExplorerStore } = this.props;
    videoExplorerStore.setVideoPath(value);

    // reset state when a video is selected
    this.setState({
      currentTime: null,
      autoScroll: false,
      filters: []
    });
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

  handleFilterChange(filterConfig, value) {

    let filters = this.state.filters;
    const filter = filters.find(f => f.id === filterConfig.id);

    if(filter) {
      filter.value = value
    } else {
      filters.push({
        id: filterConfig.id,
        statKey: filterConfig.statKey,
        filterBehavior: filterConfig.filterBehavior,
        value: value
      })
    }

    this.setState({
      filters: filters,
      autoscroll: false
    })
  }

  handleFeedbackSubmit(event) {
    const { videoExplorerStore } = this.props;

    event.preventDefault();

    videoExplorerStore.writeFeedback(this.feedbackRef.current.value)
    this.feedbackRef.current.value = "";

    this.setState({ isFeedbackSubmitted: true });
    setTimeout(() => {
      this.setState({ isFeedbackSubmitted: false });
    }, 2000);
  }

  async handleDownloadZipFrames() {
    this.setState({isGeneratingZip: true})
    var zip = new JSZip();

    const { selectedVideo, frames } = this.props.videoExplorerStore;

    const visibleFrames = this.visibleFrames();

    for (let index = 0; index < visibleFrames.length; index++) {
      const frame = visibleFrames[index]

      const imageFile = await fetch(frame.imageSrc.original);
      const imageBlob = await imageFile.blob();
      zip.file(`frame_${frame.index}.png`, imageBlob, {binary: true})

      const jsonFile = await fetch(frame.jsonFilePath);
      const jsonBlob = await jsonFile.blob();
      zip.file(`frame_${frame.index}.json`, jsonBlob, {binary: true})

    }

    const zipFilename = `${selectedVideo.name}-${visibleFrames.length}-${frames.length}.zip`
    zip.generateAsync({type: "blob"}).then(content => {
      saveAs(content, zipFilename);
    });
    this.setState({isGeneratingZip: false})
  }

  visibleFrames() {
    const { videoExplorerStore } = this.props;
    const { frames } = videoExplorerStore;

    return frames
          .filter(f => {
            return typeof f !== undefined &&
              this.state.filters.every(uiFilter => {
                let isIncluded = true;

                switch(uiFilter.filterBehavior) {
                  case "arrayLengthInsideRange":
                    isIncluded =
                      f.stats[uiFilter.statKey].length >= uiFilter.value[0] &&
                      f.stats[uiFilter.statKey].length <= uiFilter.value[1]
                    break;
                  case "valueInsideRange":
                    isIncluded =
                      parseFloat(f.stats[uiFilter.statKey]) >= uiFilter.value[0] &&
                      parseFloat(f.stats[uiFilter.statKey]) <= uiFilter.value[1]
                    break;
                  case "someMoreThanAbsolutePercent":
                    isIncluded = f.stats[uiFilter.statKey].some(val => {
                      return Math.abs(val * 100) > uiFilter.value
                    })
                    break;
                  default:
                    break;
                }

                return isIncluded;
              })
          })
  }

  render() {
    const { configStore, gpuStore, videoExplorerStore } = this.props;

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

    const {
      selectedVideo,
      selectedFrame,
      frames,
      settings
    } = videoExplorerStore;

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

    const visibleFrames = this.visibleFrames();

    const feedbackAvailable =
          typeof settings.feedbackPath !== 'undefined' &&
          settings.feedbackPath.length > 0;

    if(selectedVideo) {

      const frameFilters = chronoItemSelectors
            .filters
            .filter(filterConfig => {

              // When filterConfig contains requiredStatKeys
              // then only include this ui filter when video stats also
              // contains this information

              let isIncluded = true;

              if(typeof filterConfig.requiredStatKeys !== "undefined") {
                isIncluded = filterConfig.requiredStatKeys.every(statKey => {
                  return typeof selectedVideo.stats[statKey] !== "undefined"
                })
              }

              return isIncluded;

            })
            .map((filterConfig, index) => {
              return (<FrameFilter
                        key={`filter-${index}-${selectedVideo.id}`}
                        stats={selectedVideo.stats}
                        filterConfig={filterConfig}
                        handleFilterChange={this.handleFilterChange}
                      />)
            })

      return (
        <div className={mainClassNames.join(" ")}>
          <div className="container-fluid">
            <div className="content">

              <SourceFolderSelector
                handleVideoSelection={this.handleVideoSelection}
              />

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
                        checked={settings.boundingBoxes}/>
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

                      {
                        selectedVideo.stats &&
                          settings.statsChart &&
                          settings.statsChart.length > 0
                          ?
                          <div>
                          {
                            settings.statsChart
                                    .map((chartSettings, k) => {
                              return (<StatsKeyChart
                                key={`stats-${k}-${selectedVideo.id}`}
                                stats={selectedVideo.stats}
                                options={chartSettings}
                                      />)
                            })
                          }
                          </div>
                        : null
                      }
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
                          download={`${selectedVideo.name}_${selectedFrame.jsonFile}`}
                          className="badge badge-secondary"
                        >
                          <i className="fas fa-download" /> JSON
                        </a>
                        &nbsp;
                        <a
                          href={`${selectedVideo.path}${selectedFrame.jsonFile.replace('.json', '.png')}`}
                          download={`${selectedVideo.name}_${selectedFrame.jsonFile.replace('.json', '.png')}`}
                          className="badge badge-secondary"
                        >
                          <i className="fas fa-download" /> Image
                        </a>
                        &nbsp;
                        <a
                          href={`${selectedVideo.path}${settings.folders.bbox_images}${selectedFrame.jsonFile.replace('.json', '.png')}`}
                          download={`${selectedVideo.name}_${selectedFrame.jsonFile.replace('.json', '_bbox.png')}`}
                          className="badge badge-secondary"
                        >
                          <i className="fas fa-download" /> Image with bounding-boxes
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
                                  htmlFor="feedbackTextArea"
                                >
                                  Leave a feedback on frame {selectedFrame.index}:
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
                                { this.state.isFeedbackSubmitted ?
                                  <span>&nbsp;Feedback has been submitted</span>
                                  :
                                  null
                                }
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
                    <form style={{width: "95%"}}>
                      {frameFilters}
                    </form>
                  </div>

                  <div className="row">
                    <div className="col">
                      Frames {visibleFrames.length} / {frames.length}
                      <a
                        onClick={this.handleDownloadZipFrames}
                        className="badge badge-secondary"
                      >
                        <i className={this.state.isGeneratingZip ?
                                     "fas fa-spinner fa-spin"
                                      :
                                     "fas fa-download"
                                     }/> Download zip file
                      </a> &nbsp;
                    </div>
                    <div
                      id="autoScrollToggle"
                      className="col"
                    >
                      <form className="form-inline">
                        <div className="form-check">
                          <legend
                            className="form-check-label"
                            htmlFor="autoScrollCheckbox"
                            style={{fontSize: "unset"}}
                          >
                            Autoscroll frames &nbsp;
                          </legend>
                          <input
                            id="autoScrollCheckbox"
                            type="checkbox"
                            className="form-check-input"
                            onChange={this.toggleAutoScroll}
                            checked={this.state.autoScroll}
                          />
                        </div>
                      </form>
                    </div>
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
                      visibleFrames.map(f =>
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
              <SourceFolderSelector
                handleVideoSelection={this.handleVideoSelection}
              />
              <RightPanel />
            </div>
          </div>
        </div>
      )
    }
  }
}
export default MainView;
