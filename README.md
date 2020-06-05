# Core-UI

Web interface to control DeepDetect processus.

## Requirements

- Yarn : https://yarnpkg.com/lang/en/docs/install/
- Docker : https://docs.docker.com/install/
- Docker Compose : https://docs.docker.com/compose/install/
- Node v10 : https://github.com/creationix/nvm

Correctly using `/opt/platform/models` as models repository on the machine hosting docker.

This folder is mandatory for deepdetect and nginx to link to correct model files.

## Usage

Open your browser on [http://localhost:3000](http://localhost:3000)

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
  "modelRepositories": [
    {
      "name": "repositoryName",

      // Nginx config
      // which location is served by nginx to fetch the index of available models ?
      "nginxPath": "/models/",

      // Server config
      // When selecting a path from nginx result, what prefix should be added so this path correspond to existing system path ?
      "systemPath": "/opt/models/",

      // hasFiles
      // Should we retrieve the list of files in this model repository ?
      // it'd allow user to download these files from the interface
      // default: false
      "hasFiles": false,

      // isTraining
      // does this model repository contains training models ?
      // default: false
      "isTraining": false

    },
    ...
  ]
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

### Minimal layout

A minimal layout would only contain the `Imaginate` component.

To load this layout, you can use the example in `public/config_minimal.json` to replace the standard `public/config.json`.

## Docker

Il est possible (et conseillé) de déléguer l’ensemble des tâches de build à un conteneur.

Le Dockerfile de ce conteneur se trouve dans docker-build/Dockerfile. Il installe l’ensemble des dépendances.

Il est le garant des bonnes versions des dépendances et permet de faire le build sur une machine vierge.

```
docker build -t eris:7750/dev/core-ui-build .
docker push eris:7750/dev/core-ui-build
```

Puis (on oubliera pas de lier le répertoire local au volume) :

```
docker run -v .:/opt/code eris:7750/dev/core-ui-build
```

Les fichiers résultants du build seront dans ./build

### Deploy on server

1.  modify code in src
2.  build the app: `yarn run build`
3.  create a docker image and push it to registry: `./docker-build.sh`
4.  on server, in a git clone of `platform_docker`, use `{server}/deploy.sh` to deploy new docker image

## Service Abstraction

|     | Training | Detection | Segmentation | Classification |
| --- | -------- | --------- | ------------ | -------------- |
|     |          |           |              |                |

## Testing

### Integration testing

First, you need to install `selenium` to run the integration testing:

```
yarn test:selenium:install
```

Then you can run the integration testing cases:

```
yarn test:e2e
```

## Changelog

### v0.9.7 - 05/06/2020

- UI

  - Imaginate component hides segmentation switching to bbox display
  - display model publishing error when no status

- Deepdetect-js

  - use 15s as default fetchTimeout

### v0.9.6.2 - 27/02/2020

- Deepdetect-js

  - use default timeout from deepdetect-js, possible overwrite in config.json
    commit dcd7f18d

### v0.9.6.1 - 14/02/2020

- UI

  - PredictHome: remove multiple spinners
  - Imaginate widget: display bounding boxes when xmin/ymin equal 0

- Dependencies

  - upgrade `react-bounding-box` to `v0.5.14`

### v0.9.6 - 06/02/2020

- Chains

  - Display multiple chain service in boundingbox labels
  - Remove temporary files from chains array
  - Set default deepdetect server in ChainShow
  - Check `this.service` in imaginateStore to avoid issue when loading ChainShow with unavailable service

- UI

  - Word-wrap service title in PredictShow
  - Full row width on Predict ServiceCard
  - Remove bounding-boxes when no result
  - Display gpuid on PredictHome running services

- Upgrade to react-bounding-box@0.5.11
  - Correct canvas dimension on redraw
  - Fix segmentation display

### v0.9.5 - 10/01/2020

- Sync release version with DeepDetect release version number: https://github.com/jolibrain/deepdetect/releases/tag/v0.9.5
