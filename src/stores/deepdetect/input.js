import { makeAutoObservable } from "mobx";
import agent from "../../agent";

export default class Input {
  isActive = false;
  isBase64 = false;

  content = {};

  postData = {};
  putData = {};

  path = null;
  json = null;

  boxes = [];

  csv = null;

  constructor() {
    makeAutoObservable(this);
  }

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

  get hasPredictionValues() {
    return (
      this.json &&
      this.json.body &&
      this.json.body.predictions &&
      this.json.body.predictions[0] &&
      this.json.body.predictions[0].vals
    );
  }

  get isCtcOuput() {
    return (
      this.postData &&
      this.postData.parameters &&
      this.postData.parameters.output &&
      this.postData.parameters.output.ctc
    );
  }

  get isSegmentationInput() {
    return (
      this.postData &&
      this.postData.parameters &&
      this.postData.parameters.input &&
      this.postData.parameters.input.segmentation
    );
  }

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
