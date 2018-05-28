import React from 'react';
import {inject, observer} from 'mobx-react';

@inject('imaginateStore')
@observer
export default class Threshold extends React.Component {

  render() {

    const store = this.props.imaginateStore;

    if (
      store.selectedImage === null ||
      !store.settings.threshold.controls
    ) {
      return null;
    }

    let thresholds = [
      {
        name: 'Salient',
        value: store.settings.threshold.thresholdControlSteps[0],
        classNames: 'btn btn-secondary',
      },
      {
        name: 'Medium',
        value: store.settings.threshold.thresholdControlSteps[1],
        classNames: 'btn btn-secondary',
      },
      {
        name: 'Detailed',
        value: store.settings.threshold.thresholdControlSteps[2],
        classNames: 'btn btn-secondary',
      },
    ];

    return (
      <div className="btn-group" role="group" aria-label="Threshold controls">
        {
          thresholds.map(config => {
            return (
              <button
                type="button"
                className={config.classNames}
                onClick={this.handleClick.bind(this, config.value)}
              >
                {config.name}
              </button>
            );
          })
        }
      </div>
    );

  }

}

