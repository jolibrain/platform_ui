import React from 'react';
import { inject, observer } from 'mobx-react';

@inject('imaginateStore')
@observer
export default class JsonResponse extends React.Component {

  render() {
    const store = this.props.imaginateStore;
    return (
    <div>
      <h6>JSON response</h6>
      <code>{JSON.stringify(store.selectedImage.json, null, 2)}</code>
    </div>
    );
  }

}

