import React from "react";

export default class Header extends React.Component {
  render() {
    return (
      <div className="card-header">
        {this.props.requestTime !== -1 ? (
          <span className="badge badge-secondary float-right">
            {this.props.requestTime}ms
          </span>
        ) : (
          ""
        )}
        <ul className="nav nav-tabs card-header-tabs">
          <li className="nav-item">
            <a
              className={
                this.props.tab === "curl" ? "nav-link active" : "nav-link"
              }
              onClick={this.props.onTabClick.bind(this, "curl")}
            >
              Curl&nbsp;
              {this.props.isRequesting ? (
                <i className="fas fa-spinner fa-spin" />
              ) : (
                ""
              )}
            </a>
          </li>

          <li className="nav-item">
            <a
              className={
                this.props.tab === "json" ? "nav-link active" : "nav-link"
              }
              onClick={this.props.onTabClick.bind(this, "json")}
            >
              JSON&nbsp;
              {this.props.isError ? (
                <i className="fas fa-exclamation-triangle" />
              ) : (
                ""
              )}
            </a>
          </li>

          <li className="nav-item">
            <a
              className={
                this.props.tab === "python" ? "nav-link active" : "nav-link"
              }
              onClick={this.props.onTabClick.bind(this, "python")}
            >
              Python
            </a>
          </li>
        </ul>
      </div>
    );
  }
}
