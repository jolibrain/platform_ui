import { observable, action } from "mobx";
import agent from "../agent";

export class dataRepositoriesStore {
  @observable isLoaded = false;
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
    this.$req().then(
      action(publicRepo => {
        this.repositories = publicRepo.map((repo, index) => {
          return {
            id: index,
            folderName: repo.replace("/", ""),
            label: this.settings.systemPath + repo
          };
        });
        this.isLoaded = true;
      })
    );
  }
}

export default new dataRepositoriesStore();
