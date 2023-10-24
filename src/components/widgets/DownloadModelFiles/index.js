import React from "react";
import { observer } from "mobx-react";

const DownloadModelFiles = observer(class DownloadModelFiles extends React.Component {
  render() {
    const { repository } = this.props;
    const files = repository.downloadableFiles;

    if (!files || files.length === 0) return null;

    return (
      <div className="downloadModelFiles">
        <h6>
          <i className="fas fa-folder" /> {repository.path}
        </h6>

        <div className="list-group list-group-flush">
          {files.map((f, index) => {
            return (
              <a
                key={index}
                href={repository.path + f}
                className="list-group-item list-group-item-action d-flex justify-content-start align-items-center text-truncate"
                download
              >
                <i className="fas fa-chevron-right" />
                &nbsp;{f}
              </a>
            );
          })}
        </div>
      </div>
    );
  }
});
export default DownloadModelFiles;
