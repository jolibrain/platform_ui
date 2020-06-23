import { action, observable, computed, toJS, runInAction } from "mobx";
import store from "store";

import moment from "moment";

import Input from "./input";

import autoSave from "../autoSave";
import agent from "../../agent";

import ServiceConstants from "../../constants/ServiceConstants";

export default class deepdetectService {
  @observable isActive = false;

  @observable
  status = {
    client: ServiceConstants.CLIENT_STATUS.NONE,
    server: ServiceConstants.SERVER_STATUS.NONE
  };

  @observable settings = {};

  @observable serverName = "";
  @observable serverSettings = {};

  @observable inputs = [];

  @observable confidence = null;

  @observable respInfo = null;
  @observable respTraining = null;
  @observable respTrainMetrics = null;

  @observable respBestModel = null;
  @observable bestModel = null;

  @observable refresh = Math.random();

  @observable uiParams = {};

  constructor(opts) {
    this.settings = opts.serviceSettings;

    // Proper settings for various mltypes
    if (typeof this.settings.mltype !== "undefined") {
      switch (this.settings.mltype) {
        case "classification":
          break;

        case "segmentation":
          this.settings.segmentationConfidence = false;
          break;

        case "instance_segmentation":
          // Allows segmentation mask output display
          // It modifies parameters.output.mask boolean inside predict request
          this.settings.segmentationMask = true;
          break;

        default:
          break;
      }
    }

    if (typeof this.settings.request === "undefined")
      this.settings.request = {};

    this.serverName = opts.serverName;
    this.serverSettings = opts.serverSettings;

    autoSave(this, `autosave_service_${this.serverName}_${this.settings.name}`);
    this.serviceInfo();
  }

  async serviceInfo() {
    this.respInfo = await this.$reqServiceInfo();

    const hasJobs =
      this.respInfo &&
      this.respInfo.body &&
      this.respInfo.body.jobs &&
      this.respInfo.body.jobs.length > 0;

    if (hasJobs) this.trainInfo();

    // Allow search on unsupervised classification services
    if (typeof this.type !== "undefined" && this.type === "unsupervised")
      this.uiParams.unsupervisedSearch = false;

    return this.respInfo;
  }

  async trainInfo() {
    this.respTraining = await this.$reqTrainInfo();
    this.respTrainMetrics = await this.$reqTrainMetrics();

    this._loadBestModel();

    this.refresh = Math.random();
    return this.respTraining;
  }

  @computed
  get isRequesting() {
    return (
      this.status.client === ServiceConstants.CLIENT_STATUS.REQUESTING ||
      this.status.client === ServiceConstants.CLIENT_STATUS.REQUESTING_FILES ||
      this.status.client ===
        ServiceConstants.CLIENT_STATUS.REQUESTING_PREDICT ||
      this.status.client === ServiceConstants.CLIENT_STATUS.REQUESTING_TRAINING
    );
  }

