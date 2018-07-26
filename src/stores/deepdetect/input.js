import { observable, computed } from "mobx";

export default class Input {
  @observable isActive = false;
  @observable content = {};
  @observable postData = {};
  @observable path = null;
  @observable json = null;
  @observable error = false;
  @observable boxes = [];

  @computed
  get prediction() {
    let prediction = null;

    if (
      this.json &&
      this.json.body &&
      this.json.body.predictions &&
      this.json.body.predictions[0]
    ) {
      prediction = this.json.body.predictions[0];
    }

    return prediction;
  }

  @computed
  get isCtcOuput() {
    return (
      this.postData &&
      this.postData.parameters &&
      this.postData.parameters.output &&
      this.postData.parameters.output.ctc
    );
  }

  @computed
  get isSegmentationInput() {
    return (
      this.postData &&
      this.postData.parameters &&
      this.postData.parameters.input &&
      this.postData.parameters.input.segmentation
    );
  }
}
