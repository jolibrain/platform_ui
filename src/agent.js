import superagentPromise from "superagent-promise";
import _superagent from "superagent";
import noCache from "superagent-no-cache";

import DD from "deepdetect-js";

const DD_TIMEOUT = 15000;
const superagent = superagentPromise(_superagent, global.Promise);

const URL_JSON_PREFIX = "/json";

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
      .use(noCache)
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
 * json version info
 * ====
 */

const VersionInfo = {
  get: (path = "version.json") =>
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
    let response = null;
    settings.fetchTimeout = 5000;
    const dd = new DD(settings);
    try {
      response = await dd.info();
    } catch (err) {
      throw err;
    }
    return response;
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
    let response = null;
    settings.fetchTimeout = DD_TIMEOUT;
    const dd = new DD(settings);
    try {
      response = await dd.putService(name, data);
    } catch (err) {
      throw err;
    }
    return response;
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
  putChain: async (settings, putData) => {
    settings.fetchTimeout = DD_TIMEOUT;
    const dd = new DD(settings);
    try {
      return await dd.putChain(putData);
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
  let files = res.body
    .filter(f => f.type === "file")
    .map(f => {
      return decodeURIComponent(f.name);
    });

  let folders = res.body
    .filter(f => f.type === "directory")
    .map(f => {
      return {
        href: f.name,
        name: decodeURIComponent(f.name),
        modified: new Date(f.mtime)
      };
    });

  return {
    folders: folders,
    files: files
  };
};

const Webserver = {
  listFolders: path =>
    superagent
      .get(URL_JSON_PREFIX + path)
      .withCredentials()
      .end(handleErrors)
      .then(autoIndex),
  listFiles: path =>
    superagent
      .get(URL_JSON_PREFIX + path)
      .withCredentials()
      .end(handleErrors)
      .then(res => {
        if (!res.body) return [];

        return res.body
          .filter(f => f.type === "file")
          .map(f => decodeURIComponent(f.name));
      }),
  getFile: path =>
    superagent
      .get(URL_JSON_PREFIX + path)
      .use(noCache)
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
      }),
  getFileMeta: path =>
    superagent
      .get(URL_JSON_PREFIX + path)
      .use(noCache)
      .withCredentials()
      .end(handleErrors)
      .then(res => {
        let content = null;
        if (res && res.text) {
          try {
            content = JSON.parse(res.text);
          } catch (e) {
            content = res.text;
          }
        }
        return {
          content: content,
          header: res.header
        };
      })
};

export default {
  Config,
  BuildInfo,
  VersionInfo,
  GpuInfo,
  Deepdetect,
  Webserver
};
