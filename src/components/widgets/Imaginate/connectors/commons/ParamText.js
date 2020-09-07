import React from "react";

class ParamText extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      param: ""
    };

    this.updateInput = this.updateInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  updateInput(event) {
    this.setState({ param: event.target.value });
  }

  handleSubmit() {
    this.props.onSubmit(this.state.param);
  }

  render() {
    return (
      <div className="card text">
        <div className="card-body">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              onChange={this.updateInput}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={this.handleSubmit}
              >
                {this.props.submitText}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default ParamText;
