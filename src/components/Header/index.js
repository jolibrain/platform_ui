import React from "react";
import { Link } from "react-router-dom";
import { inject, observer } from "mobx-react";

import ServerDropdown from "./dropdowns/ServerDropdown";
import UserDropdown from "./dropdowns/UserDropdown";
import AboutDropdown from "./dropdowns/AboutDropdown";

import PredictLink from "./links/Predict";
import TrainingLink from "./links/Training";

import VideoExplorerLink from "./links/VideoExplorer";

import JupyterLink from "./links/Jupyter";
import DataLink from "./links/Data";
import DocumentationLink from "./links/Documentation";
import SwaggerLink from "./links/Swagger";
import ChatLink from "./links/Chat";
import MenusLink from "./links/Menus";

@inject("configStore")
@observer
class Header extends React.Component {
  render() {

    const { configStore } = this.props;

    if (configStore.isComponentBlacklisted("Header"))
      return null;

    let leftLinks = [],
        rightLinks = [],
        titleContent = null;

    if (!configStore.isComponentBlacklisted("HeaderTitle")) {
      titleContent = (
        <Link to="/">
          <img src="/logo.svg" alt="DeepDetect" style={{height: 26}}/>
        </Link>
      )
    }

    if (!configStore.isComponentBlacklisted("HeaderLeftLinks")) {

      if (!configStore.isComponentBlacklisted("LinkPredict"))
        leftLinks.push(<PredictLink key='predictLink' />);

      if (!configStore.isComponentBlacklisted("LinkTraining"))
        leftLinks.push(<TrainingLink key='trainingLink' />);

      if(
        configStore.videoExplorer &&
          !configStore.isComponentBlacklisted("LinkVideoExplorer")
      )
        leftLinks.push(<VideoExplorerLink key='videoExplorerLink' />)

      if (leftLinks.length > 0) {
        leftLinks.push(
          <li key='separator'>
            <span className="separator">|</span>
          </li>
        );
      }

      if (!configStore.isComponentBlacklisted("LinkJupyter"))
        leftLinks.push(<JupyterLink key='jupyterLink' />);

      if (!configStore.isComponentBlacklisted("LinkData"))
        leftLinks.push(<DataLink key='dataLink' />);

      if (!configStore.isComponentBlacklisted("LinkChat"))
        leftLinks.push(<ChatLink key='chatLink' />);

      if (
        !configStore.isComponentBlacklisted("MenusLink") &&
          configStore.homeComponent &&
          configStore.homeComponent.headerLinks &&
          configStore.homeComponent.headerLinks.linkMenus &&
          typeof configStore.homeComponent.headerLinks.linkMenus !== "undefined" &&
          configStore.homeComponent.headerLinks.linkMenus.length !== 0
      )
        leftLinks.push(<MenusLink key='menuLink' />);
    }

    if (
      !this.props.configStore.isComponentBlacklisted("HeaderRightLinks")
    ) {
      if (!configStore.isComponentBlacklisted("ServerDropdown"))
        rightLinks.push(<ServerDropdown key='serverDropdown' />);

      if (!configStore.isComponentBlacklisted("LinkDocumentation"))
        rightLinks.push(<DocumentationLink key='documentationLink' />);

      if (!configStore.isComponentBlacklisted("LinkSwagger"))
        rightLinks.push(<SwaggerLink key='swaggerLink' />);

      if (!configStore.isComponentBlacklisted("AboutDropdown"))
        rightLinks.push(<AboutDropdown key='aboutDropdown' />);

      if (!configStore.isComponentBlacklisted("UserDropdown"))
        rightLinks.push(<UserDropdown key='userDropdowwn' />);
    }

    return (
      <header className="header navbar navbar-dark bg-dark" id="header">
        <div className="container-fluid">
          <div className="header-content">
            <div className="title-container">
              <h1 className="title">
                { titleContent }
              </h1>

              <ul className="list-unstyled navbar-sub-nav">
                { leftLinks }
              </ul>
            </div>

            <div className="navbar-collapse d-flex justify-content-end">
              <ul className="nav nabar-nav">
                { rightLinks }
              </ul>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
