# Core-UI

Web interface to control DeepDetect processus.

## Dependencies

```bash
yarn install
```

## Build

```
yarn start
```

## Usage

Open your browser on [http://localhost:3000](http://localhost:3000)

## public/config.json

App must be configured using `public/config.json` file. It contains various sections that helps configure various parts of this app.

### Imaginate section

```js
  // Top level *imaginate* config object
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

## Deploy with nginx

1.  Edit react app server IP and port in `.nginx.conf`
2.  Edit deepdetect server IP and port in `.nginx.conf`
3.  Copy nginx config file in `site-enabled` :

```
sudo cp .nginx.conf /etc/nginx/site-enabled/
```

4.  Reload `nginx` server :

```
sudo /etc/init.d/nginx reload
```
