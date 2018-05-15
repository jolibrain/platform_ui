import React from 'react';
import { inject, observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom'
import { parse as qsParse } from 'query-string';

@inject('commonStore')
@withRouter
@observer
export default class RightPanel extends React.Component {

  componentWillMount() {
    //this.props.articlesStore.setPredicate(this.getPredicate());
  }

  componentDidMount() {
    //this.props.articlesStore.loadArticles();
  }

  componentDidUpdate(previousProps) {
    //if (
    //  this.getTab(this.props) !== this.getTab(previousProps) ||
    //  this.getTag(this.props) !== this.getTag(previousProps)
    //) {
    //  this.props.articlesStore.setPredicate(this.getPredicate());
    //  this.props.articlesStore.loadArticles();
    //}
  }

  getTag(props = this.props) {
    return qsParse(props.location.search).tag || "";
  }

  getTab(props = this.props) {
    return qsParse(props.location.search).tab || 'all';
  }

  getPredicate(props = this.props) {
    switch (this.getTab(props)) {
      case 'feed': return { myFeed: true };
      case 'tag': return { tag: qsParse(props.location.search).tag };
      default: return {};
    }
  }

  handleTabChange = (tab) => {
    if (this.props.location.query.tab === tab) return;
    this.props.router.push({ ...this.props.location, query: { tab } })
  };

  handleSetPage = page => {
    this.props.articlesStore.setPage(page);
    this.props.articlesStore.loadArticles();
  };

  render() {
    return (
      <aside className="right-sidebar right-sidebar right-sidebar-expanded">
        <div className="issuable-sidebar">

          <div className="block list-group">
            <Link to='/' className="list-group-item list-group-item-action d-flex justify-content-between align-items-center active">
              Cras justo odio
              <span className="badge badge-light badge-pill">14</span>
            </Link>
            <Link to='/' className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
              Dapibus ac facilisis in
              <span className="badge badge-secondary badge-pill">1</span>
            </Link>
            <Link to='/' className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
              Morbi leo risus
              <span className="badge badge-primary badge-pill">12</span>
            </Link>
            <Link to='/' className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
              Porta ac consectetur ac
              <span className="badge badge-primary badge-pill">13</span>
            </Link>
          </div>

        </div>
      </aside>
    );
  }
};
