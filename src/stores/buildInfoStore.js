import { observable, action, computed } from "mobx";
import agent from "../agent";

export class buildInfoStore {
  @observable isReady = false;

  @observable version = "dev";
  @observable latestDockerTag = null;

  $reqDockerTags() {
    return agent.BuildInfo.getDockerTags();
  }

  $reqVersion() {
    return agent.BuildInfo.getVersion();
  }

  @computed
  get isUpdatable() {

    const versionRegex = /v(\d+)\.(\d+)\.(\d+).*/gm;

    // By default, platform_ui is not updatable
    let updatable = false;

    if (
      this.version &&
        this.latestDockerTag &&
        versionRegex.test(this.version) &&
        versionRegex.test(this.latestDockerTag)
    ) {

      // if information is available
      // updatable flag is set to true
      // if latestDockerTag array contains a new non-ci minor version
      //
      // version: v0.10.0
      // latestDockerTag: v0.10.1
      // updatable: true
      //
      // version: v0.10.0
      // latestDockerTag: v0.10.1-ci-commit_hash
      // updatable: false
      //
      // version: v0.10.0
      // latestDockerTag: v0.10.0
      // updatable: false

      const localMatch = versionRegex.exec(this.version);
      const localMajor = parseInt(localMatch[1]),
            localMinor = parseInt(localMatch[2]),
            localPatch = parseInt(localMatch[3]);

      const dockerMatch = versionRegex.exec(this.latestDockerTag);
      const dockerMajor = parseInt(dockerMatch[1]),
            dockerMinor = parseInt(dockerMatch[2]),
            dockerPatch = parseInt(dockerMatch[3]);

      updatable = dockerMajor > localMajor ||
        (dockerMajor === localMajor && dockerMinor > localMinor) ||
        (dockerMajor === localMajor && dockerMinor === localMinor && dockerPatch > localPatch);
    }

    return updatable;
  }

  @action
  loadBuildInfo(callback = () => {}) {
    this.$reqVersion().then(
      action(version => {

        if(
          typeof version !== 'undefined' &&
            version
        ) {
          this.version = version;
          this.loadLatestDockerTag();
        }

        callback(this);
      })
    );
  }

  @action
  loadLatestDockerTag() {
    this.$reqDockerTags().then(
      action(dockerTags => {
        this.latestDockerTag = dockerTags &&
          dockerTags.results &&
          dockerTags.results
          .find(tag => {
            return tag.match(/v\d+\.\d+\.\d+$/g)
          });
      })
    );
  }
}

export default new buildInfoStore();
