import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom'
import Boundingbox from 'react-bounding-box';

import ImageList from './ImageList';
import BoundingBoxDisplay from './BoundingBoxDisplay';
//import Results from './Results';
import CurlCommand from './CurlCommand';
import JsonResponse from './JsonResponse';

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

    return (
      <div className='imaginate'>

        <div className='row'>
          <div className='img-list'>
            <ImageList
              selectImage={this.selectImage}
            />
          </div>
        </div>

        <div className='row'>
          <BoundingBoxDisplay />
        </div>

        <div className="row commands">
          <div className="col-md-6">
            <CurlCommand />
          </div>
          <div className="col-md-6">
            <JsonResponse />
          </div>
        </div>


      </div>
    );
  }
};
