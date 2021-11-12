/* eslint jsx-a11y/anchor-is-valid: "off" */
import React from "react";

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

class SkeletonCard extends React.Component {

  render() {
    return (
      <div className="col-lg-4 col-md-12 my-2">
        <div className="card">
          <div className="card-body">

            <h5 className="card-title">
              <span className="title">
                <i className="fas fa-archive" /> <Skeleton />
              </span>
            </h5>

            <h6 className="card-subtitle text-muted">
              <span className="title"><Skeleton /></span>
            </h6>

            <div className="row process-icons">
              <div className="col-12">
                <i className={`fas fa-tag`} />{" "}<Skeleton />
              </div>
              <div className="col-12">
                <i className="far fa-clock" />{" "}<Skeleton />
              </div>
              <div className="col-12">
                <i className="fas fa-folder" /> <Skeleton />
              </div>
            </div>
          </div>

          <div className="card-footer text-right">
            <Skeleton />
          </div>
        </div>
      </div>
    );
  }
}

export default SkeletonCard;
