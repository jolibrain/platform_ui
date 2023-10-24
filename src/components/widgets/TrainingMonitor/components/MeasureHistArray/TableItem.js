import React from "react";

import { toJS } from "mobx";
import { Sparklines, SparklinesLine } from "react-sparklines";

const TableItem = class TableItem extends React.Component {
  constructor(props) {
    super(props);

    // colors froms src/styles/palettes/chart-badges.scss
    this.state = {
      logScale: false,
      colors: [
        "hsl(210, 22%, 49%)",
        "rgb(178,223,138)",
        "rgb(251,154,153)",
        "rgb(253,191,111)",
        "rgb(202,178,214)",
        "rgb(255,255,153)",
        "rgb(31,120,180)",
        "rgb(51,160,44)",
        "rgb(227,26,28)",
        "rgb(255,127,0)",
        "rgb(106,61,154)",
        "rgb(177,89,40)"
      ]
    };

    this.getSparklines = this.getSparklines.bind(this);
    this.getServiceSparkline = this.getServiceSparkline.bind(this);

    this.getValues = this.getValues.bind(this);
    this.getServiceValues = this.getServiceValues.bind(this);
  }

  getServiceValues(service, index) {
    const { measureHistKey } = this.props;
    const measureKey = measureHistKey.replace("_hist", "");

    let value = "--",
      measure,
      measure_hist;

    if (!service) return null;

    if (service.jsonMetrics) {
      measure_hist = service.jsonMetrics.body.measure_hist;
      measure = service.jsonMetrics.body.measure;
    } else {
      measure_hist = service.measure_hist;
      measure = service.measure;
    }

    if (!measure_hist || !measure_hist[measureHistKey]) return null;

    if (
      typeof measure === "undefined" ||
      typeof measure[measureKey] === "undefined"
    ) {
      value =
        measure_hist[measureHistKey][measure_hist[measureHistKey].length - 1];
    } else {
      try {
        value = measure[measureKey].toFixed(5);
        if(value > 1) {
          value = parseFloat(value).toFixed(3)
        }
      } catch (e) {
        // measure[measureKey].toFixed is not a function
      }

      if (measureKey.includes("cmdiag_")) {
        if (typeof measure[measureKey] !== "undefined") {
          value = measure[measureKey];
        } else {
          const diagLabel = measureKey.replace("cmdiag_", "");
          value = measure.cmdiag[measure.labels.indexOf(diagLabel)].toFixed(5);
        }
      }
    }

    if (typeof value !== "undefined" && typeof value.toFixed === "function") {
      if (value > 1) {
        value = value.toFixed(3);
      } else {
        // Find position of first number after the comma
        const zeroPosition = value
          .toString()
          .split("0")
          .slice(2)
          .findIndex(elem => elem.length > 0);

        value = value.toFixed(zeroPosition + 5);
      }
    }

    let bestValue = null;

    if(
      measure_hist[measureHistKey] !== undefined &&
        Array.isArray(measure_hist[measureHistKey])
    ) {

      if(
        measureHistKey.indexOf("eucll") !== -1 ||
          measureHistKey.indexOf("L1_mean_error") !== -1 ||
          measureHistKey.indexOf("L1_max_error")  !== -1 ||
          measureHistKey.indexOf("_loss")  !== -1
      ) {

        bestValue = Math.min(...measure_hist[measureHistKey]).toFixed(5)
        if(bestValue > 1) {
          bestValue = parseFloat(bestValue).toFixed(3);
        }
        bestValue = " - min: " + bestValue;

      } else {

        bestValue = Math.max(...measure_hist[measureHistKey]).toFixed(5)
        if(bestValue > 1) {
          bestValue = parseFloat(bestValue).toFixed(3);
        }
        bestValue = " - max: " + bestValue;

      }

    }

    const badgeIndex = index % 8;

    return (
      <h4 key={`badge-${badgeIndex}`}>
        <i className={`fa fa-circle chart-badge-${badgeIndex}`} />
        {value}
        {bestValue ? bestValue : null}
      </h4>
    );
  }

  getServiceSparkline(service, index) {
    const { measureHistKey } = this.props;
    let sparkData = [],
      measure_hist;

    if (!service) return null;

    if (service.jsonMetrics) {
      measure_hist = service.jsonMetrics.body.measure_hist;
    } else {
      measure_hist = service.measure_hist;
    }

    if (
      measure_hist &&
      measure_hist[measureHistKey] &&
      measure_hist[measureHistKey].length > 0
    ) {
      sparkData = toJS(measure_hist[measureHistKey]).map(x =>
        parseInt(x * 100, 10)
      );
    }

    // data bounds
    let dataMin, dataMax;
    if ([
        "acc",
        "accp",
        "precision",
        "recall",
        "meanacc",
        "clacc",
        "meaniou",
        "cliou",
        "f1",
        "map"
      ].some(prefix => measureHistKey.startsWith(`${prefix}_`))) {

        dataMin = 0;
        dataMax = 100;
    } else if ([
        "eucll",
        "mcll",
        "L1_mean_error",
        "L2_mean_error",
      ].some(prefix => measureHistKey.startsWith(`${prefix}_`)) ||
        measureHistKey.indexOf("_loss") !== -1) {

        dataMin = 0;
        dataMax = Math.ceil(Math.max(...sparkData));
    } else {
        dataMin = Math.floor(Math.min(...sparkData));
        dataMax = Math.ceil(Math.max(...sparkData));
    }

    return (
      <Sparklines
        key={`sparkline-${index}`}
        data={sparkData}
        min={dataMin}
        max={dataMax}
        width={240}
        height={100}
      >
        <SparklinesLine
          color={this.state.colors[index]}
          style={{ strokeWidth: 3 }}
        />
      </Sparklines>
    );
  }

  getValues() {
    let { service, services } = this.props;

    // When multiple services,
    // use first service as referential to know which chart will be displayed
    if (services && services.length > 0 && !service) {
      service = services[0];
    } else {
      // Create array with only service in order to build dataset
      services = [service];
    }

    return services.map((s, index) => this.getServiceValues(s, index));
  }

  getSparklines() {
    let { service, services } = this.props;

    // When multiple services,
    // use first service as referential to know which chart will be displayed
    if (services && services.length > 0 && !service) {
      service = services[0];
    } else {
      // Create array with only service in order to build dataset
      services = [service];
    }

    return services.map((s, index) => this.getServiceSparkline(s, index));
  }

  render() {
    const { measureHistKey } = this.props;
    const measureKey = measureHistKey.replace("_hist", "");

    return (
      <tr key={`measureKey-${measureKey}`}>
        <th scope="row" className="sparkline">
          {this.getSparklines()}
        </th>
        <td>
          {this.getValues()}
          <h3>{measureKey}</h3>
        </td>
      </tr>
    );
  }
};
export default TableItem;
