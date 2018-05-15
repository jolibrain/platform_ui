import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom'
import { parse as qsParse } from 'query-string';

import './Imaginate.css';

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
      <div className='imaginate'>

        <form>
          <div className="form-row align-items-center">
            <div className="col-auto">
              <label className="sr-only" for="inlineFormInput">Image URL</label>
              <input type="text" className="form-control mb-2" id="inlineFormInput" placeholder="Image URL"></input>
            </div>
            <div className="col-auto">
              <button type="submit" className="btn btn-primary mb-2">Submit</button>
            </div>
          </div>
        </form>

        <div className='img-list'>
          <span className='img-block'></span>
          <span className='img-block'></span>
          <span className='img-block'></span>
          <span className='img-block'></span>
          <span className='img-block'></span>
          <span className='img-block'></span>
        </div>

        <div className='img-display'>
          <span></span>
        </div>

        <div className='img-results'>
          <span>results</span>
        </div>

        <div className="row commands">
          <div className="col-md-6">
            <span>CURL</span>
          </div>
          <div className="col-md-6">
            <span>JSON Response</span>
          </div>
        </div>


      </div>
    );
  }
};
