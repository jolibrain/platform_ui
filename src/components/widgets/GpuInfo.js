import React from 'react';
import { inject, observer } from 'mobx-react';

@inject('gpuStore')
@observer
export default class GpuInfo extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      intervalId: null
    };

    this.timer();

  }

  componentDidMount() {
    var intervalId = setInterval(this.timer.bind(this), 1000);
    this.setState({intervalId: intervalId});
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  timer() {
    this.props.gpuStore.loadGpuInfo();
  }

  render() {

    const { gpuInfo } = this.props.gpuStore;

    if(gpuInfo == null)
      return null;

    return (
      <div className="block">
        <div className="context-header">
          <div className="sidebar-context-title">Infra</div>
        </div>

        {
          gpuInfo.gpus.map( (gpu, index) => {

            const percent = parseInt(gpu['memory.used'] * 100 / gpu['memory.total'], 10);

            return (
              <div className="progress" key={`progress${index}`}>
                <div className="progress-bar" role="progressbar" style={{width: `${percent}%`}} aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100">GPU {index}</div>
              </div>
            );
          })
        }

      </div>
    );
  }

}
