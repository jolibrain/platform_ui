import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom'
import Boundingbox from 'react-bounding-box';

@inject('commonStore')
@inject('imaginateStore')
@inject('deepdetectStore')
@withRouter
@observer
export default class Imaginate extends React.Component {

  constructor(props) {
    super(props);

    this.selectImage = this.selectImage.bind(this);
    this.loadImage = this.loadImage.bind(this);
  }

  selectImage(index) {
    const store = this.props.imaginateStore;
    store.setSelectedImage(index);
    this.loadImage();
  }

  loadImage() {
    const store = this.props.imaginateStore;
    const ddStore = this.props.deepdetectStore;

    if (ddStore.currentServiceIndex === -1)
      return null;

    const service = ddStore.services[ddStore.currentServiceIndex];
    store.predictSelectedImage(service.name);
  }

  render() {

    const store = this.props.imaginateStore;
    const ddStore = this.props.deepdetectStore;

    if (ddStore.currentServiceIndex === -1)
      return null;

    return (
      <div className='imaginate'>

        <div className='row'>
          <div className='img-list'>
            {
              store.imgList.map( (img, index) => {
                return (
                  <img
                    src={img.url}
                    key={`img-${index}`}
                    className='img-block'
                    alt=''
                    onClick={this.selectImage.bind(this, index)}
                  />
                );
              })
            }
          </div>
        </div>

        <div className='row'>
          <div className='img-display'>
            <Boundingbox image={store.selectedImage.url}
                         boxes={store.selectedImage.boxes}
            />
          </div>
        </div>

        <div className='img-results'>
          <span>results</span>
        </div>

        <div className="row commands">
          <div className="col-md-6">
            <span>CURL</span>
            <code>{`curl -X POST 'http://localhost:8000/predict' -d '${JSON.stringify(store.selectedImage.postData, null, 2)}'`}</code>
          </div>
          <div className="col-md-6">
            <span>JSON Response</span>
            <code>{JSON.stringify(store.selectedImage.json, null, 2)}</code>
          </div>
        </div>


      </div>
    );
  }
};
