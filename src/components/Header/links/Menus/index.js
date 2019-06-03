import React from "react";
import { inject } from "mobx-react";

import Menu from "./Menu";

@inject("configStore")
class MenusLink extends React.Component {
  render() {
    const { configStore } = this.props;

    if (
      configStore.isComponentBlacklisted("MenusLink") ||
      typeof configStore.homeComponent.headerLinks.linkMenus === "undefined" ||
      configStore.homeComponent.headerLinks.linkMenus.length === 0
    )
      return null;

    const { linkMenus } = configStore.homeComponent.headerLinks;

    const Menus = linkMenus.map((menu, index) => {
      return (
        <div key={index}>
          <Menu {...menu} />
        </div>
      );
    });

    return <div>{Menus}</div>;
  }
}

export default MenusLink;
