import React from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";


import Cards from "./Cards";
import Table from "./Table";

@inject("configStore")
@withRouter
@observer
class MainViewServiceList extends React.Component {

  render() {
    const {
      services,
      filterServiceName,
      layout
    } = this.props;

    if (
      !services ||
      this.props.configStore.isComponentBlacklisted("MainViewServiceList")
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
        content = <Table services={filteredServices}/>
        break;

        case "card":
        default:
        content = <Cards services={filteredServices}/>
        break;

    }

    return (<div className="mainViewServiceList row">{content}</div>);
  }
}

MainViewServiceList.propTypes = {
  services: PropTypes.array.isRequired,
  filterServiceName: PropTypes.string,
  handleCompareStateChange: PropTypes.func,
  layout: PropTypes.string
};
export default MainViewServiceList;
