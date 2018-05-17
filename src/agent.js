import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
//import DD from 'deepdetect-js';

const superagent = superagentPromise(_superagent, global.Promise);

const handleErrors = err => {
    if (err && err.response && err.response.status === 401) {
      // console.log(err);
    }
    return err;
};

const responseBody = res => res.body;

/* ====
 * gpustats
 * ====
 */

// gpustat server on eris
const GPUSTAT_SERVER = 'http://10.10.77.61:12345';

const GpuInfo = {
  get: () =>
  superagent
  .get(GPUSTAT_SERVER)
  .end(handleErrors)
  .then(responseBody),
};

/* ====
 * deepdetect
 * ====
 */

//const dd = new DD({path: 'api'});
//
//const Deepdetect = {
//  info: () =>
//    dd.info(),
//  createService: (serviceName, model, description, mllib, parametersInput, parametersMlLib, parametersOutput, type) =>
//    dd.putService(serviceName, model, description, mllib, parametersInput, parametersMlLib, parametersOutput, type),
//  getService: (serviceName) =>
//    dd.getService(serviceName),
//  deleteService: (serviceName, clear = 'lib') =>
//    dd.deleteService(serviceName, clear),
//};
//


export default {
  GpuInfo,
  //  Deepdetect,
};
