import React from 'react';
import { inject, observer } from 'mobx-react';

@inject('commonStore')
@observer
export default class ServiceNew extends React.Component {

  render() {
    return (
      <div className="block">
        <div className="context-header">
          <div className="sidebar-context-title">New service</div>
        </div>

        <form>
          <div className="form-row align-items-center">
            <div className="col-auto">
              <label className="sr-only" htmlFor="inlineFormInputName">Name</label>
              <input type="text" className="form-control mb-2" id="inlineFormInputName" placeholder="Service Name"></input>
            </div>
            <div className="col-auto">
              <label className="sr-only" htmlFor="inlineFormInputDescription">Description</label>
              <input type="text" className="form-control mb-2" id="inlineFormInputDescription" placeholder="Description"></input>
            </div>
            <div className="col-auto">
              <label className="sr-only" htmlFor="inlineFormInputMlLib">MlLib</label>
              <input type="text" className="form-control mb-2" id="inlineFormInputMlLib" placeholder="MlLib" value="caffe"></input>
            </div>
            <div className="col-auto">
              <label className="sr-only" htmlFor="inlineFormInputRepository">Repository</label>
              <input type="text" className="form-control mb-2" id="inlineFormInputRepository" placeholder="Repository" value="/opt/eris/data1/alx/deepdetect-js/n20"></input>
            </div>
            <div className="col-auto">
              <label className="sr-only" htmlFor="inlineFormInputData">Data</label>
              <input type="text" className="form-control mb-2" id="inlineFormInputData" placeholder="Data" value="/opt/eris/data1/alx/deepdetect-js/n20/news20"></input>
            </div>
            <div className="col-auto">
              <button type="submit" className="btn btn-primary mb-2">Add Service</button>
            </div>
          </div>
        </form>

      </div>
    );
  }

}
