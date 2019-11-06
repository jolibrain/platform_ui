import React from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";

@inject("imaginateStore")
@observer
export default class ChainNns extends React.Component {
  constructor(props) {
    super(props);

    this.toggleMulticropRoi = this.toggleMulticropRoi.bind(this);
    this.nnsItem = this.nnsItem.bind(this);
  }

  toggleMulticropRoi() {
    const { imaginateStore } = this.props;
    imaginateStore.settings.default.display.multicrop = !imaginateStore.settings
      .default.display.multicrop;
  }

  nnsItem(nns, index) {
    const percent = parseInt(nns.dist * 100, 10);
    const progressStyle = { width: `${percent}%` };

    let progressBg = "bg-danger";

    if (percent < 60) {
      progressBg = "bg-warning";
    }

    if (percent < 30) {
      progressBg = "bg-success";
    }

    return (
      <div key={index} className="col progress-nns">
        <img src={nns.uri} className="img-fluid" alt="" />
        <div
          className={`progress-bar ${progressBg}`}
          role="progressbar"
          style={progressStyle}
          aria-valuenow={percent}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          {percent}
        </div>
      </div>
    );
  }

  render() {
    const { input, selectedBoxIndex, imaginateStore } = this.props;
    let output = [];

    const multicropStatus = imaginateStore.settings.default.display.multicrop;

    output.push(
      <div key="multicrop_roi">
        <input
          id="multicropRoi"
          type="checkbox"
          onChange={this.toggleMulticropRoi}
          checked={multicropStatus ? "checked" : ""}
        />
        <label htmlFor="multicropRoi">Multicrop</label>
      </div>
    );

    if (multicropStatus) {
      let cells = input.json.body.predictions[0].nns
        .map(this.nnsItem)
        .reduce((result, element, index, array) => {
          // Add 2-columns separators
          result.push(element);
          if ((index + 1) % 2 === 0) {
            result.push(<div key={`sep-${index}`} className="w-100" />);
          }
          return result;
        }, []);

      // Add empty column to fill row
      if (cells.length % 2 === 1)
        cells.push(<div key="empty-col" className="col" />);

      output.push(
        <div
          key="description-chain-nns-selected"
          className="description-nns row"
        >
          {cells}
        </div>
      );
    } else if (selectedBoxIndex !== -1) {
      const selectedResult =
        input.json.body.predictions[0].classes[selectedBoxIndex];

      let chainService = null;
      for (let i = 0; i < Object.keys(selectedResult).length; i += 1) {
        const key = Object.keys(selectedResult)[i];
        const child = selectedResult[key];

        if (child.nns) {
          chainService = key;
          break;
        }
      }

      let cells = selectedResult[chainService].nns
        .map(this.nnsItem)
        .reduce((result, element, index, array) => {
          // Add 2-columns separators
          result.push(element);
          if ((index + 1) % 2 === 0) {
            result.push(<div key={`sep-${index}`} className="w-100" />);
          }
          return result;
        }, []);

      // Add empty column to fill row
      if (cells.length % 2 === 1)
        cells.push(<div key="empty-col" className="col" />);

      output.push(
        <div
          key="description-chain-nns-selected"
          className="description-nns row"
        >
          {cells}
        </div>
      );
    }

    return <div>{output}</div>;
  }
}

ChainNns.propTypes = {
  input: PropTypes.object.isRequired
};
