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
import Frame from "../../widgets/VideoExplorer/Frame"
import StatsKeyChart from "../../widgets/VideoExplorer/StatsKeyChart"

import Slider, { SliderTooltip } from 'rc-slider';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
const { Handle } = Slider;

const intHandle = props => {
  const { value, dragging, index, ...restProps } = props;
  return (
    <SliderTooltip
      prefixCls="rc-slider-tooltip"
      overlay={value}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </SliderTooltip>
  );
};

const floatHandle = props => {
  const { value, dragging, index, ...restProps } = props;
  return (
    <SliderTooltip
      prefixCls="rc-slider-tooltip"
      overlay={value.toFixed(2)}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Handle value={value.toFixed(2)} {...restProps} />
    </SliderTooltip>
  );
};

const percentHandle = props => {
  const { value, dragging, index, ...restProps } = props;
  return (
    <SliderTooltip
      prefixCls="rc-slider-tooltip"
      overlay={`${value} %`}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </SliderTooltip>
  );
};

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
      isVideoPkAvailable: false,
      pkMinFilterLimit: 0,
      pkMaxFilterLimit: 100,
      isFeedbackSubmitted: false,
      isGeneratingZip: false,
    };

    this.frameRef = React.createRef();
    this.feedbackRef = React.createRef();

    this.handleVideoSelection = this.handleVideoSelection.bind(this)

    this.onPlayerReady = this.onPlayerReady.bind(this);
    this.onPlayerProgress = this.onPlayerProgress.bind(this);
    this.onPlayerPause = this.onPlayerPause.bind(this);

    this.handleFrameClick = this.handleFrameClick.bind(this);
    this.toggleBoundingBoxes = this.toggleBoundingBoxes.bind(this);
    this.toggleAutoScroll = this.toggleAutoScroll.bind(this);

    this.handleCableDistanceChange = this.handleCableDistanceChange.bind(this);
    this.handleCableNumberChange = this.handleCableNumberChange.bind(this);
    this.handlePkFilterChange = this.handlePkFilterChange.bind(this);

    this.handleFeedbackSubmit = this.handleFeedbackSubmit.bind(this)

    this.handleDownloadZipFrames = this.handleDownloadZipFrames.bind(this)

  }

  componentDidMount() {
    const { videoExplorerStore } = this.props;

    if (videoExplorerStore.loaded === false) {
      videoExplorerStore.refresh();
    }
  }

  handleFrameClick(fname) {

    // remove autoscroll
    this.setState({autoScroll: false});

    const { videoExplorerStore } = this.props;
    videoExplorerStore.setFrame(fname)

    const { selectedFrame, frames } = videoExplorerStore;
    const frameFraction = parseInt(selectedFrame.fname.split("/").pop().replace(".jpg", ""))
          / frames.length;

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

  handleVideoSelection(value) {
    const { videoExplorerStore } = this.props;
    videoExplorerStore.setVideoPath(value);

    const { selectedVideo } = videoExplorerStore;

    const isVideoPkAvailable =
          typeof selectedVideo.stats.min_PK !== "undefined" &&
          typeof selectedVideo.stats.max_PK !== "undefined"

    // reset state when a video is selected
    this.setState({
      currentTime: null,
      cableDistanceFilter: 0,
      cableMinNumberFilter: 0,
      cableMaxNumberFilter: 4,
      isVideoPkAvailable: isVideoPkAvailable,
      pkMinFilter: selectedVideo.stats.min_PK,
      pkMaxFilter: selectedVideo.stats.max_PK,
      pkMinFilterLimit: selectedVideo.stats.min_PK,
      pkMaxFilterLimit: selectedVideo.stats.max_PK,
      autoScroll: false,
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

  handleCableDistanceChange(value) {
    this.setState({
      cableDistanceFilter: value,
      autoScroll: false,
    })

    if(value > 0)
      this.setState({cableMinNumberFilter: 1})
  }

  handleCableNumberChange(values) {
    this.setState({
      cableMinNumberFilter: values[0],
      cableMaxNumberFilter: values[1],
      autoScroll: false,
    })
  }

  handlePkFilterChange(values) {
    this.setState({
      pkMinFilter: values[0],
      pkMaxFilter: values[1],
      autoScroll: false,
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
    const {
      isVideoPkAvailable,
      pkMinFilter,
      pkMaxFilter,
      pkMinFilterLimit,
      pkMaxFilterLimit,
      cableMinNumberFilter,
      cableMaxNumberFilter,
      cableDistanceFilter
    } = this.state;

    const { selectedVideo, frames } = this.props.videoExplorerStore;

    const isPkFilterActive =
          isVideoPkAvailable &&
          (pkMinFilter !== pkMinFilterLimit ||
           pkMaxFilter !== pkMaxFilterLimit)

    const visibleFrames = frames
      .filter(f => {

        let visible = typeof f !== undefined;

        visible = visible &&
          f.cables &&
          f.cables.length >= cableMinNumberFilter &&
          f.cables.length <= cableMaxNumberFilter

        if(isPkFilterActive) {
          visible = visible &&
            f.PK &&
            f.PK >= pkMinFilter &&
            f.PK <= pkMaxFilter;
        }

        if(
          cableDistanceFilter > 0 &&
            f.cables &&
            f.cables.length > 0
        ) {
          visible = visible &&
            f.cables.some(c => {

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

    for (let index = 0; index < visibleFrames.length; index++) {
      const frame = visibleFrames[index]

      const imageFile = await fetch(frame.imageSrc.original);
      const imageBlob = await imageFile.blob();
      zip.file(`frame_${frame.index}.png`, imageBlob, {binary: true})

      const jsonFile = await fetch(frame.jsonFile);
      const jsonBlob = await jsonFile.blob();
      zip.file(`frame_${frame.index}.json`, jsonBlob, {binary: true})

    }

    const zipFilename = `${selectedVideo.name}-${visibleFrames.length}-${frames.length}.zip`
    zip.generateAsync({type: "blob"}).then(content => {
      saveAs(content, zipFilename);
    });
    this.setState({isGeneratingZip: false})
  }

  render() {
    const { configStore, gpuStore, videoExplorerStore } = this.props;
    const {
      cableMinNumberFilter,
      cableMaxNumberFilter,
      isVideoPkAvailable,
      pkMinFilterLimit,
      pkMaxFilterLimit,
      pkMinFilter,
      pkMaxFilter,
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
      frameTitle = `Frame ${parseInt(selectedFrame.fname.split("/").pop().replace(".jpg", ""))}`

      if(
        settings.selectedFrameTitleAttributes &&
          settings.selectedFrameTitleAttributes.length > 0
      ) {

        settings.selectedFrameTitleAttributes.forEach(attr => {

          if(selectedFrame[attr]) {
            frameTitle += ` - ${attr}: ${parseFloat(selectedFrame[attr]).toFixed(3)}`;
          }

        })

      }
    }

    const isPkFilterActive =
          isVideoPkAvailable &&
          (pkMinFilter !== pkMinFilterLimit ||
           pkMaxFilter !== pkMaxFilterLimit)

    const visibleFrames = frames
          .filter(f => {

            let visible = typeof f !== undefined;

            visible = visible &&
              f.cables &&
              f.cables.length >= cableMinNumberFilter &&
              f.cables.length <= cableMaxNumberFilter

            if (isPkFilterActive) {
              visible = visible &&
                f.PK &&
                f.PK >= pkMinFilter &&
                f.PK <= pkMaxFilter
            }

            if(
              cableDistanceFilter > 0 &&
                f.cables &&
                f.cables.length > 0
            ) {
              visible = visible &&
                f.cables.some(c => {

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

    const feedbackAvailable =
          typeof settings.feedbackPath !== 'undefined' &&
          settings.feedbackPath.length > 0;

    if(selectedVideo) {

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
                        checked={videoExplorerStore.settings.boundingBoxes}/>
                      &nbsp; Bounding Boxes
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <h4><i className="fas fa-film"></i> {selectedVideo.filename}</h4>
                      <p>
                        <a
                          href={`/data/videos/${selectedVideo.uuid}/input/${selectedVideo.filename}`}
                          download={`${selectedVideo.filename}`}
                          className="badge badge-secondary"
                        >
                          <i className="fas fa-download" /> Original video
                        </a> &nbsp;
                        <a
                          href={`/data/videos/${selectedVideo.uuid}/output.mp4`}
                          download={`${selectedVideo.filename.replace(".avi", "_bbox.avi")}`}
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
                                key={k}
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
                      <div className="col-md-6" key={parseInt(selectedFrame.fname.split("/").pop().replace(".jpg", ""))}>
                      <h4>
                        <i className="far fa-image"></i> {frameTitle}
                      </h4>
                      <p>
                        <a
                          href={`${selectedFrame.fname}`}
                          className="badge badge-secondary"
                        >
                          <i className="fas fa-download" /> Image
                        </a>
                        &nbsp;
                        <a
                          href={`${selectedFrame.fname.replace("/output/", "/input/")}`}
                          className="badge badge-secondary"
                        >
                          <i className="fas fa-download" /> Image with bounding-boxes
                        </a>
                      </p>
                      <SyntaxHighlighter
                        language={"json"}
                        style={docco}
                      >
                        {JSON.stringify(selectedFrame, null, 2)}
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
                    <form>
                      { isVideoPkAvailable ?
                      <div className="form-group row">
                        <legend className="col-form-label">PK</legend>
                        <br/>
                        <Range
                          handle={floatHandle}
                          min={this.state.pkMinFilterLimit}
                          max={this.state.pkMaxFilterLimit}
                          step={0.01}
                          defaultValue={[
                            pkMinFilter,
                            pkMaxFilter
                          ]}
                          onAfterChange={this.handlePkFilterChange}
                        />
                      </div>
                        : null }
                      <div className="form-group row">
                        <legend className="col-form-label">Number of Cables</legend>
                        <br/>
                        <Range
                          handle={intHandle}
                          min={0}
                          max={4}
                          defaultValue={[
                            this.state.cableMinNumberFilter,
                            this.state.cableMaxNumberFilter
                          ]}
                          onAfterChange={this.handleCableNumberChange}
                        />
                      </div>
                      <div className="form-group row">
                        <legend className="col-form-label">Exclude cable distance from center</legend>
                        <br/>
                        <Slider
                          id="cableDistanceFilter"
                          handle={percentHandle}
                          onAfterChange={this.handleCableDistanceChange}
                        />
                      </div>
                    </form>
                  </div>

                  <div className="row">
                    <div className="col">
                      Frames {visibleFrames.length} / {frames.length}
                      <br/>
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
