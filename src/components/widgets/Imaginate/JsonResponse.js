import React from 'react';
import { inject, observer } from 'mobx-react';

import {Controlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';

@inject('imaginateStore')
@observer
export default class JsonResponse extends React.Component {

  render() {

    const store = this.props.imaginateStore;

    return (
      <div>
        <h6>JSON response</h6>
        <CodeMirror
          value={JSON.stringify(store.selectedImage.json, null, 1)}
        />
      </div>
    );
  }

}

