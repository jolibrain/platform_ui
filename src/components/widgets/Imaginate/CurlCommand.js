import React from 'react';
import { inject, observer } from 'mobx-react';

@inject('imaginateStore')
@observer
export default class CurlCommand extends React.Component {

  render() {
    const store = this.props.imaginateStore;
    return (
    <div>
      <h6>CURL</h6>
      <code>{`curl -X POST 'http://localhost:8000/predict' -d '${JSON.stringify(store.selectedImage.postData, null, 2)}'`}</code>
    </div>
    );
  }

}

