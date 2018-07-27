/* eslint-env es6 */

DD.prototype = {}; // eslint-disable-line no-use-before-define

// DD class constructor
// @param {String} host the DeepDetect server host
// @param {Integer} port the DeepDetect server port
// @param {Boolean} https http (default) or https connection
// @param {String} apiversion url api version
function DD(
  opts = {
    host: "localhost",
    port: 8080,
    path: null,
    https: false,
    apiversion: "0.1"
  }
) {
  const API_METHODS_URL = {
    0.1: {
      info: "/info",
      services: "/services",
      train: "/train",
      predict: "/predict"
    }
  };

  this.urls = API_METHODS_URL[opts.apiversion || 0.1];

  if (
    typeof window !== "undefined" &&
    typeof window.location !== "undefined" &&
    typeof window.location.origin !== "undefined"
  ) {
    // Browser support, uses window.location by default
    this.ddurl = window.location.origin;

    if (typeof opts.host !== "undefined") {
      this.ddurl = opts.https ? "https://" : "http://";
      this.ddurl += opts.host;
    }

    if (typeof opts.port !== "undefined") {
      this.ddurl += `:${opts.host}`;
    }

    if (typeof opts.path !== "undefined") {
      this.ddurl += opts.path;
    }
  } else {
    // NodeJS support
    this.ddurl = opts.https ? "https://" : "http://";
    this.ddurl += opts.host;
    this.ddurl += `:${opts.port}`;

    if (typeof opts.path !== "undefined") {
      this.ddurl += opts.path;
    }
  }
}

// **API Info**

// Info on the DeepDetect server
DD.prototype.info = function info(params = {}) {
  return this._get(this.urls.info, null, params);
};

// **API Service**

// Create a service
//
// @param {String} sname  service name as a resource
// @param {Object} data   service parameters
DD.prototype.putService = function putService(sname, data) {
  return this._put(`${this.urls.services}/${sname}`, data);
};

// Get information about a service
//
// @param {String} sname service name as a resource
DD.prototype.getService = function getService(sname) {
  return this._get(`${this.urls.services}/${sname}`);
};

// Delete a service
//
// @param {String} sname service name as a resource
// @param {String} clear 'full','lib' or 'mem', optionally clears model repository data
DD.prototype.deleteService = function deleteService(
  sname,
  data = { clear: "lib" }
) {
  return this._delete(`${this.urls.services}/${sname}`, data);
};

/* API Train */

// Creates a training job
//
// @param {String} sname service name as a resource
// @param {Array} data array of input data / dataset for training
// @param {Object} parametersInput input parameters
// @param {Object} parametersMlLib library parameters
// @param {Object} parametersOutput output parameters
// @param {Boolean} asyncParam whether to run the job as non-blocking
DD.prototype.postTrain = function postTrain(
  sname,
  data,
  parameters,
  asyncParam = true
) {
  const postData = {
    service: sname,
    data,
    parameters,
    async: asyncParam
  };

  return this._post(this.urls.train, postData);
};

// Get information on a non-blocking training job
//
// @param {String} sname service name as a resource
// @param {Integer} job job number on the service
// @param {Integer} timeout timeout before obtaining the job status
// @param {Boolean} measureHist whether to return the full measure history (e.g. for plotting)
DD.prototype.getTrain = function getTrain(
  sname,
  job = 1,
  timeout = 0,
  measureHist = false,
  maxHistPoints = null
) {
  const params = {
    service: sname,
    job,
    timeout
  };

  if (measureHist) {
    params["parameters.output.measure_hist"] = true;
  } else if (
    !Number.isNaN(maxHistPoints) &&
    parseInt(Number(maxHistPoints), 10) === maxHistPoints &&
    !Number.isNaN(parseInt(maxHistPoints, 10))
  ) {
    params["parameters.output.max_hist_points"] = parseInt(maxHistPoints, 10);
  }

  return this._get(this.urls.train, null, params);
};

// Kills a non-blocking training job
//
// @params {String} sname service name as a resource
// @params {Integer} job job number on the service
DD.prototype.deleteTrain = function deleteTrain(sname, job = 1) {
  const params = {
    service: sname,
    job
  };

  return this._delete(this.urls.train, null, params);
};

/* API Predict */

// Makes prediction from data and model
//
// @param {Object} postData   prediction parameters
DD.prototype.postPredict = function postPredict(postData) {
  return this._post(this.urls.predict, postData);
};

// **HTTP requests to the DeepDetect server**

// HTTP request to DeepDetect server
//
// @param {String} httpMethod GET/POST/PUT/DELETE
// @param {String} apiMethod DeepDetect api method
// @param {Object} jsonParams
// @param {Object} searchParams
DD.prototype._httpRequest = function _httpRequest(
  httpMethod,
  apiMethod,
  jsonParams = null,
  searchParams = null
) {
  return new Promise(async (resolve, reject) => {
    let url = this.ddurl + apiMethod;
    const requestParams = { method: httpMethod };

    if (jsonParams != null) {
      requestParams.body = JSON.stringify(jsonParams);
    } else if (searchParams != null) {
      const urlParameters = Object.entries(searchParams)
        .map(e => e.join("="))
        .join("&");
      url += `?${urlParameters}`;
    }

    fetch(url, requestParams).then(response => {
      response
        .json()
        .catch(error => reject(error))
        .then(json => {
          if (response.status >= 200 && response.status < 300) {
            return resolve(json);
          }
          const error = new Error();
          if (json && json.status) {
            error.status = json.status;
          } else if (response.statusText) {
            error.status = response.statusText;
          }
          return reject(error);
        });
    });
  });
};

// GET to DeepDetect server
//
// @param {String} method
// @param {Object} json
// @param {Object} params
DD.prototype._get = function _get(method, json = null, params = null) {
  return this._httpRequest("get", method, json, params)
    .then(body => body)
    .catch(err => {
      throw err;
    });
};

// PUT to DeepDetect server
//
// @param {String} method
// @param {Object} json
// @param {Object} params
DD.prototype._put = function _put(method, json = null, params = null) {
  return this._httpRequest("put", method, json, params)
    .then(body => body)
    .catch(err => {
      throw err;
    });
};

// POST to DeepDetect server
//
// @param {String} method
// @param {Object} json
// @param {Object} params
DD.prototype._post = function _post(method, json = null, params = null) {
  return this._httpRequest("post", method, json, params)
    .then(body => body)
    .catch(err => err);
};

// DELETE to DeepDetect server
//
// @param {String} method
// @param {Object} json
// @param {Object} params
DD.prototype._delete = function _delete(method, json = null, params = null) {
  return this._httpRequest("delete", method, json, params)
    .then(body => body)
    .catch(err => err);
};

export default DD;
