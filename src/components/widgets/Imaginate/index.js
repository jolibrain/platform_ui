import React from "react";
import { observer } from "mobx-react";

import ImageConnector from "./connectors/Image";
import ImagePathConnector from "./connectors/ImagePath";
import TxtConnector from "./connectors/Txt";
import VideoConnector from "./connectors/Video";
import CsvConnector from "./connectors/Csv";
// import WebcamConnector from "./connectors/Webcam";
// import MjpegConnector from "./connectors/Mjpeg";

import stores from "../../../stores/rootStore";

const Imaginate = observer(class Imaginate extends React.Component {

  constructor(props) {
    super(props);

    this.getServiceConnector = this.getServiceConnector.bind(this);
  }

  componentWillReceiveProps(nextProps) {}

  getServiceConnector() {
    const { imaginateStore } = stores;
    const { service } = imaginateStore;

    let connector = null;

    if (service) {

      connector = service.connector;

      let mediaType = null;

      // Check config.json for specific uiParams settings
      // for current service in imaginate.services config values
      if(
        imaginateStore.settings &&
          imaginateStore.settings.services &&
          imaginateStore.settings.services.length > 0
      ) {
        const serviceSettings = imaginateStore.settings.services.find(s => {
          return s.name === service.name
        })

        if(
          serviceSettings &&
          serviceSettings.uiParams &&
           serviceSettings.uiParams.mediaType
          ) {
          mediaType = serviceSettings.uiParams.mediaType;
        }
      }

      // No settings has been configured for this service in config.json
      // Use mediaType defined in deepdetectStore.service
      if(!mediaType) {
        mediaType = service.uiParams.mediaType;
      }

      switch (mediaType) {
        case "image":
          connector = "image";
          break;
        case "imagePath":
          connector = "imagePath";
          break;
        case "webcam":
          connector = "webcam";
          break;
        case "csv":
          connector = "csv";
          break;
        //        case "mjpeg":
        //          connector = "mjpeg";
        //          break;
        //        case "video":
        //          connector = "video";
        //          break;
        default:
          break;
      }
    }

    return connector;
  }

  render() {
    const { configStore, imaginateStore } = stores
    if (configStore.isComponentBlacklisted("Imaginate")) return null;

    if (!imaginateStore.service) {
      console.log("[ImaginateStore] missing service");
      return null;
    }

    const connector = this.getServiceConnector();
    let connectorComponent = null;

    switch (connector) {
      case "txt":
        connectorComponent = <TxtConnector />;
        break;
      case "image":
        connectorComponent = <ImageConnector />;
        break;
      case "imagePath":
        connectorComponent = <ImagePathConnector />;
        break;
      case "webcam":
        // connectorComponent = <WebcamConnector />;
        break;
      case "stream":
        connectorComponent = <VideoConnector />;
        break;
      //      case "mjpeg":
      //        connectorComponent = <MjpegConnector />;
      //        break;
      case "csvts":
        connectorComponent = <CsvConnector />;
        break;
      default:
        connectorComponent = (
          <div className="alert alert-warning" role="alert">
            <i className="fas fa-exclamation-circle" /> Missing attribute{" "}
            <code>body.parameters.input.connector</code> in Service json.
          </div>
        );
        break;
    }

    return (
      <div
        className={`imaginate-${connector}`}
        data-servicename={imaginateStore.service.name}
      >
        {connectorComponent}
      </div>
    );
  }
});
export default Imaginate;
