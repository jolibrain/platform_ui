import React from "react";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import Cards from "./Cards";
import Table from "./Table";

import stores from "../../../stores/rootStore";

const MainViewServiceList = withRouter(observer(class MainViewServiceList extends React.Component {

  render() {
    const { configStore } = stores;
    const {
      services,
      filterServiceName,
      layout
    } = this.props;

    if (
      !services ||
      configStore.isComponentBlacklisted("MainViewServiceList")
    )
      return null;

    const filteredServices = services
      .filter(r => {
        return filterServiceName && filterServiceName.length > 0 ?
          r.name.includes(filterServiceName)
          :
          true;
      });

    let content = null;

    switch(layout) {

        case "list":
        content = <Table services={filteredServices} {...this.props}/>
        break;

        case "card":
        default:
        content = <Cards services={filteredServices} {...this.props}/>
        break;

    }

    return (<div className="mainViewServiceList row">{content}</div>);
  }
}));
export default MainViewServiceList;
