import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

@observer
export default class DownloadModelFiles extends React.Component {
  render() {
    const { repository } = this.props;

    if (!repository.files || repository.files === 0) return null;

    return (
      <div className="row">
        <div className="list-group">
          {repository.files.map((f, index) => {
            return (
              <a
                key={index}
                href={f.url}
                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                download
              >
                {f.filename}
                <i className="fas fa-download" />
              </a>
            );
          })}
        </div>
      </div>
    );
  }
}

DownloadModelFiles.propTypes = {
  repository: PropTypes.object.isRequired
};
