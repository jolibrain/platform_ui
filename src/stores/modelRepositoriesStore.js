import { observable, action } from 'mobx';
import agent from '../agent';

export class modelRepositoriesStore {

  @observable isLoaded = false;
  @observable settings = {};
  @observable repositories = []

  @action setup(configStore) {
    this.settings = configStore.modelRepositories;
    this.load();
  }

  $req() {
    return agent.ModelRepositories.getRelativePath(this.settings);
  }

  @action load() {
    this.$req()
      .then(action( repositories => {
        this.repositories = repositories.map( repo => {
          return this.settings.systemPath + repo
        });
        console.log(this.repositories);
        this.isLoaded = true;
      }));
  }
}

export default new modelRepositoriesStore();
