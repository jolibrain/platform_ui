import { observable, action, computed } from "mobx";
import agent from "../agent";

export class modelRepositoriesStore {
  @observable isReady = false;
  @observable isLoading = false;
  @observable settings = {};
  @observable repositories = [];

  @action
  setup(configStore) {
    this.settings = configStore.modelRepositories;
    this.load();
  }

  @computed
  get metricRepositories() {
    return this.repositories.filter(r => r.jsonMetrics);
  }

  $reqJsonMetrics(path) {
    const jsonPath = path.match("/$")
      ? `${path}metrics.json`
      : `${path}/metrics.json`;
    return agent.Webserver.getFile(jsonPath);
  }

  $reqBestModel(path) {
    const jsonPath = path.match("/$")
      ? `${path}best_model.txt`
      : `${path}/best_model.txt`;
    return agent.Webserver.getFile(jsonPath);
  }

  $reqJsonConfig(path) {
    const jsonPath = path.match("/$")
      ? `${path}config.json`
      : `${path}/config.json`;
    return agent.Webserver.getFile(jsonPath);
  }

  $reqPublic() {
    return agent.Webserver.listFolders(this.settings.nginxPath.public);
  }

  $reqPrivate() {
    return agent.Webserver.listFolders(this.settings.nginxPath.private);
  }

  $reqPrivateFiles(path) {
    return agent.Webserver.listFiles(this.settings.nginxPath.private + path);
  }

  $reqTraining() {
    return agent.Webserver.listFolders(this.settings.nginxPath.training);
  }

  @action.bound
  async _addRepository(repo, isPublic = true, isTraining = false, files = []) {
    let systemPath = isPublic
      ? this.settings.systemPath.public + repo
      : this.settings.systemPath.private + repo;

    let nginxPath = isPublic
      ? this.settings.nginxPath.public + repo
      : this.settings.nginxPath.private + repo;

    if (isTraining) {
      systemPath = this.settings.systemPath.training + repo;
      nginxPath = this.settings.nginxPath.training + repo;
    }

    let jsonConfig = null;

    try {
      jsonConfig = await this.$reqJsonConfig(nginxPath);
      // TODO : remove this line when config.json editable
      jsonConfig.parameters.mllib.gpuid = 0;
    } catch (e) {}

    let jsonMetrics = null;

    if (isTraining) {
      try {
        jsonMetrics = await this.$reqJsonMetrics(nginxPath);
      } catch (e) {}
    }

    let protoTxtFiles = files.filter(f => f.includes("prototxt"));
    let caffemodelFile = files
      .filter(f => f.includes("caffemodel"))
      .sort((a, b) => {
        return parseInt(b.match(/\d+/), 10) - parseInt(a.match(/\d+/), 10);
      })
      .slice(0, 1);

    const filteredFiles = protoTxtFiles.concat(caffemodelFile);

    const repository = {
      id: this.repositories.length,
      modelName: repo.replace("/", ""),
      label: systemPath,
      labelKey: `item-${this.repositories.length}`,
      isPublic: isPublic,
      jsonConfig: jsonConfig,
      jsonMetrics: jsonMetrics,
      files: filteredFiles.map(f => {
        return {
          filename: f,
          url: this.settings.nginxPath.private + repo + f
        };
      })
    };
    this.repositories.push(repository);
  }

  @action
  load() {
    this.isLoading = true;
    this.$reqPublic().then(
      action(publicRepo => {
        publicRepo
          .filter(repo => {
            return !this.repositories
              .map(r => r.modelName)
              .some(name => name === repo.replace("/", ""));
          })
          .forEach(repo => {
            this._addRepository(repo);
          });

        this.$reqPrivate().then(
          action(privateRepo => {
            privateRepo
              .filter(repo => {
                return !this.repositories
                  .map(r => r.modelName)
                  .some(name => name === repo.replace("/", ""));
              })
              .forEach(async repo => {
                const files = await this.$reqPrivateFiles(repo);
                this._addRepository(repo, false, false, files);
              });

            this.$reqTraining().then(
              action(trainingRepo => {
                trainingRepo
                  .filter(repo => {
                    return !this.repositories
                      .map(r => r.modelName)
                      .some(name => name === repo.replace("/", ""));
                  })
                  .forEach(repo => {
                    this._addRepository(repo, false, true);
                  });
                this.isReady = true;
              })
            );
          })
        );
      })
    );
  }
}

export default new modelRepositoriesStore();
