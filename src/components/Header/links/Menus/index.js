import React from "react";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import Menu from "./Menu";
import MenuDropdown from "./MenuDropdown";
import stores from "../../../../stores/rootStore";

const MenusLink = withRouter(observer(class MenuLink extends React.Component {
  render() {
    const { configStore } = stores;
    const { linkMenus } = configStore.homeComponent.headerLinks;

    const Menus = linkMenus.map((menu, index) => {
      return menu.urls && menu.urls.length > 0 ?
        <MenuDropdown key={index} {...menu} />
      :
        <Menu key={index} {...menu} />
      ;
    });

    return <>{Menus}</>;
  }
}));
export default MenusLink;
