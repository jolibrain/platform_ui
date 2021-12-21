import React from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";

import { Typeahead } from "react-bootstrap-typeahead";

import "react-bootstrap-typeahead/css/Typeahead.css";

import Boundingbox from "react-bounding-box";

@inject("datasetStore")
@observer
class CompareImagesBbox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdown: false,
      filterDatasetName: "",
      selectedDataset: null,
      selectedDatasetItemIndex: 0,
    };

    this.typeaheadRef = React.createRef();

    this.handleDatasetChange = this.handleDatasetChange.bind(this);
    this.handleDatasetItemClick = this.handleDatasetItemClick.bind(this);

    this.handleDatasetFilter = this.handleDatasetFilter.bind(this);
    this.cleanDatasetFilter = this.cleanDatasetFilter.bind(this);
  }

  handleDatasetChange() {
    let { datasets } = this.props.datasetStore;
    const inputRef = this.typeaheadRef.current;
    this.setState({
      selectedDataset: datasets.find(d =>
                                     d.name === inputRef.getInput()
                                    ),
      selectedDatasetItemIndex: 0
    })
  }

  handleDatasetItemClick(event, index) {
    this.setState({selectedDatasetItemClick: index})
  }

  handleDatasetFilter(event) {
    this.setState({ filterServiceName: event.target.value });
  }

  cleanDatasetFilter(event) {
    this.setState({ filterServiceName: "" });
  }

  render() {
    const { datasetStore, service } = this.props;
    const {
      filterDatasetName,
      selectedDataset,
      selectedDatasetItemIndex
    } = this.state;

    const selectedDatasetItems = selectedDataset ?
          selectedDataset.items : [];

    const selectedDatasetItem = selectedDatasetItems.length > 0 ?
          selectedDatasetItems[selectedDatasetItemIndex] : null;

    let { datasets } = datasetStore;

    if (filterDatasetName && filterDatasetName.length > 0) {
      datasets = datasets.filter(r => {
        return r.name.includes(filterDatasetName)
      });
    }

    if (!service || (!service.jsonMetrics && !service.respInfo)) return null;

    return (
        <div className="trainingmonitorCompare row">
          <div className='col-12 selectDataset'>
            <Typeahead
              id="inlineFormInputDataset"
              ref={this.typeaheadRef}
              placeholder={
                datasetStore.isLoading
                  ? "Fetching datasets..."
                  : "Select dataset"
              }
              options={datasets.map(d => d.name)}
              onChange={this.handleDatasetChange}
            />
          </div>
          <div className='row'>
          {
            selectedDataset ?
              <>
                <div className='col-5 bboxDisplay bboxTruth'>
                  <h5>Ground Truth</h5>
                  <img
                    src={selectedDatasetItem.path}
                  />
                </div>
                <div className='col-5 bboxDisplay bboxPredicted'>
                  <h5>Predicted</h5>
                  <Boundingbox
                    image={selectedDatasetItem.path}
                    boxes={selectedDatasetItem.boxes}
                  />
                </div>
                <div className='col-2 imageSelection'>
                  <h5>Input selection</h5>
                  {
                    this.state.selectedDataset.items.map(item => {
                      return (
                        <span className="placeholder col-6">
                          <img src={item.path} alt={item.name}/>
                          <span>Map: {item.metrics.map}</span>
                        </span>
                      );
                    })
                  }

                </div>
              </>
              :
              null
          }
          </div>
        </div>
    );
  }
}

CompareImagesBbox.propTypes = {
  service: PropTypes.array.isRequired
};
export default CompareImagesBbox;
