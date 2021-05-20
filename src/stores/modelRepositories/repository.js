import { observable, computed, action, runInAction } from "mobx";
import agent from "../../agent";

export default class Repository {
  @observable path;
  @observable files;
  @observable store;

  @observable fetchError = null;

  @observable jsonConfig = null;
  @observable jsonMetrics = null;
  @observable bestModel = null;

  @observable metricsDate = null;

  @observable files = [];
  @observable benchmarks = [];

  constructor(path, files, store, fetchError = null) {
    this.isRepository = true;
    this.path = path;
    this.files = files;
    this.store = store;
    this.fetchError = fetchError;

    this._load();
  }

  @computed
  get mltype() {
    if (
      !this.jsonMetrics ||
      !this.jsonMetrics.body ||
      !this.jsonMetrics.body.mltype
    )
      return null;

    return this.jsonMetrics.body.mltype;
  }

  metricsValue(attr) {

    let value = '--';
    let metricKey = attr;

    if (!this.jsonMetrics)
      return value;

    const { measure, measure_hist } = this.jsonMetrics.body;

    // Some accuracy values are stored in acc or accp metrics field
    // Modify input metric key if this field is not the correct target
    if(
      metricKey === "acc" &&
        typeof measure[metricKey] === "undefined" &&
        typeof measure["accp"] !== "undefined"
    ) {
      metricKey = "accp";
    } else if (
      metricKey === "accp" &&
        typeof measure[metricKey] === "undefined" &&
        typeof measure["acc"] !== "undefined"
    ) {
      metricKey = "acc";
    }

    if (measure && measure[metricKey]) {
      value = measure[metricKey];
    } else if (
      measure_hist &&
      measure_hist[`${metricKey}_hist`] &&
      measure_hist[`${metricKey}_hist`].length > 0
    ) {
      value =
        measure_hist[`${metricKey}_hist`][measure_hist[`${metricKey}_hist`].length - 1];
    }

    return value;
  }

  metricsBestValue(attr) {

    let value = '--';
    let metricKey = attr;

    if (!this.jsonMetrics)
      return value;

    const measure_hist = this.jsonMetrics
      ? this.jsonMetrics.body.measure_hist
      : this.measure_hist;

    // Some accuracy values are stored in acc or accp metrics field
    // Modify input metric key if this field is not the correct target
    if(
      metricKey === "acc" &&
        typeof measure_hist[`${metricKey}_hist`] === "undefined" &&
        typeof measure_hist["accp_hist"] !== "undefined"
    ) {
      metricKey = "accp";
    } else if (
      metricKey === "accp" &&
        typeof measure_hist[`${metricKey}_hist`] === "undefined" &&
        typeof measure_hist["acc_hist"] !== "undefined"
    ) {
      metricKey = "acc";
    }

    if (
      measure_hist &&
      measure_hist[`${metricKey}_hist`] &&
      measure_hist[`${metricKey}_hist`].length > 0
    ) {

      if(['acc', 'accp', 'meaniou', 'map', 'f1'].includes(metricKey)) {
        value = Math.max.apply(Math, measure_hist[`${metricKey}_hist`])
      } else {
        // train_loss, L1_mean_error, mcll, eucll
        value = Math.min.apply(Math, measure_hist[`${metricKey}_hist`])
      }
    }

    return value;
  }

  @computed
  get benchmarksPath() {
    return this.path + '/benchmarks';
  }

  @computed
  get tags() {
    return this.path.split("/").filter(p => p.length > 0);
  }

  @computed
  get trainingTags() {
    return this.path.split("/").filter(p => {
      return (
        p.length > 0 && p !== "models" && p !== "training" && p !== this.name
      );
    });
  }

  @computed
  get name() {
    return this.path
      .split("/")
      .filter(p => p.length > 0)
      .pop();
  }

  @computed
  get location() {
    return this.store.systemPath + this.path;
  }

  @computed
  get downloadableFiles() {
    const caffemodelFile = this.files
      .filter(f => f.includes("caffemodel"))
      .sort((a, b) => {
        return parseInt(b.match(/\d+/), 10) - parseInt(a.match(/\d+/), 10);
      })
      .slice(0, 1);

    const variousFiles = this.files.filter(f => {
      return (
        ["config.json", "vocab.dat", "corresp.txt"].includes(f) ||
        f.includes("prototxt")
      );
    });

    return caffemodelFile
      .concat(variousFiles)
      .filter(f => f.indexOf("~") === -1);
  }

