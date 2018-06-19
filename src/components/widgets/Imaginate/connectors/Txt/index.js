import React from "react";

import InputList from "./InputList";
import InputForm from "./InputForm";

import Description from "../commons/Description";
import CardCommands from "../commons/CardCommands";

export default class TxtConnector extends React.Component {
  render() {
    return (
      <div className="imaginate">
        <div className="row">
          <div className="col-md-7">
            <div className="row">
              <InputList />
            </div>
          </div>
          <div className="col-md-5">
            <div className="row">
              <InputForm />
            </div>
            <div className="row description">
              <Description />
            </div>
            <div className="row commands">
              <CardCommands />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
