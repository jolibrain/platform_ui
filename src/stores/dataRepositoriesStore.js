import { observable, action } from "mobx";
import agent from "../agent";

export class dataRepositoriesStore {
  @observable isLoading = false;
  @observable settings = {};
  @observable repositories = [];

  @action
  setup(configStore) {
    this.settings = configStore.dataRepositories;
  }

  refresh() {
    this.load(this.settings.nginxPath);
    this.cleanRootFolders();
  }

  $reqFolder(path) {
    return agent.Webserver.listFolders(path);
  }

  // Remove root folders when containing subfolders
  // It permit to avoid selecting a data folder containing sub-structure
  @action
  cleanRootFolders() {
    let deletableId = [];
    this.repositories.forEach(r => {
      if (
        this.repositories.some(r2 => {
          return r2.relativePath.startsWith(r.relativePath) && r.id !== r2.id;
        })
      ) {
        deletableId.push(r.id);
      }
    });
    this.repositories = this.repositories.filter(
      r => !deletableId.includes(r.id)
    );
  }

  @action
  load(path, level = 0) {
    this.isLoading = true;
    this.$reqFolder(path).then(content => {
      const { folders } = content;

      if (level === 0) {
        folders.forEach(f => this.load(path + f.name + "/", level + 1));
      }

      // TODO: replace data string by regexp
      folders.forEach(f => {
        this.repositories.push({
          id: this.repositories.length,
          name: f.name,
          path: path + f.name + "/",
          relativePath: path.replace("/data", "") + f.name + "/",
          label: path.replace("/data/", "") + f.name
        });
      });

      this.isLoading = false;
      this.cleanRootFolders();
    });
  }
}

export default new dataRepositoriesStore();
