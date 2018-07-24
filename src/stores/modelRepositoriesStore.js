import { observable, action, computed } from "mobx";
import agent from "../agent";

export class modelRepositoriesStore {
  @observable isLoading = false;
  @observable settings = {};
  @observable repositories = [];

  @action
  setup(configStore) {
    this.settings = configStore.modelRepositories;
    this.load();
  }

  $reqJsonMetrics(path) {
    const jsonPath = path.match("/$")
      ? `${path}metrics.json`
      : `${path}/metrics.json`;
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

  async _addRepository(repo, isPublic = true, files = []) {
    const systemPath = isPublic
      ? this.settings.systemPath.public + repo
      : this.settings.systemPath.private + repo;

    const nginxPath = isPublic
      ? this.settings.nginxPath.public + repo
      : this.settings.nginxPath.private + repo;

    let jsonConfig = null;

    try {
      jsonConfig = await this.$reqJsonConfig(nginxPath);
      // TODO : remove this line when config.json editable
      jsonConfig.parameters.mllib.gpuid = 0;
    } catch (e) {}

    let protoTxtFiles = files.filter(f => f.includes("prototxt"));
    let caffemodelFile = files
      .filter(f => f.includes("caffemodel"))
      .sort((a, b) => {
        return parseInt(b.match(/\d+/), 10) - parseInt(a.match(/\d+/), 10);
      })
      .slice(0, 1);

    const filteredFiles = protoTxtFiles.concat(caffemodelFile);

    this.repositories.push({
      id: this.repositories.length,
      modelName: repo.replace("/", ""),
      label: systemPath,
      labelKey: `item-${this.repositories.length}`,
      isPublic: isPublic,
      jsonConfig: jsonConfig,
      files: filteredFiles.map(f => {
        return {
          filename: f,
          url: this.settings.nginxPath.private + repo + f
        };
      })
    });
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
                this._addRepository(repo, false, files);
              });
            this.isLoading = false;
          })
        );
      })
    );
  }

  @computed
  get metrics() {}
}

export default new modelRepositoriesStore();
