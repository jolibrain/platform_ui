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
  putService: (settings, name, data) => {
    const dd = new DD(settings);
    return dd.putService(name, data);
  },
  postPredict: (settings, postData) => {
    const dd = new DD(settings);
    return dd.postPredict(postData);
  }
};

/* ====
 * model repositories
 * ====
 */

const ModelRepositories = {
  getRelativePath: (settings, isPublic = true) =>
    superagent
      .get(settings.nginxPath[isPublic ? "public" : "private"])
      .end(handleErrors)
      .then(res => {
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(res.text, "text/html");
        const aElements = htmlDoc.getElementsByTagName("a");

        let relativePath = [];

        for (var i = 0; i < aElements.length; i++) {
          const repo = aElements[i].text;

          // Check if folder and if not parent folder
          if (repo.indexOf("/") !== -1 && repo !== "../")
            relativePath.push(repo);
        }

        return relativePath;
      })
};

export default {
  Config,
  GpuInfo,
  Deepdetect,
  ModelRepositories
};
