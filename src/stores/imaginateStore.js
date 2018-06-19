import { observable, action } from "mobx";
import agent from "../agent";

export class imaginateStore {
  @observable isLoaded = false;
  @observable isRequesting = false;
  @observable settings = {};

  @observable selectedInputIndex = -1;
  @observable selectedInput = null;

  @observable curlParams = null;
  @observable confidence = null;

  @observable server = null;
  @observable service = null;

  @action
  setup(configStore) {
    this.settings = configStore.imaginate;

    this.confidence = this.settings.threshold.confidence;

    this.isLoaded = true;
  }

  @action
  connectToDeepdetect(deepdetectStore) {
    const { server, service } = deepdetectStore;
    this.server = server;
    this.service = service;
    this.selectedInputIndex = -1;
  }

  @action
  setSelectedInput(index) {
    this.selectedInputIndex = index;
    this.selectedInput = null;
    this.predict();
  }

  $reqPostPredict(postData) {
    return agent.Deepdetect.postPredict(this.server.settings, postData);
  }

  @action
  predict() {
    this._initPredictRequest();
    this._predictRequest();
  }

  _initPredictRequest() {
    if (this.service.inputs.length === 0) {
      return null;
    } else if (this.selectedInputIndex === -1) {
      this.selectedInputIndex = 0;
    }

    const input = this.service.inputs[this.selectedInputIndex];

    if (typeof input === "undefined") return null;

    this.isRequesting = true;

    input.json = null;

    input.postData = {
      service: this.service.name,
      parameters: {
        input: {},
        output: {},
        mllib: { gpu: true }
      },
      data: [input.content]
    };

    if (typeof input.path !== "undefined") {
      input.postData.data = [input.path];
    }

    if (this.service.name !== "text") {
      input.postData.parameters.output.confidence_threshold = this.confidence;
    }

    if (this.settings.display.boundingBox && this.service.name !== "text") {
      input.postData.parameters.output.bbox = true;
    }

    if (this.settings.request.best) {
      input.postData.parameters.output.best = parseInt(
        this.settings.request.best,
        10
      );
    }

    if (this.service.settings.mltype === "ctc") {
      input.postData.parameters.output.ctc = true;
      input.postData.parameters.output.confidence_threshold = 0;
      input.postData.parameters.output.blank_label = 0;
      delete input.postData.parameters.output.bbox;
    }

    if (this.settings.request.blank_label) {
      input.postData.parameters.output.blank_label = parseInt(
        this.settings.request.blank_label,
        10
      );
    }

    if (this.service.settings.mltype === "segmentation") {
      input.postData.parameters.input = { segmentation: true };
      input.postData.parameters.output = {};
    }

    if (this.settings.request.objSearch || this.settings.request.imgSearch) {
      input.postData.parameters.output.search = true;
    }

    if (this.settings.request.objSearch) {
      input.postData.parameters.output.rois = "rois";
    }

    this.curlParams = input.postData;
  }

  @action
  async _predictRequest() {
    if (this.service.inputs.length === 0) return null;

    const input = this.service.inputs[this.selectedInputIndex];

    if (typeof input === "undefined") return null;

    input.json = await this.$reqPostPredict(input.postData);

    if (typeof input.json.body === "undefined") {
      input.error = true;
    } else {
      const prediction = input.json.body.predictions[0];
      const classes = prediction.classes;

      if (typeof classes !== "undefined") {
        input.boxes = classes.map(predict => predict.bbox);
      }

      if (
        (this.settings.request.objSearch || this.settings.request.imgSearch) &&
        typeof input.json.body.predictions[0].rois !== "undefined"
      ) {
        input.boxes = prediction.rois.map(predict => predict.bbox);
      }

      input.pixelSegmentation =
        typeof prediction.vals === "undefined" ? [] : prediction.vals;
    }

    this.selectedInput = input;
    this.isRequesting = false;
  }

  @action
  setThreshold(thresholdValue) {
    this.confidence = thresholdValue;
  }

  @action
  addInput(content) {
    this.service.inputs.push({
      content: content,
      json: null,
      boxes: null
    });
    this.setSelectedInput(this.service.inputs.length - 1);
  }

  $reqImgFromPath(path) {
    return agent.Webserver.listFiles(path);
  }

  @action
  async addInputFromPath(nginxPath, systemPath, folderName, callback) {
    const serverInputs = await this.$reqImgFromPath(
      nginxPath + folderName + "/"
    );

    this.service.inputs = [];

    this.service.inputs = serverInputs.map(i => {
      return {
        content: nginxPath + folderName + "/" + i,
        path: systemPath + folderName + "/" + i,
        json: null,
        boxes: null
      };
    });

    if (this.service.inputs.length > 0) this.setSelectedInput(0);

    callback();
  }
}

export default new imaginateStore();
