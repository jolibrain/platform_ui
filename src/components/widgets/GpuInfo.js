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
    var intervalId = setInterval(this.timer.bind(this), 5000);
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

            const memoryMo = parseInt(gpu['memory.used'], 10);
            const memoryPercent = parseInt(memoryMo * 100 / gpu['memory.total'], 10);
            const utilPercent = parseInt(gpu['utilization.gpu'], 10);

            return (
              <div key={`gpuInfo${index}`} className="block">

                <div className="context-header">
                  <div className="sidebar-context-title">GPU {index}</div>
                </div>

                <div className='row'>
                  <div className='col-md-2'>
                    Mem.:
                  </div>
                  <div className='col-md-10'>
                    <div className="progress">
                      <div className="progress-bar" role="progressbar" style={{width: `${memoryPercent}%`}} aria-valuenow={memoryPercent} aria-valuemin="0" aria-valuemax="100">{memoryMo}Mo</div>
                    </div>
                  </div>
                </div>

                <div className='row'>
                  <div className='col-md-2'>
                    Util.:
                  </div>
                  <div className='col-md-10'>
                    <div className="progress">
                      <div className="progress-bar" role="progressbar" style={{width: `${utilPercent}%`}} aria-valuenow={utilPercent} aria-valuemin="0" aria-valuemax="100">{utilPercent}%</div>
                    </div>
                  </div>
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
