import React from "react";
import { inject, observer } from "mobx-react";

@inject("imaginateStore")
@inject("deepdetectStore")
@observer
export default class ImageList extends React.Component {
  render() {
    const store = this.props.imaginateStore;

    if (!store.service) return null;

    return (
      <div id="carousel">
        {store.service.imgList.map((img, index) => {
          return (
            <div key={`img-${index}`} className="slide">
              <img
                src={img.url}
                key={`img-${index}`}
                className="img-block"
                alt=""
                onClick={this.props.selectImage.bind(this, index)}
              />
            </div>
          );
        })}
      </div>
    );
  }
}
