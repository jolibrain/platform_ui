import React from 'react';

export default class ImageList extends React.Component {

  render() {
    return (
      <div className='row'>
        <div className='img-list'>
          {
            this.props.imgList.map( (img, index) => {
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
      </div>
    );
  }

}
