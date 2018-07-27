import superagentPromise from "superagent-promise";
import _superagent from "superagent";

import DD from "./lib/deepdetect";

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
  info: async settings => {
    const dd = new DD(settings);
    try {
      return await dd.info();
    } catch (err) {
      return err;
    }
  },
  infoStatus: async settings => {
    const dd = new DD(settings);
    try {
      return await dd.info({ status: true });
    } catch (err) {
      return err;
    }
  },
  getService: async (settings, name) => {
    const dd = new DD(settings);
    try {
      return await dd.getService(name);
    } catch (err) {
      return err;
    }
  },
  putService: async (settings, name, data) => {
    const dd = new DD(settings);
    try {
      return await dd.putService(name, data);
    } catch (err) {
      return err;
    }
  },
  deleteService: async (settings, name) => {
    const dd = new DD(settings);
    try {
      return await dd.deleteService(name);
    } catch (err) {
      return err;
    }
  },
  postPredict: async (settings, postData) => {
    const dd = new DD(settings);
    try {
      return await dd.postPredict(postData);
    } catch (err) {
      return err;
    }
  },
  getTrain: async (
    settings,
    serviceName,
    job = 1,
    timeout = 0,
    history = false,
    maxHistPoints = null
  ) => {
    const dd = new DD(settings);
    try {
      return await dd.getTrain(
        serviceName,
        job,
        timeout,
        history,
        maxHistPoints
      );
    } catch (err) {
      return err;
    }
  },
  stopTraining: async (settings, serviceName) => {
    const dd = new DD(settings);
    try {
      return await dd.deleteTrain(serviceName);
    } catch (err) {
      return err;
    }
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
  listFiles: (path, maxFiles = 100) =>
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

        return files.slice(0, maxFiles);
      }),
  getFile: path =>
    superagent
      .get(path)
      .end(handleErrors)
      .then(res => {
        if (res && res.text) {
          let json = null;
          try {
            json = JSON.parse(res.text);
          } catch (e) {}
          return json;
        }
      })
};

export default {
  Config,
  GpuInfo,
  Deepdetect,
  Webserver
};
