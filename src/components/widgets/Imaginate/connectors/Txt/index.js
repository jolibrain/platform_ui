import React from "react";

import InputList from "./InputList";
import InputForm from "./InputForm";

import Description from "../commons/Description";
import CardCommands from "../commons/CardCommands";

export default class TxtConnector extends React.Component {
  render() {
    return (
      <div className="imaginate txtConnector">
        <div className="row">
          <div className="col-md-7">
            <InputList />
          </div>
          <div className="col-md-5">
            <InputForm />
            <div className="description">
              <Description displayFormat="simple" />
            </div>
            <div className="commands">
              <CardCommands />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
