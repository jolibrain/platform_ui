import React from "react";
import { toJS } from "mobx";
import { observer } from "mobx-react";

import BoundingBox from "./BoundingBox";
import Controls from "./BoundingBox/Controls";
import Threshold from "./Threshold";

import InputForm from "../commons/InputForm";
import ParamSlider from "../commons/ParamSlider";
import ParamText from "../commons/ParamText";
import Description from "../commons/Description";
import CardCommands from "../commons/CardCommands";
import ToggleControl from "../commons/ToggleControl";

import stores from "../../../../../stores/rootStore";

const MjpegConnector = observer(class MjpegConnector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedBoxIndex: -1,
      sliderBest: 1,
      sliderSearchNn: 10,
      boxFormat: "simple",
      showLabels: false,
      segmentationMask: true,
      segmentationConfidence: false,
      segmentationSeparate: false,
      unsupervisedSearch: false
    };

    this.onOver = this.onOver.bind(this);
    this.onLeave = this.onLeave.bind(this);

    this.confidenceTooltipFormatter = this.confidenceTooltipFormatter.bind(
      this
    );
    this.handleConfidenceThreshold = this.handleConfidenceThreshold.bind(this);
    this.handleBestThreshold = this.handleBestThreshold.bind(this);
    this.handleSearchNnThreshold = this.handleSearchNnThreshold.bind(this);
    this.handleMultisearchRois = this.handleMultisearchRois.bind(this);
    this.handleSegmentationMaskToggle = this.handleSegmentationMaskToggle.bind(
      this
    );
    this.handleSegmentationConfidenceToggle = this.handleSegmentationConfidenceToggle.bind(
      this
    );
    this.handleSegmentationSeparateToggle = this.handleSegmentationSeparateToggle.bind(
      this
    );
    this.handleUnsupervisedSearchToggle = this.handleUnsupervisedSearchToggle.bind(
      this
    );
    this.handleSearchNnThreshold = this.handleSearchNnThreshold.bind(this);
    this.handleExtractLayerChange = this.handleExtractLayerChange.bind(this);

    this.setBoxFormat = this.setBoxFormat.bind(this);
    this.toggleLabels = this.toggleLabels.bind(this);
  }

  setBoxFormat(format) {
    this.setState({ boxFormat: format });
  }

  toggleLabels() {
    this.setState({ showLabels: !this.state.showLabels });
  }

  onOver(index) {
    this.setState({ selectedBoxIndex: index });
  }

  onLeave() {
    this.setState({ selectedBoxIndex: -1 });
  }

  confidenceTooltipFormatter(value) {
    return (value / 100).toFixed(2);
  }

  handleConfidenceThreshold(value) {
    const { imaginateStore } = stores;
    const { serviceSettings } = imaginateStore;
    serviceSettings.threshold.confidence = parseFloat((value / 100).toFixed(2));
    if (serviceSettings.threshold.confidence === 0) {
      serviceSettings.threshold.confidence = 0.01;
    }
    imaginateStore.predict();
  }

  handleBestThreshold(value) {
    const { imaginateStore } = stores;
    const { serviceSettings } = imaginateStore;
    serviceSettings.request.best = parseInt(value, 10);
    this.setState({ sliderBest: value });
    imaginateStore.predict();
  }

  handleSearchNnThreshold(value) {
    const { imaginateStore } = stores;
    const { service } = imaginateStore;
    service.uiParams.search_nn = parseInt(value, 10);
    this.setState({ sliderSearchNn: value });
    imaginateStore.predict();
  }

  handleMultisearchRois(value) {
    const { imaginateStore } = stores;
    const { serviceSettings } = imaginateStore;

    this.setState({
      multibox_rois: !this.state.multibox_rois,
      boxFormat: "simple",
      showLabels: false
    });

    serviceSettings.request.multibox_rois = !this.state.multibox_rois;
    imaginateStore.predict();
  }

  handleSegmentationMaskToggle(e) {
    const { imaginateStore } = stores;
    const { serviceSettings } = imaginateStore;

    this.setState({
      segmentationMask: e.target.checked
    });

    serviceSettings.request.segmentationMask = e.target.checked;
    imaginateStore.predict();
  }

  handleSegmentationConfidenceToggle(e) {
    const { imaginateStore } = stores;
    const { serviceSettings } = imaginateStore;

    this.setState({
      segmentationConfidence: e.target.checked
    });

    serviceSettings.request.segmentationConfidence = e.target.checked;
    imaginateStore.predict();
  }

  handleSegmentationSeparateToggle(e) {
    this.setState({
      segmentationSeparate: e.target.checked
    });
  }

  handleUnsupervisedSearchToggle(e) {
    const { imaginateStore } = stores;
    const { service } = imaginateStore;

    // Switch on search
    if (!service.uiParams.unsupervisedSearch && e.target.checked) {
      service.uiParams.search_nn = 10;
    }

    // Switch off search
    if (service.uiParams.unsupervisedSearch && !e.target.checked) {
      delete service.uiParams.search_nn;
    }

    service.uiParams.unsupervisedSearch = e.target.checked;
    this.setState({
      unsupervisedSearch: e.target.checked
    });
    imaginateStore.predict();
  }

  handleExtractLayerChange(layer) {
    const { imaginateStore } = stores;
    const { service } = imaginateStore;
    service.uiParams.extract_layer = layer;
    imaginateStore.predict();
  }

  render() {
    const { imaginateStore } = stores;
    const { service, serviceSettings } = imaginateStore;

    if (!service) return null;

    const input = service.selectedInput;

    let uiControls = [];

    if (service.settings.mltype === "instance_segmentation") {
      uiControls.push(
        <ToggleControl
          key="settingCheckbox-display-mask"
          title="Segmentation Mask"
          value={this.state.segmentationMask}
          onChange={this.handleSegmentationMaskToggle}
        />
      );
    }

    if (service.settings.mltype === "segmentation") {
      uiControls.push(
        <ToggleControl
          key="settingCheckbox-display-segmentation-separate"
          title="Separate Segmentation layer"
          value={this.state.segmentationSeparate}
          onChange={this.handleSegmentationSeparateToggle}
        />
      );
      uiControls.push(
        <ToggleControl
          key="settingCheckbox-display-segmentation-confidence"
          title="Segmentation Confidence"
          value={this.state.segmentationConfidence}
          onChange={this.handleSegmentationConfidenceToggle}
        />
      );
    }

    if (
      input &&
      !input.isCtcOuput &&
      !input.isSegmentationInput &&
      service.settings.mltype !== "segmentation"
    ) {
      uiControls.push(<Threshold key="threshold" />);

      // Note: the threshold confidence variable in the key attribute
      // is a hack to update the slider when user pushes
      // on other external threshold (salient/medium/detailed for example)
      uiControls.push(
        <ParamSlider
          key={`paramSliderConfidence-${serviceSettings.threshold.confidence}`}
          title="Confidence threshold"
          defaultValue={parseInt(
            serviceSettings.threshold.confidence * 100,
            10
          )}
          onAfterChange={this.handleConfidenceThreshold}
          tipFormatter={this.confidenceTooltipFormatter}
        />
      );

      if (service.settings.mltype === "classification") {
        // && service.respInfo.body.parameters.mllib[0].nclasses.length > 0

        if (
          typeof service.type !== "undefined" &&
          service.type === "unsupervised"
        ) {
          uiControls.push(
            <ToggleControl
              key="settingCheckbox-display-unsupervised-search"
              title="Search"
              value={this.state.unsupervisedSearch}
              onChange={this.handleUnsupervisedSearchToggle}
            />
          );
        }
        if (this.state.unsupervisedSearch) {
          uiControls.push(
            <ParamSlider
              key="paramSliderSearchNn"
              title="Search Size"
              defaultValue={this.state.sliderSearchNn}
              onAfterChange={this.handleSearchNnThreshold}
              min={0}
              max={100}
            />
          );
        } else {
          // Only allows Best Threshold parameter when using
          // unsupervised search parameter
          uiControls.push(
            <ParamSlider
              key="paramSliderBest"
              title="Best threshold"
              defaultValue={this.state.sliderBest}
              onAfterChange={this.handleBestThreshold}
              min={1}
              max={20}
            />
          );
        }

        uiControls.push(
          <ParamText
            key="paramsUnsupervisedLayer"
            title="Extract Layer"
            submitText="Set Extract Layer"
            onSubmit={this.handleExtractLayerChange}
          />
        );
      }
    }

    if (
      service.respInfo &&
      service.respInfo.body &&
      service.respInfo.body.mltype === "rois"
    ) {
      uiControls.push(
        <ToggleControl
          key="paramMultisearchRois"
          title="Multisearch ROIs"
          value={this.state.multibox_rois}
          onChange={this.handleMultisearchRois}
        />
      );

      uiControls.push(
        <ParamSlider
          key="paramSliderSearchNn"
          title="Search Size"
          defaultValue={this.state.sliderSearchNn}
          onAfterChange={this.handleSearchNnThreshold}
          min={0}
          max={100}
        />
      );
    }

    // Hide controls when displaying categories as description
    // For example, in OCR models
    let boundingBoxControls = true;
    if (
      service.settings.mltype === "ctc" ||
      (service.respInfo &&
        service.respInfo.body &&
        service.respInfo.body.mltype === "classification") ||
      (input &&
        input.json &&
        input.json.body &&
        input.json.body.predictions &&
        input.json.body.predictions[0] &&
        (typeof input.json.body.predictions[0].rois !== "undefined" ||
          typeof input.json.body.predictions[0].nns !== "undefined")) ||
      (input &&
        input.postData &&
        input.postData.parameters &&
        input.postData.parameters.input &&
        input.postData.parameters.input.segmentation)
    ) {
      boundingBoxControls = false;
    }

    // Hide segmentation values on unsupervised classification services
    let showSegmentation = true;
    if (
      typeof service.type !== "undefined" &&
      service.type === "unsupervised"
    ) {
      showSegmentation = false;
    }

    return (
      <div className="imaginate">
        <div className="row">
          <div className="col-md-7">
            <div className="row">
              {boundingBoxControls ? (
                <Controls
                  handleClickBox={this.setBoxFormat.bind(this, "simple")}
                  handleClickPalette={this.setBoxFormat.bind(this, "color")}
                  handleClickLabels={this.toggleLabels}
                  boxFormat={this.state.boxFormat}
                  showLabels={this.state.showLabels}
                />
              ) : (
                ""
              )}
            </div>
            <div className="row">
              <BoundingBox
                selectedBoxIndex={this.state.selectedBoxIndex}
                onOver={this.onOver}
                input={toJS(service.selectedInput)}
                displaySettings={toJS(serviceSettings.display)}
                boxFormat={this.state.boxFormat}
                showLabels={this.state.showLabels}
                showSegmentation={showSegmentation}
                segmentationSeparate={this.state.segmentationSeparate}
              />
            </div>
          </div>
          <div className="col-md-5">
            <InputForm methodId="mjpeg" />
            {uiControls}
            <div className="card description">
              <div className="card-body">
                <Description
                  selectedBoxIndex={this.state.selectedBoxIndex}
                  onOver={this.onOver}
                  onLeave={this.onLeave}
                />
              </div>
            </div>
            <div className="commands">
              <CardCommands />
            </div>
          </div>
        </div>
      </div>
    );
  }
});
export default MjpegConnector;
