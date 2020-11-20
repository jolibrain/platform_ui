import { observable, computed } from "mobx";
import agent from "../../agent";

export default class Input {
  @observable isActive = false;

  @observable content = {};

  @observable postData = {};
  @observable putData = {};

  @observable path = null;
  @observable json = null;

  @observable boxes = [];

  @observable csv = null;

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
  get hasPredictionValues() {
    return (
      this.json &&
      this.json.body &&
      this.json.body.predictions &&
      this.json.body.predictions[0] &&
      this.json.body.predictions[0].vals
    );
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

  @computed
  get isChainResult() {
    return (
      this.json &&
      this.json.head &&
      this.json.head.method &&
      this.json.head.method === "/chain"
    );
  }

  async loadContent() {
    let content = null;

    try {
      content = await agent.Webserver.getFile(this.content);
    } catch (e) {
      console.log(e)
    }

    return content;
  }
}
