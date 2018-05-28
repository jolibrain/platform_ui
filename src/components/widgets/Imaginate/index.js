import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom'

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

  componentDidMount() {
    this.selectImage(0);
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

    if (ddStore.currentServiceIndex === -1 || !store.isLoaded)
      return null;

    return (
      <div className='imaginate'>

        <div className='row'>
          <div className='img-list col-sm-12'>
            <ImageList
              selectImage={this.selectImage}
            />
          </div>
        </div>

        <div className='row'>
          <div className="col-md-8">
            <BoundingBoxDisplay />
          </div>
          <div className="col-md-4">
            <div className="row commands">
              <CurlCommand />
            </div>
            <div className="row">
              <JsonResponse />
            </div>
          </div>

        </div>


      </div>
    );
  }
};
