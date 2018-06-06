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

  $reqPublic() {
    const isPublic = true;
    return agent.ModelRepositories.getRelativePath(this.settings, isPublic);
  }

  $reqPrivate() {
    const isPublic = false;
    return agent.ModelRepositories.getRelativePath(this.settings, isPublic);
  }

  @action
  load() {
    this.$reqPublic().then(
      action(publicRepo => {
        this.repositories = publicRepo.map((repo, index) => {
          return {
            id: index,
            modelName: repo.replace("/", ""),
            label: this.settings.systemPath.public + repo,
            isPublic: true
          };
        });

        this.$reqPrivate().then(
          action(privateRepo => {
            privateRepo.forEach((repo, index) => {
              this.repositories.push({
                id: index,
                modelName: repo.replace("/", ""),
                label: this.settings.systemPath.private + repo,
                isPublic: false
              });
            });
            this.isLoaded = true;
          })
        );
      })
    );
  }
}

export default new modelRepositoriesStore();
