import { action, observable, computed } from "mobx";
import store from "store";
import autoSave from "../autoSave";
import agent from "../../agent";

export default class deepdetectService {
  @observable settings = {};

  @observable serverName = "";
  @observable serverSettings = {};

  @observable inputs = [];
  @observable selectedInputIndex = -1;

  @observable confidence = null;

  @observable isLoading = false;
  @observable isRequesting = false;

  @observable jobStatus = null;
  @observable trainMeasure = null;
  @observable trainMeasureHist = null;

  constructor(opts) {
    this.settings = opts.serviceSettings;

    this.serverName = opts.serverName;
    this.serverSettings = opts.serverSettings;

    autoSave(this, `autosave_service_${this.serverName}_${this.settings.name}`);
  }

  async serviceInfo() {
    return await this.$reqServiceInfo();
  }

  @computed
  get name() {
    return this.settings.name;
  }

  @computed
  get selectedInput() {
    return this.inputs[this.selectedInputIndex];
  }

  @computed
  get urlTraining() {
    const serverPath = this.serverSettings.path;
    return `${serverPath}/train?service=${this.name}&job=${
      this.jobStatus.job
    }&parameters.output.measure_hist=true`;
  }

  @action
  async trainingStatus() {
    const info = await this.serviceInfo();
    if (info.body.jobs.length > 0) {
      this.jobStatus = info.body.jobs[0];
    } else {
      this.jobStatus = null;
    }
  }

  @action
  async fetchTrainMetrics() {
    this.trainingStatus();
    if (this.settings.training && this.jobStatus.status === "running") {
      const trainMetrics = await this.$reqTrainMetrics(
        this.jobStatus.job,
        0,
        true
      );
      if (trainMetrics.hasOwnProperty("body")) {
        this.trainMeasure = trainMetrics.body.measure;
        this.trainMeasureHist = trainMetrics.body.measure_hist;
      }
    } else {
      this.trainMeasure = null;
      this.trainMeasureHist = null;
    }
  }

  @action
  addInput(content) {
    this.inputs.push({
      content: content,
      json: null,
      boxes: null
    });
    this.selectedInputIndex = this.inputs.length - 1;
  }

  @action
  async addInputFromPath(nginxPath, systemPath, folderName, callback) {
    const serverInputs = await this.$reqImgFromPath(
      nginxPath + folderName + "/"
    );

    this.inputs = [];

    this.inputs = serverInputs.map(i => {
      return {
        content: nginxPath + folderName + "/" + i,
        path: systemPath + folderName + "/" + i,
        json: null,
        boxes: null
      };
    });

    if (this.inputs.length > 0) this.selectedInputIndex = 0;

    callback();
  }

  @action
  clearAllInputs() {
    this.inputs = [];
    this.selectedInputIndex = -1;
  }

  @action
  clearInput(index) {
    if (index > -1 && this.inputs.length > index - 1) {
      this.inputs.splice(index, 1);
    }

    if (this.inputs.length === 0) {
      this.selectedInputIndex = -1;
    }
  }

  @action
  removeStore() {
    store.remove(`autosave_service_${this.serverName}_${this.name}`);
  }

  @action
  predict(widgetSettings = {}) {
    if (this.inputs.length === 0) {
      return null;
    }
    this._initPredictRequest(widgetSettings);
    this._predictRequest(widgetSettings);
  }

  @action
  stopTraining(callback) {
    if (this.settings.training) {
      this.$reqStopTraining().then(callback);
    }
  }

  $reqImgFromPath(path) {
    return agent.Webserver.listFiles(path);
  }

  $reqPostPredict() {
    return agent.Deepdetect.postPredict(
      this.serverSettings,
      this.selectedInput.postData
    );
  }

  $reqTrainMetrics(job = 1, timeout = 0, history = false) {
    return agent.Deepdetect.getTrain(
      this.serverSettings,
      this.name,
      job,
      timeout,
      history
    );
  }

  $reqServiceInfo() {
    return agent.Deepdetect.getService(this.serverSettings, this.name);
  }

  $reqStopTraining() {
    return agent.Deepdetect.stopTraining(this.serverSettings, this.name);
  }

  _initPredictRequest(settings) {
    if (this.selectedInputIndex === -1) {
      this.selectedInputIndex = 0;
    }

    let input = this.inputs[this.selectedInputIndex];

    if (typeof input === "undefined") return null;

    this.isRequesting = true;

    input.json = null;

    input.postData = {
      service: this.name,
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

    if (this.name !== "text") {
      input.postData.parameters.output.confidence_threshold =
        settings.threshold.confidence;
    }

    if (settings.display.boundingBox && this.name !== "text") {
      input.postData.parameters.output.bbox = true;
    }

    if (settings.request.best) {
      input.postData.parameters.output.best = parseInt(
        settings.request.best,
        10
      );
    }

    if (settings.request.blank_label) {
      input.postData.parameters.output.blank_label = parseInt(
        settings.request.blank_label,
        10
      );
    }

    // Switch on service mltype
    switch (this.settings.mltype) {
      case "ctc":
        input.postData.parameters.output.ctc = true;
        input.postData.parameters.output.confidence_threshold = 0;
        input.postData.parameters.output.blank_label = 0;
        delete input.postData.parameters.output.bbox;
        break;
      case "segmentation":
        input.postData.parameters.input = { segmentation: true };
        input.postData.parameters.output = {};
        break;
      default:
        break;
    }

    if (settings.request.objSearch || settings.request.imgSearch) {
      input.postData.parameters.output.search = true;
    }

    if (settings.request.objSearch) {
      input.postData.parameters.output.rois = "rois";
    }
  }

  @action
  async _predictRequest(settings) {
    let input = this.inputs[this.selectedInputIndex];

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
        (settings.request.objSearch || settings.request.imgSearch) &&
        typeof input.json.body.predictions[0].rois !== "undefined"
      ) {
        input.boxes = prediction.rois.map(predict => predict.bbox);
      }

      input.pixelSegmentation = [];
      if (typeof prediction.vals !== "undefined") {
        input.pixelSegmentation = prediction.vals;
      }
    }

    this.isRequesting = false;
  }
}
