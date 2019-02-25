import { observable, action, computed } from "mobx";
import agent from "../agent";

export class buildInfoStore {
  @observable isReady = false;

  @observable buildCommitHash = null;
  @observable buildDate = null;
  @observable branch = null;

  @observable dockerVersions = {};

  $reqBuild() {
    return agent.BuildInfo.get();
  }

  $reqVersion() {
    return agent.VersionInfo.get();
  }

  @computed
  get isUpdatable() {
    return (
      this.dockerVersions.local &&
      this.dockerVersions.remote &&
      this.dockerVersions.local.length > 0 &&
      this.dockerVersions.remote.length > 0 &&
      this.dockerVersions.local.some(v => {
        const remote = this.dockerVersions.remote.find(r => r.name === v.name);
        return !remote || remote.version !== v.version;
      })
    );
  }

  @action
  loadBuildInfo(callback = () => {}) {
    this.$reqBuild().then(
      action(buildInfo => {
        if (buildInfo) {
          this.buildCommitHash = buildInfo.buildCommitHash;
          this.buildDate = buildInfo.buildDate;
          this.branch = buildInfo.branch;
          this.isReady = true;
        }
        this.checkVersion();
        callback(this);
      })
    );
  }

  @action
  checkVersion() {
    this.$reqVersion().then(
      action(info => {
        this.dockerVersions = info;
      })
    );
  }
}

export default new buildInfoStore();
