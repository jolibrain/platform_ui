import { observable, action } from 'mobx';
import agent from '../agent';

export class imaginateStore {

  @observable isLoaded = false;
  @observable settings = {};

  @observable imgList = [];
  @observable selectedImageIndex = -1;
  @observable selectedImage = null;

  @action setup(configStore) {
    this.settings = configStore.imaginate;
    this.settings.deepdetect = configStore.deepdetect;

    // Init image list if available inside config.json
    if (this.settings.display.initImages) {

      switch(this.settings.display.initImages.type) {
        case "urlList":
        default:
          this.imgList = this.settings.display.initImages.list.map( img => {
            return {
              url: img,
              boxes: [[10, 10, 10, 10]],
              json: null
            }
          })
          break;
      }

    }

    // If existing image, init the first selected one
    if(this.imgList.length > 0)
      this.selectedImageIndex = 0;

    this.isLoaded = true;
  }

  @action setSelectedImage(index) {
    this.selectedImageIndex = index;
    this.selectedImage = null;
  }

  $reqPostPredict(postData) {
    return agent.Deepdetect.postPredict(this.settings.deepdetect, postData);
  }

  @action async predictSelectedImage(serviceName) {
    const image = this.imgList[this.selectedImageIndex];
    image.postData = {
      service: serviceName,
      parameters: {
        output: {
          bbox: true,
          confidence_threshold: this.settings.threshold.confidence,
        }
      },
      data: [ image.url ]
    };
    image.json = await this.$reqPostPredict(image.postData);
    image.boxes = image.json.body.predictions[0].classes.map( predict => predict.bbox );
    this.selectedImage = image;
  }

}

export default new imaginateStore();
