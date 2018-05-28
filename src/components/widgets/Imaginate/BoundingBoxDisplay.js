import React from 'react';
import { inject, observer } from 'mobx-react';
import Boundingbox from 'react-bounding-box';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

@inject('imaginateStore')
@observer
export default class BoundingBoxDisplay extends React.Component {

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
  }

  render() {
    const store = this.props.imaginateStore;
    const image = store.selectedImage;

    if(image === null)
      return (
        <div className="alert alert-primary" role="alert">
          <FontAwesomeIcon icon="spinner" spin/>&nbsp;
          Loading...
        </div>
      );

    return (
      <Boundingbox
        className='boundingboxdisplay'
        image={image.url}
        boxes={image.boxes}
      />
    );
  }

}

