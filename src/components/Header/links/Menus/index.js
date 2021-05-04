import React from "react";
import { inject } from "mobx-react";

import Menu from "./Menu";
import MenuDropdown from "./MenuDropdown";

@inject("configStore")
class MenusLink extends React.Component {
  render() {
    const { configStore } = this.props;
    const { linkMenus } = configStore.homeComponent.headerLinks;

    const Menus = linkMenus.map((menu, index) => {
      return menu.urls && menu.urls.length > 0 ?
        (
        <div key={index}>
          <MenuDropdown {...menu} />
        </div>
      )
      :
        (
        <div key={index}>
          <Menu {...menu} />
        </div>
      );
    });

    return <div>{Menus}</div>;
  }
}

export default MenusLink;
