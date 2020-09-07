/* eslint jsx-a11y/anchor-is-valid: "off" */
import React from "react";
import MenuItem from "./MenuItem";

class Menu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      menuDown: false
    };

    this.handleMenuClick = this.handleMenuClick.bind(this);

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside(event) {
    if (
      this.wrapperRef &&
      !this.wrapperRef.contains(event.target) &&
      this.state.menuDown
    ) {
      this.setState({ menuDown: false });
    }
  }

  handleMenuClick() {
    this.setState({ menuDown: !this.state.menuDown });
  }

  render() {
    const { name, items } = this.props;

    if (items && items.length > 0) {
      return (
        <li className="nav-item dropdown" ref={this.setWrapperRef}>
          <a
            className="nav-link dropdown-toggle"
            style={{ cursor: "pointer" }}
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            onClick={this.handleMenuClick}
          >
            {name}
          </a>
          <div className={`dropdown-menu ${this.state.menuDown ? "show" : ""}`}>
            {items.map((item, index) => (
              <MenuItem key={index} isDropdownItem={true} {...item} />
            ))}
          </div>
        </li>
      );
    } else {
      return (
        <li>
          <MenuItem {...this.props} />
        </li>
      );
    }
  }
}

export default Menu;
