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

  $req() {
    return agent.ModelRepositories.getRelativePath(this.settings);
  }

  @action
  load() {
    this.$req().then(
      action(repositories => {
        this.repositories = repositories.map((repo, index) => {
          return {
            id: index,
            modelName: repo.replace("/", ""),
            label: this.settings.systemPath + repo
          };
        });
        this.isLoaded = true;
      })
    );
  }
}

export default new modelRepositoriesStore();
