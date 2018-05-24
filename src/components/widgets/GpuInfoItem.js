import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

export default class GpuInfoItem extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      detailsVisible: false
    };

    this.toggleDetails = this.toggleDetails.bind(this);
  }

  toggleDetails() {
    this.setState({detailsVisible: !this.state.detailsVisible});
  }

  render() {

    const index = this.props.index;
    const gpu = this.props.gpu;

    const memoryMo = parseInt(gpu['memory.used'], 10);
    const memoryTotal = parseInt(gpu['memory.total'], 10);
    const memoryPercent = parseInt(memoryMo * 100 / gpu['memory.total'], 10);
    const utilPercent = parseInt(gpu['utilization.gpu'], 10);

    return (
      <div key={`gpuInfoItem-${index}`} className="block">

        <div>
          <span className="font-weight-bold">{index}</span>. &nbsp;
          <span className='temp'>{gpu['temperature.gpu']}°C</span>
          ,&nbsp;
          <span className='util'>{utilPercent}%</span>
          ,&nbsp;
          <span className='memUsed text-primary'>{memoryMo}</span> / <span className='memTotal text-secondary'>{memoryTotal}</span> Mo
        </div>

        <div
          className="badge detailsBadge"
          onClick={this.toggleDetails}
        >
          Details <FontAwesomeIcon icon={this.state.detailsVisible ? 'angle-down' : 'angle-right'}/>
        </div>

        <div className="list processList" style={this.state.detailsVisible ? {} : {display: 'none'}}>
          <table class="table table-sm">
            <thead>
              <tr>
                <th scope="col">User</th>
                <th scope="col">PID</th>
                <th scope="col">Memory</th>
              </tr>
            </thead>
            <tbody>
          {
            gpu.processes.map( (process, idx) => {

              let levelMemory = 'secondary';

              if(parseInt(process.gpu_memory_usage, 10) > 2000)
                levelMemory = 'primary';

              return (<tr key={idx}>
                <td>{process.username}</td>
                <td className='processPID'>{process.pid}</td>
                <td><span class={`badge badge-${levelMemory}`}>{process.gpu_memory_usage}M</span></td>
              </tr>);
            })
          }
            </tbody>
          </table>
        </div>
      </div>
    );
  }

}
