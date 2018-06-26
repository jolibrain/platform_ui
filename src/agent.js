import superagentPromise from "superagent-promise";
import _superagent from "superagent";
import DD from "deepdetect-js";

const superagent = superagentPromise(_superagent, global.Promise);

const handleErrors = err => {
  if (err && err.response && err.response.status === 401) {
    // console.log(err);
  }
  return err;
};

const responseBody = res => res.body;

/* ====
 * json config
 * ====
 */

const Config = {
  get: (path = "config.json") =>
    superagent
      .get(path)
      .end(handleErrors)
      .then(responseBody)
};

/* ====
 * gpustats
 * ====
 */

const GpuInfo = {
  get: settings =>
    superagent
      .get(settings.gpuStatServer)
      .end(handleErrors)
      .then(responseBody)
      .catch(() => {})
};

/* ====
 * deepdetect
 * ====
 */

const Deepdetect = {
  info: settings => {
    const dd = new DD(settings);
    return dd.info();
  },
  infoStatus: settings => {
    const dd = new DD(settings);
    return dd.info({ status: true });
  },
  getService: (settings, name) => {
    const dd = new DD(settings);
    return dd.getService(name);
  },
  putService: (settings, name, data) => {
    const dd = new DD(settings);
    return dd.putService(name, data);
  },
  deleteService: (settings, name) => {
    const dd = new DD(settings);
    return dd.deleteService(name);
  },
  postPredict: (settings, postData) => {
    const dd = new DD(settings);
    return dd.postPredict(postData);
  },
  getTrain: (settings, serviceName, job = 1, timeout = 0, history = false) => {
    const dd = new DD(settings);
    return dd.getTrain(serviceName, job, timeout, history);
  }
};

const Webserver = {
  listFolders: path =>
    superagent
      .get(path)
      .end(handleErrors)
      .then(res => {
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(res.text, "text/html");
        const aElements = htmlDoc.getElementsByTagName("a");

        let folders = [];

        for (var i = 0; i < aElements.length; i++) {
          const repo = aElements[i].text;

          // Check if not parent folder
          if (repo !== "../") folders.push(repo);
        }

        return folders;
      }),
  listFiles: path =>
    superagent
      .get(path)
      .end(handleErrors)
      .then(res => {
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(res.text, "text/html");
        const aElements = htmlDoc.getElementsByTagName("a");

        let files = [];

        for (var i = 0; i < aElements.length; i++) {
          const repo = aElements[i].text;

          // Check if files and if not parent folder
          if (repo.indexOf("/") === -1) files.push(repo);
        }

        return files.slice(0, 40);
      }),
  getFile: path =>
    superagent
      .get(path)
      .end(handleErrors)
      .then(res => JSON.parse(res.text))
};

export default {
  Config,
  GpuInfo,
  Deepdetect,
  Webserver
};