  @computed
  get measure_hist() {
    if (
      !this.jsonMetrics ||
      !this.jsonMetrics.body ||
      !this.jsonMetrics.body.measure_hist
    )
      return null;

    return this.jsonMetrics.body.measure_hist;
  }

  @computed
  get isTimeseries() {
      return this.jsonConfig &&
        this.jsonConfig.parameters &&
        this.jsonConfig.parameters.input &&
        this.jsonConfig.parameters.input.connector &&
        this.jsonConfig.parameters.input.connector === "csvts"
  }

  _load() {
    this._loadJsonConfig();
    this._loadJsonMetrics();
    this._loadBestModel();
    this._loadBenchmarks();

    // Set metrics date if it hasn't already been done
    if (
      !this.files.some(f =>
        ["config.json", "best_model.txt", "metrics.json"].includes(f)
      )
    ) {
      this._setMetricsDate();
    }
  }

  @action.bound
  async deleteArchivedJob() {
    const isDeleted = await this.$reqDeleteArchivedJob();
    this.store.removeRepository(this.path);
    return isDeleted;
  }

  @action.bound
  async _setMetricsDate() {
    // Do not try to fetch large files
    const filenames = this.files.filter(f => {
      return (
        (f.includes("json") || f.includes("txt")) &&
        !(
          f.includes("caffemodel") ||
          f.includes("log") ||
          f.includes("solverstate")
        )
      );
    });

    if (filenames.length > 0) {
      try {
        const meta = await agent.Webserver.getFileMeta(
          `${this.path}${filenames[0]}`
        );
        this.metricsDate = meta.header["last-modified"];
      } catch (e) {}
    }
  }

  @action.bound
  async _loadJsonConfig() {
    try {
      const meta = await this.$reqJsonConfig();

      this.metricsDate = meta.header["last-modified"];
      this.jsonConfig = meta.content;

      // TODO : remove this line when config.json editable
      this.jsonConfig.parameters.mllib.gpuid = 0;

      // delete this parameter from server config
      // it'd create an issue when creating a new service
      // from PredictHome 'Add Service' button
      //
      // it's generated when creating a new Service with
      // the Publish button from Archived Training Jobs
      this.jsonConfig.parameters.mllib.from_repository = null;
    } catch (e) {}
  }

  @action.bound
  async _loadJsonMetrics() {
    try {
      const meta = await this.$reqJsonMetrics();
      this.jsonMetrics = meta.content;
      this.metricsDate = meta.header["last-modified"];
    } catch (err) {
      //console.log(`Error while loading repository json metrics - ${this.name} - ${err}`)
    }
  }

  @action
  async _loadBestModel() {
    try {
      let bestModel = {};
      const meta = await this.$reqBestModel();
      this.metricsDate = meta.header["last-modified"];
      const bestModelTxt = meta.content;

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

  @action
  async _loadBenchmarks() {
    try {
      let benchmarks = [];

      const benchmarkFiles = await this.$reqBenchmarks();
      const benchmarkJsons = benchmarkFiles.files.filter(f =>
        f.endsWith(".json")
      );

      if (benchmarkJsons && benchmarkJsons.length > 0) {
        for (let i = 0; i < benchmarkJsons.length; i++) {
          const href = benchmarkJsons[i];
          const benchmark = await this.$reqBenchmarkJson(href);

          benchmarks.push({
            name: href.replace(".json", ""),
            href: href,
            benchmark: benchmark
          });
        }
      }

      runInAction(() => {
        this.benchmarks = benchmarks;
      });
    } catch (e) {
      //console.log(e);
    }
  }

  $reqJsonMetrics() {
    if (!this.files.includes("metrics.json")) return null;
    return agent.Webserver.getFileMeta(`${this.path}metrics.json`);
  }

  $reqBestModel() {
    if (!this.files.includes("best_model.txt")) return null;
    return agent.Webserver.getFileMeta(`${this.path}best_model.txt`);
  }

  $reqBenchmarks() {
    return agent.Webserver.listFolders(`${this.path}benchmarks/`);
  }

  $reqBenchmarkJson(href) {
    return agent.Webserver.getFile(`${this.path}benchmarks/${href}`);
  }

  $reqJsonConfig() {
    if (!this.files.includes("config.json")) return null;
    return agent.Webserver.getFileMeta(`${this.path}config.json`);
  }

  $reqDeleteArchivedJob() {
    const fileserverPath = this.path.replace(
      /^\/models\/training\//i,
      '/filebrowser/api/resources/training_jobs/'
    )
    return agent.Webserver.deletePath(fileserverPath)
  }
}
