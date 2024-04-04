import { makeAutoObservable } from "mobx";
import agent from "../../agent";

export default class Repository {
  path;
  store;

  fetchError = null;

  jsonConfig = null;
  jsonMetrics = null;
  bestModel = null;
  bestModelTest = [];

  metricsDate = null;

  files = [];
  benchmarks = [];

  constructor(path, files, store, fetchError = null) {
    makeAutoObservable(this);
    this.isRepository = true;
    this.path = path;
    this.files = files;
    this.store = store;
    this.fetchError = fetchError;

    this._load();
  }

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

    if (
      !this.jsonMetrics ||
        typeof this.jsonMetrics.body === "undefined"
       )
      return value;

    const {
      measure,
      measure_hist,
    } = this.jsonMetrics.body;

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

    if (
      measure &&
        typeof measure[metricKey] !== 'undefined'
    ) {
      value = measure[metricKey];
    } else if (
      measure_hist &&
        typeof Object.keys(measure_hist)
                     .find(k => k.startsWith(metricKey)) !== 'undefined'
    ) {
      const metricHistKey = Object.keys(measure_hist)
                                  .find(k => k.startsWith(metricKey));
      value =
        measure_hist[metricHistKey][measure_hist[metricHistKey].length - 1];
    }

    return value;
  }

  metricsBestValue(attr) {

    let value = '--';
    let metricKey = attr;

    if (
      !this.jsonMetrics ||
        !this.jsonMetrics.body
    )
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
        typeof Object.keys(measure_hist)
                     .find(k => k.startsWith(metricKey)) !== 'undefined'
    ) {

      let metricHistKey = Object.keys(measure_hist)
                                .find(k => k === metricKey + "_hist")

      if (typeof metricHistKey === "undefined") {
        // try to find in test0 instead (legacy)
        metricHistKey = Object.keys(measure_hist)
                              .find(k => k === metricKey + "_test0_hist")

      }

      if (typeof metricHistKey === "undefined") {
        value = "--";
      }
      else if(['acc', 'accp', 'meaniou', 'map', 'f1'].includes(metricKey)) {
        value = Math.max.apply(Math, measure_hist[metricHistKey])

      } else if(['iteration'].includes(metricKey)) {

        if(this.bestModel !== null) {
          value = this.bestModel['iteration'];
        } else {
          value = '--';
        }

      } else {
        // train_loss, L1_mean_error, mcll, eucll
        value = Math.min.apply(Math, measure_hist[metricHistKey])
      }
    }

    return value;
  }

  get benchmarksPath() {
    return this.path + '/benchmarks';
  }

  get tags() {
    return this.path.split("/").filter(p => p.length > 0);
  }

  get trainingTags() {
    return this.path.split("/").filter(p => {
      return (
        p.length > 0 && p !== "models" && p !== "training" && p !== this.name
      );
    });
  }

  get name() {
    return this.path
      .split("/")
      .filter(p => p.length > 0)
      .pop();
  }

  get location() {
    return this.store.systemPath + this.path;
  }

  get downloadableFiles() {
    const torchWeightFile = this.files
      .filter(f => f.endsWith(".pt"))
      .slice(0, 1);

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
      .concat(torchWeightFile)
      .concat(variousFiles)
      .filter(f => f.indexOf("~") === -1);
  }

  get measure_hist() {
    if (
      !this.jsonMetrics ||
      !this.jsonMetrics.body ||
      !this.jsonMetrics.body.measure_hist
    )
      return null;

    return this.jsonMetrics.body.measure_hist;
  }

  get isTimeseries() {
      return this.mltype === "timeserie";
  }

  _load() {
    this._loadJsonConfig();
    this._loadJsonMetrics();
    this._loadBestModel();
    this._loadBestModelTest();
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

  async deleteArchivedJob() {
    const isDeleted = await this.$reqDeleteArchivedJob();
    this.store.removeRepository(this.path);
    return isDeleted;
  }

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
        this._updateMetricsDate(meta.header["last-modified"]);
      } catch (e) {}
    }
  }

  _updateJsonConfig(jsonConfig) {
    this.jsonConfig = jsonConfig
  }

  _updateJsonConfigCustom() {
    // TODO : remove this line when config.json editable
    this.jsonConfig.parameters.mllib.gpuid = 0;

    // delete this parameter from server config
    // it'd create an issue when creating a new service
    // from PredictHome 'Add Service' button
    //
    // it's generated when creating a new Service with
    // the Publish button from Archived Training Jobs
    this.jsonConfig.parameters.mllib.from_repository = null;
  }

  async _loadJsonConfig() {
    try {
      const meta = await this.$reqJsonConfig();

      this._updateJsonConfig(meta.content);
      this._updateMetricsDate(meta.header["last-modified"]);
      this._updateJsonConfigCustom();

    } catch (e) {}
  }

  _updateJsonMetrics(jsonMetrics) {
    this.jsonMetrics = jsonMetrics;
  }

  async _loadJsonMetrics() {
    try {
      const meta = await this.$reqJsonMetrics();
      this._updateJsonMetrics(meta.content);
      this._updateMetricsDate(meta.header["last-modified"]);
    } catch (err) {
      //console.log(`Error while loading repository json metrics - ${this.name} - ${err}`)
    }
  }

  _updateMetricsDate(metricsDate) {
    this.metricsDate = metricsDate;
  }

  async _loadBestModel() {
    try {
      const meta = await this.$reqBestModel();
      this._updateMetricsDate(meta.header["last-modified"]);
      this.bestModel = this._readBestModelContent(meta.content);
    } catch (e) {
      //console.log(e);
    }
  }

  async _loadBestModelTest() {

    for(let i = 0; i < 10; i++) {
      try {
        const meta = await this.$reqBestModelTestIndex(i);
        if(meta === null)
          break;
        this._updateMetricsDate(meta.header["last-modified"]);
        this.bestModelTest.push(
          this._readBestModelContent(meta.content)
        );
      } catch (e) {
        //console.log(e);
      }
    }
  }

  _readBestModelContent(content) {
    let bestModel = {};
    content
      .split("\n")
      .filter(a =>
              a.length > 0 &&
              !a.startsWith('test_name')
              )
      .map(a => a.split(":"))
      .forEach(content => {
        bestModel[content[0]] = content[1];
      });

    return bestModel;
  }

  _updateBenchmarks(benchmarks) {
    this.benchmarks = benchmarks;
  }

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

      this._updateBenchmarks(benchmarks);
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

  $reqBestModelTestIndex(index) {
    if (!this.files.includes(`best_model_test_${index}.txt`)) return null;
    return agent.Webserver.getFileMeta(`${this.path}best_model_test_${index}.txt`);
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
