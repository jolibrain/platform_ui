import React from "react";
import { inject, observer } from "mobx-react";

import Header from "../../Header";
import LeftPanel from "../commons/LeftPanel";

import TrainingMonitor from "../views/Training/Monitor";
import TrainingArchive from "../views/Training/Archive";

import ModelBenchmark from "../views/Model/Benchmark";
import ModelCompare from "../views/Model/Compare";

@inject("configStore")
@inject("deepdetectStore")
@observer
export default class ChartShow extends React.Component {
  render() {
    if (this.props.configStore.isComponentBlacklisted("Chart")) return null;

    let mainView = null;
    const { chartType } = this.props.match.params;

    console.log(chartType);

    switch (chartType) {
      case "trainingMonitor":
        mainView = <TrainingMonitor {...this.props} />;
        break;
      case "trainingArchive":
        mainView = <TrainingArchive {...this.props} />;
        break;
      case "modelBenchmark":
        mainView = <ModelBenchmark {...this.props} />;
        break;
      case "modelCompare":
        mainView = <ModelCompare {...this.props} />;
        break;
      default:
        break;
    }

    return (
      <div>
        <Header />
        <div className="layout-page page-gutter page-with-contextual-sidebar right-sidebar-collapsed page-with-icon-sidebar chart-show-component">
          <LeftPanel />
          {mainView}
        </div>
      </div>
    );
  }
}
