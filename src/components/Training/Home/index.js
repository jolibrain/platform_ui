import React from "react";
import { inject } from "mobx-react";

import Header from "../../Header";
import LeftPanel from "../commons/LeftPanel";
import MainView from "./MainView";
import Modals from "./Modals";

@inject("deepdetectStore")
@inject("configStore")
export default class TrainingHome extends React.Component {
  constructor(props) {
    super(props);
    this.openPublishTrainingModal = this.openPublishTrainingModal.bind(this);
  }

  openPublishTrainingModal() {
    this.props.modalStore.setVisible("publishTraining");
  }

  componentWillMount() {
    const { deepdetectStore } = this.props;
    deepdetectStore.setTrainRefreshMode("services");
  }

  componentWillReceiveProps(nextProps) {
    const { deepdetectStore } = this.props;
    deepdetectStore.setTrainRefreshMode("services");
  }

  render() {
    if (
      this.props.configStore.isComponentBlacklisted("Training") ||
      this.props.configStore.isComponentBlacklisted("TrainingHome")
    )
      return null;

    return (
      <div>
        <Header />
        <div className="layout-page page-gutter page-with-contextual-sidebar right-sidebar-collapsed page-with-icon-sidebar training-home-component">
          <LeftPanel />
          <MainView />
          <Modals />
        </div>
      </div>
    );
  }
}
