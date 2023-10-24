/* eslint jsx-a11y/anchor-is-valid: "off" */
import React from "react";

const MenuDropdown = class MenuDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      listDown: false
    };

    this.handleListClick = this.handleListClick.bind(this);

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  /**
   * Set the wrapper ref
   */
  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (
      this.wrapperRef &&
      !this.wrapperRef.contains(event.target) &&
      this.state.listDown
    ) {
      this.setState({ listDown: false });
    }
  }

  handleListClick() {
    this.setState({ listDown: !this.state.listDown });
  }


  render() {
    const { name, icon, urls } = this.props;

    return (
        <div
          className="navbar-item menus-dropdown"
          ref={this.setWrapperRef}
        >
          <a
            className="nav-link dropdown-toggle"
            style={{ cursor: "pointer" }}
            id="navbarDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            onClick={this.handleListClick}
          >
            {typeof icon !== "undefined" ? (
            <span>
                <i className={icon} />
                &nbsp;
            </span>
            ) : (
            ""
            )}
            {name}
          </a>
          <div
            className={`dropdown-menu ${this.state.listDown ? "show" : ""}`}
            aria-labelledby="navbarDropdown"
            style={{right: "auto"}}
          >
            { urls.map(item => {
                return (
                    <a
                      key={`dropdown-menu-${item.title}`}
                      className="dropdown-item"
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {typeof item.icon !== "undefined" ? (
                          <span>
                            <i className={item.icon} />
                            &nbsp;
                          </span>
                      ) : (
                          ""
                      )}
                      {item.title}
                    </a>
                )
            }) }
          </div>
        </div>
    );
  }
};
export default MenuDropdown;
