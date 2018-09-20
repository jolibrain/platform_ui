import { observable, action } from "mobx";
import agent from "../agent";

export class dataRepositoriesStore {
  @observable isLoading = false;
  @observable settings = {};
  @observable repositories = [];

  @action
  setup(configStore) {
    this.settings = configStore.dataRepositories;
    this.load(this.settings.nginxPath);
  }

  $reqFolder(path) {
    return agent.Webserver.listFolders(path);
  }

  @action
  load(path, level = 0) {
    this.isLoading = true;
    this.$reqFolder(path).then(content => {
      const { folders } = content;

      if (level === 0) {
        folders.forEach(f => this.load(path + f.name + "/", level + 1));
      }

      folders.forEach(f => {
        this.repositories.push({
          id: this.repositories.length,
          name: f.name,
          path: path + f.name + "/",
          label: path.replace(/^\/data\//, "") + f.name
        });
      });

      this.isLoading = false;
    });
  }
}

export default new dataRepositoriesStore();
