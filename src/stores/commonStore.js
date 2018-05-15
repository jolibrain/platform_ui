import { observable, action, reaction } from 'mobx';

class CommonStore {

  @observable appName = 'DeepDetect - Core UI';
  @observable token = window.localStorage.getItem('token');
  @observable appLoaded = false;

  constructor() {
    reaction(
      () => this.token,
      token => {
        if (token) {
          window.localStorage.setItem('token', token);
        } else {
          window.localStorage.removeItem('token');
        }
      }
    );
  }

  @action setToken(token) {
    this.token = token;
  }

  @action setAppLoaded() {
    this.appLoaded = true;
  }

}

export default new CommonStore();
