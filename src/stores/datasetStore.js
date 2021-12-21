import { observable, action } from "mobx";

export class datasetStore {
  @observable datasets = [];
  @observable isLoading = true;

  @action
  setup() {
    this.datasets = [
      {
        name: "dataset1",
        items: [
          {
            name: "item1",
            path: "/data/alex/datasets/dataset1/item1.png",
            metrics: {
              map: 0.01
            }
          },
          {
            name: "item2",
            path: "/data/alex/datasets/dataset1/item2.png",
            metrics: {
              map: 0.02
            }
          },
          {
            name: "item3",
            path: "/data/alex/datasets/dataset1/item3.png",
            metrics: {
              map: 0.03
            }
          },
          {
            name: "item4",
            path: "/data/alex/datasets/dataset1/item4.png",
            metrics: {
              map: 0.04
            }
          },
          {
            name: "item5",
            path: "/data/alex/datasets/dataset1/item5.png",
            metrics: {
              map: 0.05
            }
          }
        ]
      },
      {
        name: "dataset2",
        items: [
          {
            name: "item1",
            path: "/data/alex/datasets/dataset2/item1.png",
            metrics: {
              map: 0.01
            }
          },
          {
            name: "item2",
            path: "/data/alex/datasets/dataset2/item2.png",
            metrics: {
              map: 0.02
            }
          },
          {
            name: "item3",
            path: "/data/alex/datasets/dataset2/item3.png",
            metrics: {
              map: 0.03
            }
          },
          {
            name: "item4",
            path: "/data/alex/datasets/dataset2/item4.png",
            metrics: {
              map: 0.04
            }
          },
          {
            name: "item5",
            path: "/data/alex/datasets/dataset2/item5.png",
            metrics: {
              map: 0.05
            }
          }
        ]
      }
    ];
    this.isLoading = false;
  }
}

export default new datasetStore();
