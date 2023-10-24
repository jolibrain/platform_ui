import React from "react";
import { observer } from "mobx-react";

import Header from "../../Header";
import LeftPanel from "../commons/LeftPanel";

import TrainingArchive from "../views/Training/Archive";
import ModelBenchmark from "../views/Model/Benchmark";

import stores from "../../../stores/rootStore";

const ChartShow = observer(class ChartShow extends React.Component {
  render() {
    const { configStore } = stores;
    if (configStore.isComponentBlacklisted("Chart")) return null;

    let mainView = null;
    const { chartType } = this.props.match.params;

    switch (chartType) {
      case "benchmark":
        mainView = <ModelBenchmark {...this.props} />;
        break;
      case "archive":
        mainView = <TrainingArchive {...this.props} />;
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
});
export default ChartShow;
