import superagentPromise from "superagent-promise";
import _superagent from "superagent";

import DD from "deepdetect-js";

const DD_TIMEOUT = 15000;
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
      .withCredentials()
      .end(handleErrors)
      .then(responseBody)
};

/* ====
 * json build info
 * ====
 */

const BuildInfo = {
  get: (path = "buildInfo.json") =>
    superagent
      .get(path)
      .withCredentials()
      .end(handleErrors)
      .then(responseBody)
};

/* ====
 * gpustats
 * ====
 */

const GpuInfo = {
  get: gpuStatServerUrl =>
    superagent
      .get(gpuStatServerUrl)
      .withCredentials()
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
    settings.fetchTimeout = 5000;
    const dd = new DD(settings);
    try {
      return await dd.info();
    } catch (err) {
      return err;
    }
  },
  infoStatus: async settings => {
    settings.fetchTimeout = 5000;
    const dd = new DD(settings);
    try {
      return await dd.info({ status: true });
    } catch (err) {
      return err;
    }
  },
  getService: async (settings, name) => {
    settings.fetchTimeout = DD_TIMEOUT;
    const dd = new DD(settings);
    try {
      return await dd.getService(name);
    } catch (err) {
      return err;
    }
  },
  putService: async (settings, name, data) => {
    settings.fetchTimeout = DD_TIMEOUT;
    const dd = new DD(settings);
    try {
      return await dd.putService(name, data);
    } catch (err) {
      return err;
    }
  },
  deleteService: async (settings, name) => {
    settings.fetchTimeout = DD_TIMEOUT;
    const dd = new DD(settings);
    try {
      return await dd.deleteService(name);
    } catch (err) {
      return err;
    }
  },
  postPredict: async (settings, postData) => {
    settings.fetchTimeout = DD_TIMEOUT;
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
    settings.fetchTimeout = DD_TIMEOUT;
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
    settings.fetchTimeout = DD_TIMEOUT;
    const dd = new DD(settings);
    try {
      return await dd.deleteTrain(serviceName);
    } catch (err) {
      return err;
    }
  }
};

const autoIndex = res => {
  const rowsReg = /<a href="(.+)">(.+)<\/a>.+(\d{2}-[a-zA-Z]{3}-\d{4} \d{2}:\d{2})\s+(\d{0,5})/g;
  const dirReg = /href="(.*)\/"/;
  const parentReg = /href="..\/">..\//;

  let files = [],
    folders = [];

  res.text.replace(rowsReg, function(row, href, name, date, size) {
    var obj = { href: href, name: name, date: date, size: size };

    obj.name = obj.name.replace(/\/$/, "");

    if (obj.date) {
      obj.modified = new Date(obj.date);
      delete obj.date;
    }
    if (!dirReg.test(row)) {
      files.push(obj);
      return;
    }

    delete obj.size;
    if (!parentReg.test(row)) {
      folders.push(obj);
      return;
    }
  });

  return {
    folders: folders,
    files: files.map(f => f.name)
  };
};

const Webserver = {
  listFolders: path =>
    superagent
      .get(path)
      .withCredentials()
      .end(handleErrors)
      .then(autoIndex),
  listFiles: (path, maxFiles = 100) =>
    superagent
      .get(path)
      .withCredentials()
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
      .withCredentials()
      .end(handleErrors)
      .then(res => {
        let result = null;
        if (res && res.text) {
          try {
            result = JSON.parse(res.text);
          } catch (e) {
            result = res.text;
          }
        }
        return result;
      })
};

export default {
  Config,
  BuildInfo,
  GpuInfo,
  Deepdetect,
  Webserver
};
