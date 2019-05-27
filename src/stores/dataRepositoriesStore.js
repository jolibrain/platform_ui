import { observable, action } from "mobx";
import agent from "../agent";
import path from "path";

export class dataRepositoriesStore {
  @observable isLoading = false;
  @observable settings = {};
  @observable repositories = [];

  @action
  setup(configStore) {
    this.settings = configStore.dataRepositories;

    if (typeof this.settings.maxDepth === "undefined")
      this.settings.maxDepth = 1;
  }

  refresh() {
    this.load(this.settings.nginxPath);
    this.cleanRootFolders();
  }

  $reqFolder(rootPath) {
    return agent.Webserver.listFolders(rootPath);
  }

  // Remove root folders when containing subfolders
  // It permit to avoid selecting a data folder containing sub-structure
  @action
  cleanRootFolders() {
    let deletableId = [];
    this.repositories.forEach(r => {
      if (
        this.repositories.some(r2 => {
          return r2.label.startsWith(r.label) && r.id !== r2.id;
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
  load(rootPath, level = 0) {
    this.isLoading = true;
    this.$reqFolder(rootPath).then(content => {
      const { folders } = content;

      folders.forEach(f => {
        const folderPath = path.join(rootPath, f.href, "/");
        const folderLabel = folderPath.replace(/^\/data\//gm, "");

        if (level < this.settings.maxDepth) this.load(folderPath, level + 1);

        this.repositories.push({
          id: this.repositories.length,
          name: f.name,
          path: folderPath,
          label: folderLabel
        });
      });

      this.isLoading = false;
      this.cleanRootFolders();
    });
  }
}

export default new dataRepositoriesStore();
