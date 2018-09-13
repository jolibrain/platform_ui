import { observable, action } from "mobx";
import agent from "../agent";

export class dataRepositoriesStore {
  @observable isLoading = false;
  @observable settings = {};
  @observable repositories = [];

  @action
  setup(configStore) {
    this.settings = configStore.dataRepositories;
    this.load();
  }

  $reqFolder(path) {
    return agent.Webserver.listFolders(path);
  }

  @action
  load() {
    this.isLoading = true;
    this.$reqFolder(this.settings.nginxPath).then(
      action(publicRepo => {
        this.repositories = publicRepo.folders.map((repo, index) => {
          return {
            id: index,
            folderName: repo.name.replace("/", ""),
            label: this.settings.systemPath + repo.name
          };
        });
        this.isLoading = false;
      })
    );
  }
}

export default new dataRepositoriesStore();
