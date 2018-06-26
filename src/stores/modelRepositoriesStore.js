import { observable, action } from "mobx";
import agent from "../agent";

export class modelRepositoriesStore {
  @observable isLoaded = false;
  @observable settings = {};
  @observable repositories = [];

  @action
  setup(configStore) {
    this.settings = configStore.modelRepositories;
    this.load();
  }

  $reqJsonConfig(path) {
    return agent.Webserver.getFile(path + "config.json");
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
      console.log(jsonConfig);
    } catch (e) {}

    this.repositories.push({
      id: this.repositories.length,
      modelName: repo.replace("/", ""),
      label: systemPath,
      isPublic: isPublic,
      jsonConfig: jsonConfig
    });
  }

  @action
  load() {
    this.$reqPublic().then(
      action(publicRepo => {
        publicRepo.forEach(repo => this._addRepository(repo));

        this.$reqPrivate().then(
          action(privateRepo => {
            privateRepo.forEach(repo => this._addRepository(repo, false));
            this.isLoaded = true;
          })
        );
      })
    );
  }
}

export default new modelRepositoriesStore();
