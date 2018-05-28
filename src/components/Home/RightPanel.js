import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import { parse as qsParse } from "query-string";

import GpuInfo from "../widgets/GpuInfo";

@inject("commonStore")
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
    return qsParse(props.location.search).tab || "all";
  }

  getPredicate(props = this.props) {
    switch (this.getTab(props)) {
      case "feed":
        return { myFeed: true };
      case "tag":
        return { tag: qsParse(props.location.search).tag };
      default:
        return {};
    }
  }

  handleTabChange = tab => {
    if (this.props.location.query.tab === tab) return;
    this.props.router.push({ ...this.props.location, query: { tab } });
  };

  handleSetPage = page => {
    this.props.articlesStore.setPage(page);
    this.props.articlesStore.loadArticles();
  };

  render() {
    return (
      <aside className="right-sidebar right-sidebar right-sidebar-expanded">
        <div className="issuable-sidebar">
          <GpuInfo />
        </div>
      </aside>
    );
  }
}
