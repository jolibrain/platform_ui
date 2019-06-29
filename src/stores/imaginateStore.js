import { observable, action, computed } from "mobx";

export class imaginateStore {
  @observable
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
        imageList: "random"
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

  @observable server = null;
  @observable service = null;

  @action
  setup(configStore) {
    // If both objects have a property with the same name,
    // then the second object property overwrites the first.
    // https://flaviocopes.com/how-to-merge-objects-javascript/
    this.settings = { ...this.settings, ...configStore.imaginate };
  }

  @action
  connectToDdStore(deepdetectStore) {
    const { server } = deepdetectStore;
    this.server = server;
    this.service = server.service;
  }

  @action
  predict() {
    this.service.predict(this.serviceSettings);
  }

  @computed
  get serviceSettings() {
    let settings = this.settings.default;

    const existingService = this.settings.services.find(service => {
      return service.name === this.service.name;
    });

    if (existingService) settings = existingService.settings;

    return settings;
  }
}

export default new imaginateStore();
