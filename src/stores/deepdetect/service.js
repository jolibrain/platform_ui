import { observable, computed } from "mobx";
import store from "store";
import autoSave from "../autoSave";
import agent from "../../agent";

export default class deepdetectService {
  @observable settings = {};

  @observable inputs = [];

  @observable serverName = "";
  @observable serverSettings = {};

  @observable isLoading = false;

  @observable trainMetrics = {};

  constructor(opts) {
    this.settings = opts.serviceSettings;

    this.serverName = opts.serverName;
    this.serverSettings = opts.serverSettings;

    autoSave(this, `${this.serverName}_${this.name}`);
  }

  @computed
  get name() {
    return this.settings.name;
  }

  removeStore() {
    store.remove(`${this.serverName}_${this.name}`);
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

  async fetchTrainMetrics(job = 1, timeout = 0, history = false) {
    this.trainMetrics = await this.$reqTrainMetrics(job, timeout, history);
  }
}
