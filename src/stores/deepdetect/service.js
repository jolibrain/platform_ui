import { action, observable, computed, toJS } from "mobx";
import store from "store";
import autoSave from "../autoSave";
import agent from "../../agent";

import ServiceConstants from "../../constants/ServiceConstants";

export class Input {
  @observable content = {};
  @observable postData = {};
  @observable path = null;
  @observable json = null;
  @observable error = false;
  @observable boxes = [];
}

export default class deepdetectService {
  @observable
  status = {
    client: ServiceConstants.CLIENT_STATUS.NONE,
    server: ServiceConstants.SERVER_STATUS.NONE
  };

  @observable settings = {};

  @observable serverName = "";
  @observable serverSettings = {};

  @observable inputs = [];
  @observable selectedInputIndex = -1;

  @observable confidence = null;

  @observable jobId = null;
  @observable trainMeasure = null;
  @observable trainMeasureHist = null;

  constructor(opts) {
    this.settings = opts.serviceSettings;

    this.serverName = opts.serverName;
    this.serverSettings = opts.serverSettings;

    autoSave(this, `autosave_service_${this.serverName}_${this.settings.name}`);
  }

  async serviceInfo() {
    const info = await this.$reqServiceInfo();

    if (info.body.jobs.length > 0) {
      const job = info.body.jobs[0];
      switch (job.status) {
        case "running":
          this.status.server = ServiceConstants.SERVER_STATUS.TRAINING_RUNNING;
          this.jobId = job.job;

          if (!this.trainMeasure) {
            this.fetchTrainMetrics();
          }

          break;
        default:
          this.status.server = ServiceConstants.SERVER_STATUS.TRAINING;
          break;
      }
    }

    return info;
  }

  @computed
  get isRequesting() {
    return this.status.client === ServiceConstants.CLIENT_STATUS.REQUESTING;
  }

  @computed
  get isTraining() {
    return (
      this.status.server === ServiceConstants.SERVER_STATUS.TRAINING_RUNNING
    );
  }

  @computed
  get requestType() {
    let requestType = null;

    switch (this.status.client) {
      case ServiceConstants.CLIENT_STATUS.REQUESTING:
        requestType = "requesting";
        break;
      case ServiceConstants.CLIENT_STATUS.REQUESTING_SERVICE_INFO:
        requestType = "serviceInfo";
        break;
      case ServiceConstants.CLIENT_STATUS.REQUESTING_STOP_TRAINING:
        requestType = "stopTraining";
        break;
      case ServiceConstants.CLIENT_STATUS.REQUESTING_FILES:
        requestType = "files";
        break;
      case ServiceConstants.CLIENT_STATUS.REQUESTING_PREDICT:
        requestType = "predict";
        break;
      case ServiceConstants.CLIENT_STATUS.REQUESTING_TRAINING:
        requestType = "training";
        break;
      default:
        break;
    }

    return requestType;
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
  get urlGetService() {
    const serverPath = this.serverSettings.path;
    return `${serverPath}/services/${this.name}`;
  }

  @computed
  get urlTraining() {
    if (!this.jobId) {
      return null;
    }

    const serverPath = this.serverSettings.path;
    return `${serverPath}/train?service=${this.name}&job=${
      this.jobId
    }&parameters.output.measure_hist=true&parameters.output.max_hist_points=1000`;
  }

  @action
  async fetchTrainMetrics() {
    if (!this.jobId) {
      return null;
    }

    const trainMetrics = await this.$reqTrainMetrics();

    if (trainMetrics.hasOwnProperty("body")) {
      this.trainMeasure = trainMetrics.body.measure;
      this.trainMeasureHist = trainMetrics.body.measure_hist;
    } else {
      this.trainMeasure = null;
      this.trainMeasureHist = null;
    }
  }

  @action
  addInput(content) {
    const input = new Input();
    input.content = content;
    this.inputs.push(input);
    this.selectedInputIndex = this.inputs.length - 1;
  }

  @action
  async addInputFromPath(nginxPath, systemPath, folderName, callback) {
    const serverInputs = await this.$reqImgFromPath(
      nginxPath + folderName + "/"
    );

    this.inputs = [];

    this.inputs = serverInputs.map(i => {
      let input = new Input();
      input.content = nginxPath + folderName + "/" + i;
      input.path = systemPath + folderName + "/" + i;
      return input;
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

    this.status.client = ServiceConstants.CLIENT_STATUS.REQUESTING;

    this._initPredictRequest(widgetSettings);
    this._predictRequest(widgetSettings);

    this.status.client = ServiceConstants.CLIENT_STATUS.NONE;
  }

  @action
  stopTraining(callback) {
    if (this.settings.training) {
      this.$reqStopTraining().then(callback);
    }
  }

  async $reqImgFromPath(path) {
    this.status.client = ServiceConstants.CLIENT_STATUS.REQUESTING_FILES;
    const info = await agent.Webserver.listFiles(path);
    this.status.client = ServiceConstants.CLIENT_STATUS.NONE;
    return info;
  }

  async $reqPostPredict() {
    this.status.client = ServiceConstants.CLIENT_STATUS.REQUESTING_PREDICT;
    const info = await agent.Deepdetect.postPredict(
      this.serverSettings,
      toJS(this.selectedInput.postData)
    );
    this.status.client = ServiceConstants.CLIENT_STATUS.NONE;
    return info;
  }

  async $reqTrainMetrics(job = 1, timeout = 0, history = false) {
    this.status.client = ServiceConstants.CLIENT_STATUS.REQUESTING_TRAINING;
    const info = await agent.Deepdetect.getTrain(
      this.serverSettings,
      this.name,
      this.jobId, // job id
      0, // timeout
      false, // history
      10000 // max history points
    );
    this.status.client = ServiceConstants.CLIENT_STATUS.NONE;
    return info;
  }

  async $reqServiceInfo() {
    this.status.client = ServiceConstants.CLIENT_STATUS.REQUESTING_SERVICE_INFO;
    const info = await agent.Deepdetect.getService(
      this.serverSettings,
      this.name
    );
    this.status.client = ServiceConstants.CLIENT_STATUS.NONE;
    return info;
  }

  async $reqStopTraining() {
    this.status.client =
      ServiceConstants.CLIENT_STATUS.REQUESTING_STOP_TRAINING;
    const info = await agent.Deepdetect.stopTraining(
      this.serverSettings,
      this.name
    );
    this.status.client = ServiceConstants.CLIENT_STATUS.NONE;
    return info;
  }

  _initPredictRequest(settings) {
    let input = this.selectedInput;

    if (typeof input === "undefined") return null;

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

    if (input.path) {
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

    if (settings.request.objSearch || this.settings.mltype === "rois") {
      input.postData.parameters.output.search = true;
      input.postData.parameters.output.rois = "rois";
      delete input.postData.parameters.output.bbox;
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
        (settings.request.objSearch ||
          settings.request.imgSearch ||
          this.settings.mltype === "rois") &&
        typeof input.json.body.predictions[0].rois !== "undefined"
      ) {
        input.boxes = prediction.rois.map(predict => predict.bbox);
      }
    }
  }
}
