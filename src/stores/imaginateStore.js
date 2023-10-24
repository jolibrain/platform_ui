import { makeAutoObservable } from "mobx";

export default class imaginateStore {
  settings = {
    default: {
      display: {
        initImages: {},
        mode: "description",
        okClass: "",
        boundingBox: true,
        segmentation: false,
        separateSegmentation: false,
        segmentationColors: ["#1b9e77", "#d95f02"],
        imageList: "random",
        chain: {
          multicrop: false,
          search_nn: 10,
          min_size_ratio: 0.5
        }
      },

      threshold: {
        confidence: 0.3,
        controls: true,
        controlSteps: [0.8, 0.41, 0.1]
      },

      request: {
        objSearch: false,
        imgSearch: false,
        best: false,
        ctc: false,
        blank_label: false
      },

      code: {
        https: false,
        hostname: false,
        port: 1912,
        auth: {
          enabled: false,
          method: "basicauth",
          login: "username",
          password: "sesame"
        },
        display: {
          importLib: true,
          ddConfig: true,
          importData: true,
          postPredict: true
        }
      }
    },

    services: []
  };

  server = null;
  service = null;

  chain = {};

  constructor() {
    makeAutoObservable(this);
  }

  setup(configStore) {
    // If both objects have a property with the same name,
    // then the second object property overwrites the first.
    // https://flaviocopes.com/how-to-merge-objects-javascript/
    this.settings = { ...this.settings, ...configStore.imaginate };
  }

  connectToDdStore(deepdetectStore) {
    const { server } = deepdetectStore;
    this.server = server;
    this.service = server.service;
  }

  predict() {
    if (!this.service) return null;

    if (this.isChain) {
      this.service.predictChain(this.serviceSettings, this.chain);
    } else {
      this.service.predict(this.serviceSettings);
    }
  }

  get isChain() {
    return this.chain &&
      this.chain.content &&
      this.chain.content.calls &&
      this.chain.content.calls.length > 0;
  }

  get serviceSettings() {
    let settings = this.settings.default;

    const existingService = this.settings.services.find(service => {
      return service.name === this.service.name;
    });

    if (existingService) settings = existingService.settings;

    return settings;
  }
}
