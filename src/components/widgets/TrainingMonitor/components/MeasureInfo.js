import React from "react";
import { toJS } from "mobx";
import { observer, inject } from "mobx-react";

@inject("deepdetectStore")
@observer
export default class MeasureInfo extends React.Component {
  render() {
    const { service } = this.props.deepdetectStore;

    if (!service) return null;

    const measure = service.trainMeasure;
    const measureHist = service.trainMeasureHist;

    if (!measure) return null;

    const measureKeys = Object.keys(measure).filter(
      key => !key.includes("clacc_")
    );

    return (
      <ul>
        {measureKeys.map((key, index) => {
          return (
            <li key={index}>
              <b>{key}</b> : {measure[key]}
            </li>
          );
        })}
      </ul>
    );
  }
}
