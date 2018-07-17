# Core-UI

Web interface to control DeepDetect processus.

## Requirements

- Yarn : https://yarnpkg.com/lang/en/docs/install/
- Docker : https://docs.docker.com/install/
- Docker Compose : https://docs.docker.com/compose/install/
- Node v10 : https://github.com/creationix/nvm

Correctly using `/data1/core_ui/models` as models repository on the machine hosting docker.

This folder is mandatory for deepdetect and nginx to link to correct model files.

## Dev setup

```bash
yarn dev:setup
yarn dev:up
```

## Usage

Open your browser on [http://localhost:18104](http://localhost:18104)

## public/config.json

App must be configured using `public/config.json` file. It contains various sections that helps configure various parts of this app.

### Deep Detect section

```js
  // Top level *deepdetect* config object
  "deepdetect": {

    // How often (in millisec) should the app call /info
    // to refresh Service List
    "infoRefreshRate": 10000,

    // Deep Detect server configuration
    // Should be similar to nginx proxy path
    "server": {
      "host": "192.168.90.201",
      "port": 18104,
      "path": "/api"
    },

    // Services configuration
    "services": {

      // Default configuration available when creating a new service
      "defaultConfig": {
        ...
      }

    }
  },
```

### Imaginate section

```js
  // Top level *imaginate* config object
  // src/components/widgets/Imaginate
  // src/store/imaginateStore.js
  "imaginate": {

    // Setup display elements
    "display": {

      // Images to preload when using this widget
      "initImages": {

        // Method to preload images
        // can be one of this: ["urlList"]
        "type": "urlList",

        // When using "urlList" method, fill urls in this list
        "list": [
          "https://i.imgur.com/d4QKO0v.jpg",
          "https://i.imgur.com/VkZiq7B.jpg",
          "https://i.imgur.com/oBbmiaA.jpg"
        ]

      },

      // How to display image description
      // src/components/widgets/Imaginate/Description.js
      // can be: ["expectation", "list", "list-url", "category", "icons" (default)]
      "mode": "description",

      // color object category when it correspond to this string
      // only available in mode: ["category", "icons" (default)]
      // src/components/widgets/Imaginate/Description.js
      "okClass": ""

      // if true, modify request to return bounding boxes
      // src/store/imaginateStore.js
      "boundingBox": true,

      // if true, modify request to return segmentation
      // src/store/imaginateStore.js
      "segmentation": false,

      // If true, display segmentation on a canvas separated from the image canvas
      "separateSegmentation": false,

      // segmentation colors to use
      "segmentationColors": ["#1b9e77", "#d95f02"]

    },

    // Confidence controls
    "threshold": {

      // Default confidence send to dd server
      // src/store/imaginateStore.js
      // src/components/widgets/Imaginate/CurlCommand.js
      "confidence": 0.5,

      // Should confidence be modified using UI buttons ?
      // src/components/widgets/Imaginate/Threshold.js
      "controls": true,

      // Possible steps of UI threshold buttons
      // src/components/widgets/Imaginate/Threshold.js
      "controlSteps": [0.8, 0.5, 0.3]
    },

    // Post predict parameters flags
    "request": {

      // TODO: describe objSearch flag
      "objSearch": false,

      // TODO: describe imgSearch flag
      "imgSearch": false,

      // TODO: describe best flag
      "best": false,

      // TODO: describe ctc flag
      "ctc": false,

      // TODO: describe blank_label flag
      "blank_label": false
    }
  },
```

### GPU Stat server section

This section configure the **GpuInfo** widget.

```js
  // Top level *Gpu Info* config object
  // src/components/widgets/GpuInfo
  "gpuInfo": {

    // Where is Gpu Stat Server serving its json from ?
    "gpuStatServer": "http://10.10.77.61:12345",

    // How often (in millisec) should the widget be refreshed ?
    "refreshRate": 5000

  }
```

### Model Repositories section

When creating a new service, the app is pre-loading repositories path and user is limited to these path for the newly created model.

```js
  // Top level *Model Repositories* config object
  // src/store/modelRepositories.js
  "modelRepositories": {

    // Nginx config
    // which location is served by nginx to fetch the index of available models ?
    "nginxPath": "/models/",

    // Server config
    // When selecting a path from nginx result, what prefix should be added so this path correspond to existing system path ?
    "systemPath": "/opt/models/"

  }
```

### Blacklisting components

It's possible to blacklist some components from the `public/config.json` file.

To do so, fill the following array with these possible component names:

```
"componentBlacklist": [
  "Predict",
  "PredictHome",
  "PredictNew",
  "PredictShow",
  "Training",
  "TrainingHome",
  "TrainingShow",
  "Breadcrumb",
  "GpuInfo",
  "Imaginate",
  "ServiceCardCreate",
  "ServiceCardList",
  "ServiceInfo",
  "ServiceList",
  "ServiceTraining",
  "TrainingMeasure",
  "TrainingMonitor",
  "LinkJupyter",
  "LinkData"
]
```

## Docker Files

`[env]` should be replaced by correct environnement (dev/production/product_name/...).

- `package.json` : various scripts to run docker commands
- `scripts/00-install-[env].sh` : build react and deepdetect containers for **[env]**
- `docker/docker-compose.[env].sh` : docker-compose configuration for **[env]**
- `docker/nginx/Dockerfile.[env]` : nginx container Dockerfile for **[env]**
- `docker/react/Dockerfile.[env]` : react container Dockerfile for **[env]**
- `docker/deepdetect/Dockerfile.[env]` : deepdetect container Dockerfile for **[env]**
- `config/nginx/nginx.[env].conf` : nginx config file for **[env]** docker container

### Running docker

Docker-compose commands can be found in the `scripts` section of `package.json`.

Usually, you can run shortcuts like these ones to quickly launch service:

```
yarn run eris:install
yarn run eris:up
yarn run eris:down
```

But it can be helpful to run full `docker-compose` commands to have finer access on each docker container:

```
docker-compose -f docker/docker-compose.eris.yml up server
```

### Accessing docker container bash console

It can be helpful to access to a docker container bash console.

First, fetch the container id with the following command:

```
docker ps
```

Then launch a bash console inside this container:

```
docker exec -t -i __Container_ID__ /bin/bash
```
