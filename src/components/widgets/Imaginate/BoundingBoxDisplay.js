import React from 'react';
import { inject, observer } from 'mobx-react';
import Boundingbox from 'react-bounding-box';

@inject('imaginateStore')
@observer
export default class BoundingBoxDisplay extends React.Component {

  render() {
    const store = this.props.imaginateStore;
    return (
      <Boundingbox
        className='boundingboxdisplay'
        image={store.selectedImage.url}
        boxes={store.selectedImage.boxes}
      />
    );
  }

}

