import { observable, action, computed } from 'mobx';
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
        this.isLoaded = true;
      }));
  }

  @computed get autocompleteRepositories() {
    const data = this.repositories.map( (repo, index) => {
      return {
        id: index,
        label: repo
      }
    });
    console.log(data);
    return data;
  }

}

export default new modelRepositoriesStore();
