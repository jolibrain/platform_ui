import React from "react";

const ProcessingItem = class ProcessingItem extends React.Component {
    render() {
        const { video } = this.props;

        let icon
        switch (video.status) {
            case "Pending":
                icon = "fas fa-clock"
                break;
            case "Processing":
                icon = "fas fa-spinner fa-spin"
                break;
            case "Failed":
                icon = "fas fa-exclamation-triangle"
                break;
            case "Done":
            default:
                icon = "fas fa-check-square"
                break;
        }

        return (
            <li>
              <i className={icon}/>

              {decodeURIComponent(video.title)}

              { video.message ?
                <span><br/><code>{video.message}</code></span>
                : null
              }
            </li>
        );
    }
};
export default ProcessingItem;
