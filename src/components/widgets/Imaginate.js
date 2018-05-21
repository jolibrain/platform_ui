import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom'

@inject('commonStore')
@inject('imaginateStore')
@withRouter
@observer
export default class Imaginate extends React.Component {

  render() {
    console.log(this.props.imaginateStore);
    return (
      <div className='imaginate'>

        <form>
          <div className="form-row align-items-center">
            <div className="col-auto">
              <label className="sr-only" htmlFor="inlineFormInput">Image URL</label>
              <input type="text" className="form-control mb-2" id="inlineFormInput" placeholder="Image URL"></input>
            </div>
            <div className="col-auto">
              <button type="submit" className="btn btn-primary mb-2">Submit</button>
            </div>
          </div>
        </form>

        <div className='img-list'>
          {
            this.props.imaginateStore.imgList.map( (url, index) => {
              return (
                <img
                  src={url}
                  key={`img-${index}`}
                  className='img-block'
                  alt=''
                />
              );
            })
          }
        </div>

        <div className='img-display'>
          <span></span>
        </div>

        <div className='img-results'>
          <span>results</span>
        </div>

        <div className="row commands">
          <div className="col-md-6">
            <span>CURL</span>
          </div>
          <div className="col-md-6">
            <span>JSON Response</span>
          </div>
        </div>


      </div>
    );
  }
};
