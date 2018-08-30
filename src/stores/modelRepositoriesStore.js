import { observable, action, computed } from "mobx";
import agent from "../agent";

import Repository from "./modelRepositories/repository";

export class modelRepositoriesStore {
  @observable settings = {};
  @observable repositories = [];

  @observable publicLoaded = false;
  @observable privateLoaded = false;
  @observable trainingLoaded = false;

  @action
  setup(configStore) {
    this.settings = configStore.modelRepositories;
    this.load();
  }

  @computed
  get isReady() {
    return this.publicLoaded && this.privateLoaded && this.trainingLoaded;
  }

  @computed
  get metricRepositories() {
    return this.repositories.filter(r => r.jsonMetrics);
  }

  @computed
  get publicRepositories() {
    return this.repositories.filter(r => r.isPublic && !r.isTraining);
  }

  @computed
  get privateRepositories() {
    return this.repositories.filter(r => !r.isPublic && !r.isTraining);
  }

  @computed
  get trainingRepositories() {
    return this.repositories.filter(r => r.isTraining);
  }

  @computed
  get archivedTrainingRepositories() {
    return this.repositories.filter(r => r.isTraining && r.jsonMetrics);
  }

  @action
  load() {
    this.isLoading = true;

    this.$reqPublic().then(
      action(publicRepo => {
        publicRepo.forEach(repo => {
          const repository = new Repository({
            repo: repo,
            settings: this.settings
          });
          this.repositories.push(repository);
        });
        this.publicLoaded = true;
      })
    );

    this.$reqPrivate().then(
      action(privateRepo => {
        privateRepo.forEach(async repo => {
          const files = await this.$reqPrivateFiles(repo);
          const repository = new Repository({
            repo: repo,
            isPublic: false,
            settings: this.settings,
            files: files
          });
          this.repositories.push(repository);
        });
        this.privateLoaded = true;
      })
    );

    this.$reqTraining().then(
      action(trainingRepo => {
        trainingRepo.forEach(repo => {
          const repository = new Repository({
            repo: repo,
            isPublic: false,
            isTraining: true,
            settings: this.settings
          });
          this.repositories.push(repository);
        });
        this.trainingLoaded = true;
      })
    );
  }

  $reqPublic() {
    return agent.Webserver.listFolders(this.settings.nginxPath.public);
  }

  $reqPrivate() {
    return agent.Webserver.listFolders(this.settings.nginxPath.private);
  }

  $reqPrivateFiles(path) {
    return agent.Webserver.listFiles(this.settings.nginxPath.private + path);
  }

  $reqTraining() {
    return agent.Webserver.listFolders(this.settings.nginxPath.training);
  }
}

export default new modelRepositoriesStore();
