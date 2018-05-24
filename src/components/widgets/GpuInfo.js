import React from 'react';
import { inject, observer } from 'mobx-react';

@inject('configStore')
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
    const refreshRate = this.props.configStore.gpuInfo.refreshRate;
    var intervalId = setInterval(this.timer.bind(this), refreshRate);
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
            const memoryTotal = parseInt(gpu['memory.total'], 10);
            const memoryPercent = parseInt(memoryMo * 100 / gpu['memory.total'], 10);
            const utilPercent = parseInt(gpu['utilization.gpu'], 10);

            return (
              <div key={`gpuInfo${index}`} className="block">

                <div className="context-header">
                  <div className="sidebar-context-title">[{index}] {gpu.name}</div>
                  <p>
                    <span className='temp'>{gpu['temperature.gpu']}°C</span>, <span className='util'>{utilPercent}%</span>
                    <br/>
                    <span className='memUsed'>{memoryMo}</span> / <span className='memTotal'>{memoryTotal}</span> Mo
                  </p>
                </div>

                <div className="list processList">
                  <ul>
                  {
                    gpu.processes.map( (process, idx) => {

                      return (<li key={idx}>
                        <span className='processUsername'>{process.username}</span>
                        /
                        <span className='processCommand'>{process.command}</span>
                        /
                        <span className='processPID'>{process.pid}</span>
                        &nbsp;(<span className='processMemory'>{process.gpu_memory_usage}M</span>)
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
