import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
import DD from 'deepdetect-js';

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
  get: (path = 'config.json') =>
  superagent
  .get(path)
  .end(handleErrors)
  .then(responseBody),
};

/* ====
 * gpustats
 * ====
 */

const GpuInfo = {
  get: (settings) =>
  superagent
  .get(settings.gpuStatServer)
  .end(handleErrors)
  .then(responseBody),
};

/* ====
 * deepdetect
 * ====
 */


const Deepdetect = {
  info: (settings) => {
    const dd = new DD(settings.server);
    return dd.info();
  },
  putService: (settings, name, data) => {
    const dd = new DD(settings.server);
    console.log(data);
    return dd.putService(name, data);
  },
  postPredict: (settings, postData) => {
    const dd = new DD(settings.server);
    return dd.postPredict(postData);
  },
};



export default {
  Config,
  GpuInfo,
  Deepdetect,
};
