import React from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

@inject('commonStore')
@observer
class Header extends React.Component {
  render() {
    return (
      <header className="header navbar navbar-dark bg-dark">
        <div className="container-fluid">
          <div className="header-content">

            <div className="title-container">
              <h1 className="title">
                <Link to="/">
                  {this.props.commonStore.appName.toLowerCase()}
                </Link>
              </h1>

              <ul className="list-unstyled navbar-sub-nav">
                <li>
                  <Link to="/" className="nav-link">
                    testing...
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </header>
    );
  }
}

export default Header;
