import React from 'react';
import { inject, observer } from 'mobx-react';

@inject('imaginateStore')
@observer
export default class ImageList extends React.Component {

  render() {
    const store = this.props.imaginateStore;
    return (
    <div>
      {
        store.imgList.map( (img, index) => {
          return (
            <img
              src={img.url}
              key={`img-${index}`}
              className='img-block'
              alt=''
              onClick={this.props.selectImage.bind(this, index)}
            />
          );
        })
      }
    </div>
    );
  }

}
