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

    return (<div>
        {
          gpuInfo.gpus.map( (gpu, index) => {

            const memoryPercent = parseInt(gpu['memory.used'] * 100 / gpu['memory.total'], 10);
            const utilPercent = parseInt(gpu['utilization.gpu'], 10);

            return (
              <div key={`gpuInfo${index}`} className="block">
                <div className="context-header">
                  <div className="sidebar-context-title">GPU {index}</div>
                </div>
                <div className="progress">
                  <div className="progress-bar" role="progressbar" style={{width: `${memoryPercent}%`}} aria-valuenow={memoryPercent} aria-valuemin="0" aria-valuemax="100">Memory {index}</div>
                </div>
                <div className="progress">
                  <div className="progress-bar" role="progressbar" style={{width: `${utilPercent}%`}} aria-valuenow={utilPercent} aria-valuemin="0" aria-valuemax="100">Util. {index}</div>
                </div>
                <div className="list">
                  <ul>
                  {
                    gpu.processes.map( process => {

                      return (<li>
                        {process.username} ({process.gpu_memory_usage}Mo)
                      </li>);
                    })
                  }
                  </ul>
                </div>
              </div>
            );
          })
        }

      </div>
    );
  }

}