  @computed
  get isTraining() {
    return (
      this.respTraining &&
      this.respTraining.head &&
      this.respTraining.head.status === "running"
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
  get type() {
    if (this.respInfo && this.respInfo.body) {
      return this.respInfo.body.type;
    }
  }

  @computed
  get selectedInput() {
    return this.inputs.find(i => i.isActive);
  }

  @computed
  get urlGetService() {
    const serverPath = this.serverSettings.path;
    return `${serverPath}/services/${this.name}`;
  }

  @computed
  get trainJob() {
    let jobId = null;

    if (this.respInfo && this.respInfo.body && this.respInfo.body.jobs) {
      const hasJobs = this.respInfo.body.jobs.length > 0;
      if (hasJobs) jobId = this.respInfo.body.jobs[0].job;
    }

    return jobId;
  }

  @computed
  get measure() {
    let value = null;

    if (
      !this.isTraining &&
      this.respTrainMetrics &&
      this.respTrainMetrics.body
    ) {
      value = this.respTrainMetrics.body.measure;
    } else if (this.respTraining && this.respTraining.body) {
      value = this.respTraining.body.measure;
    }

    return value;
  }

  @computed
  get measure_hist() {
    let value = null;

    if (
      !this.isTraining &&
      this.respTrainMetrics &&
      this.respTrainMetrics.body
    ) {
      value = this.respTrainMetrics.body.measure_hist;
    } else if (this.respTraining && this.respTraining.body) {
      value = this.respTraining.body.measure_hist;
    }

    return value;
  }

  @computed
  get urlTraining() {
    if (!this.trainJob) {
      return null;
    }

    const serverPath = this.serverSettings.path;
    return `${serverPath}/train?service=${this.name}&job=${this.trainJob}&parameters.output.measure_hist=true&parameters.output.max_hist_points=1000`;
  }

  @computed
  get descriptionDisplayFormat() {}

  @computed
  get gpuid() {
    let gpuid = "--";

    if (
      this.respInfo &&
      this.respInfo.body &&
      this.respInfo.body.parameters &&
      this.respInfo.body.parameters.mllib &&
      this.respInfo.body.parameters.mllib[0] &&
      typeof this.respInfo.body.parameters.mllib[0].gpuid !== "undefined"
    ) {
      gpuid = this.respInfo.body.parameters.mllib[0].gpuid;
    }

    return gpuid;
  }

  @action
  selectInput(index) {
    let input = this.inputs.find(i => i.isActive);

    if (input) input.isActive = false;

    if (this.inputs[index]) this.inputs[index].isActive = true;
  }

  @action
  addInput(content) {
    let activeInput = this.inputs.find(i => i.isActive);
    if (activeInput) {
      activeInput.isActive = false;
    }

    const input = new Input();
    input.content = content;
    input.isActive = true;
    this.inputs.push(input);
  }

  @action
  addOrReplaceInput(index, content) {
    let activeInput = this.inputs.find(i => i.isActive);
    if (activeInput) {
      activeInput.isActive = false;
    }

    const input = new Input();
    input.content = content;
    input.isActive = true;

    if (typeof this.inputs[index] === "undefined") {
      this.inputs.push(input);
    } else {
      this.inputs[index] = input;
    }
  }

  @action
  async addInputFromPath(folder, systemPath, callback) {
    const serverInputs = await this.$reqImgFromPath(folder.path);

    this.inputs = [];

    this.inputs = serverInputs.map(i => {
      let input = new Input();
      input.content = folder.path + i;
      input.path = systemPath + folder.path + i;
      return input;
    });

    if (this.inputs.length > 0) this.inputs[0].isActive = true;

    callback(this.inputs);
  }

  @action
  clearAllInputs() {
    this.inputs = [];
  }

  @action
  clearInput(index) {
    if (index > -1 && this.inputs.length > index - 1) {
      this.inputs.splice(index, 1);
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
  predictChain(widgetSettings = {}, chain) {
    if (this.inputs.length === 0) {
      return null;
    }

    this._chainRequest(widgetSettings, chain);
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

  async $reqPutChain(serverPath = null) {
    this.status.client = ServiceConstants.CLIENT_STATUS.REQUESTING_PREDICT;

    let putServerSettings = this.serverSettings;
    if (serverPath) {
      putServerSettings = { path: serverPath };
    }

    const info = await agent.Deepdetect.putChain(
      putServerSettings,
      moment().milliseconds(),
      toJS(this.selectedInput.putData)
    );
    this.status.client = ServiceConstants.CLIENT_STATUS.NONE;
    return info;
  }

  async $reqTrainInfo(job = 1, timeout = 0, history = false) {
    this.status.client = ServiceConstants.CLIENT_STATUS.REQUESTING_TRAINING;
    const info = await agent.Deepdetect.getTrain(
      this.serverSettings,
      this.name,
      this.trainJob, // job id
      0, // timeout
      false, // history
      10000 // max history points
    );
    this.status.client = ServiceConstants.CLIENT_STATUS.NONE;
    return info;
  }

  async $reqTrainMetrics() {
    this.status.client = ServiceConstants.CLIENT_STATUS.REQUESTING_TRAINING;

    let metrics = null;

    if (this.respInfo && this.respInfo.body && this.respInfo.body.repository) {
      const repository = this.respInfo.body.repository;
      const metricsPath = `${repository
        .replace("/opt/platform", "")
        .replace(/\/$/, "")}/metrics.json`;

      try {
        metrics = await agent.Webserver.getFile(metricsPath);
      } catch (e) {
        // If metrics.json file is not found,
        // use fetch to retrieve metrics data from deepdetect server
        if (e.status && e.status === 404) {
          try {
            let metricResponse = await fetch(this.urlTraining);
            metrics = await metricResponse.json();
          } catch (f) {}
        }
      }
    }

    this.status.client = ServiceConstants.CLIENT_STATUS.NONE;
    return metrics;
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

    // Do not refresh input json when using webcam
    // it avoids flickering issue
    if (this.uiParams.mediaType !== "webcam") input.json = null;

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

    if (this.uiParams.search_nn) {
      input.postData.parameters.output.search_nn = parseInt(
        this.uiParams.search_nn,
        10
      );
    }

    if (this.uiParams.extract_layer) {
      input.postData.parameters.mllib.extract_layer = this.uiParams.extract_layer;
    }

    if (settings.request.multibox_rois) {
      input.postData.parameters.output.multibox_rois = true;
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

        if (this.settings.segmentationConfidence) {
          input.postData.parameters.output.confidences = ["best"];
        }

        break;

      case "classification":
        delete input.postData.parameters.output.bbox;

        // Set parameters.output.search parameter on
        // unsupervised classification service
        // when checkbox selected on service Predict UI
        if (
          typeof this.type !== "undefined" &&
          this.type === "unsupervised" &&
          this.uiParams.unsupervisedSearch
        ) {
          input.postData.parameters.output.search = true;
          delete input.postData.parameters.output.best;
        }

        break;

      case "instance_segmentation":
        if (
          this.settings.segmentationMask ||
          typeof this.settings.segmentationMask === "undefined"
        ) {
          input.postData.parameters.output.mask = true;
          delete input.postData.parameters.output.bbox;
        } else {
          input.postData.parameters.output.bbox = true;
          delete input.postData.parameters.output.mask;
        }

        break;

      case "regression":
        delete input.postData.parameters.output.bbox;
        input.postData.parameters.mllib.regression = true;
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
    let input = this.inputs.find(i => i.isActive);

    if (!input) return null;

    input.json = await this.$reqPostPredict(input.postData);

    // Remove existing boxes from input
    // Avoid keeping boxes from latest predict request
    input.boxes = null;

    if (typeof input.json.body !== "undefined") {
      const prediction = input.json.body.predictions[0];
      const classes = prediction.classes;

      if (
        typeof classes !== "undefined" &&
        this.respInfo.body.mltype !== "classification"
      ) {
        input.boxes = classes.map(predict => predict.bbox);
      }

      if (
        (settings.request.objSearch ||
          settings.request.imgSearch ||
          this.settings.mltype === "rois") &&
        typeof input.json.body.predictions[0].rois !== "undefined" &&
        this.respInfo.body.mltype !== "classification"
      ) {
        input.boxes = prediction.rois.map(predict => predict.bbox);
      }
    }
  }

  @action
  async _chainRequest(settings, chain) {
    let input = this.inputs.find(i => i.isActive);

    if (!input) return null;

    input.postData = null;
    input.json = null;

    chain.calls[0].data = [input.content];

    if (input.path) {
      chain.calls[0].data = [input.path];
    }

    chain.calls[0].parameters.output.confidence_threshold =
      settings.threshold.confidence;

    input.putData = {
      chain: {
        calls: chain.calls
      }
    };

    // Apply min_size_ratio parameters on crop actions
    if (
      this.uiParams &&
      this.uiParams.chain &&
      this.uiParams.chain.min_size_ratio
    ) {
      input.putData.chain.calls.forEach(call => {
        if (
          call.action &&
          call.action.parameters &&
          call.action.parameters.min_size_ratio
        ) {
          call.action.parameters.min_size_ratio = this.uiParams.chain.min_size_ratio;
        }
      });
    }

    // Apply random_crops parameters on crop actions
    if (
      this.uiParams &&
      this.uiParams.chain &&
      this.uiParams.chain.random_crops
    ) {
      input.putData.chain.calls.forEach(call => {
        if (
          call.action &&
          call.action.parameters &&
          call.action.parameters.random_crops
        ) {
          call.action.parameters.random_crops = this.uiParams.chain.random_crops;
        }
      });
    }

    // Apply search_nn parameters on searchable services
    if (this.uiParams && this.uiParams.chain && this.uiParams.chain.search_nn) {
      input.putData.chain.calls.forEach(call => {
        if (
          call.parameters &&
          call.parameters.output &&
          call.parameters.output.search
        ) {
          call.parameters.output.search_nn = parseInt(
            this.uiParams.chain.search_nn,
            10
          );
        }
      });
    }

    input.json = await this.$reqPutChain(chain.serverPath);
    input.boxes = [];

    if (
      input.json &&
      input.json.body &&
      input.json.body.predictions &&
      input.json.body.predictions.length > 0
    ) {
      const prediction = input.json.body.predictions[0];
      const classes = prediction.classes;

      if (
        typeof classes !== "undefined" &&
        this.respInfo.body.mltype !== "classification"
      ) {
        input.boxes = classes.map(predict => predict.bbox);
      }

      if (
        (settings.request.objSearch ||
          settings.request.imgSearch ||
          this.settings.mltype === "rois") &&
        typeof input.json.body.predictions[0].rois !== "undefined" &&
        this.respInfo.body.mltype !== "classification"
      ) {
        input.boxes = prediction.rois.map(predict => predict.bbox);
      }
    }
  }

  @action
  async _loadBestModel() {
    try {
      let bestModel = {};
      this.respBestModel = await this.$reqBestModel();
      const bestModelTxt = this.respBestModel.content;

      // Transform current best_model.txt to json format
      if (bestModelTxt.length > 0) {
        bestModelTxt
          .split("\n")
          .filter(a => a.length > 0)
          .map(a => a.split(":"))
          .forEach(content => {
            bestModel[content[0]] = content[1];
          });
      }

      runInAction(() => {
        this.bestModel = bestModel;
      });
    } catch (e) {
      //console.log(e);
    }
  }

  $reqBestModel() {
    const path = this.respInfo.body.repository.replace("/opt/platform", "");
    return agent.Webserver.getFileMeta(`${path}best_model.txt`);
  }
}
