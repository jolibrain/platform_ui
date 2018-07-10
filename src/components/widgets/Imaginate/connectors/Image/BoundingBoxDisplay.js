import React from "react";
import { toJS } from "mobx";
import { inject, observer } from "mobx-react";
import Boundingbox from "react-bounding-box";

@inject("imaginateStore")
@observer
export default class BoundingBoxDisplay extends React.Component {
  render() {
    const store = this.props.imaginateStore;

    if (store.service.isRequesting) {
      return (
        <div className="alert alert-primary" role="alert">
          <i className="fas fa-spinner fa-spin" />&nbsp; Loading...
        </div>
      );
    }

    const input = store.service.selectedInput;

    if (
      !input ||
      !input.content ||
      !input.json ||
      !input.json.body ||
      !input.json.body.predictions ||
      !input.json.body.predictions[0]
    )
      return null;

    const inputVals = input.json.body.predictions[0].vals;
    const pixelSegmentation = inputVals !== "undefined";

    return (
      <Boundingbox
        className="boundingboxdisplay"
        image={input.content}
        boxes={toJS(input.boxes)}
        selectedIndex={this.props.selectedBoxIndex}
        onSelected={this.props.onOver}
        pixelSegmentation={pixelSegmentation ? toJS(inputVals) : null}
        separateSegmentation={pixelSegmentation ? inputVals.length > 0 : false}
        segmentationColors={toJS(
          store.serviceSettings.display.segmentationColors
        )}
      />
    );
  }
}
