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

  $req() {
    return agent.Webserver.listFolders(this.settings.nginxPath);
  }

  @action
  load() {
    this.isLoading = true;
    this.$req().then(
      action(publicRepo => {
        this.repositories = publicRepo.map((repo, index) => {
          return {
            id: index,
            folderName: repo.replace("/", ""),
            label: this.settings.systemPath + repo
          };
        });
        this.isLoading = false;
      })
    );
  }
}

export default new dataRepositoriesStore();
