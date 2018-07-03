import { observable, action } from "mobx";
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

  async _addRepository(repo, isPublic = true) {
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

    this.repositories.push({
      id: this.repositories.length,
      modelName: repo.replace("/", ""),
      label: systemPath,
      labelKey: `item-${this.repositories.length}`,
      isPublic: isPublic,
      jsonConfig: jsonConfig
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
              .forEach(repo => {
                this._addRepository(repo, false);
              });
            this.isLoading = false;
          })
        );
      })
    );
  }
}

export default new modelRepositoriesStore();
