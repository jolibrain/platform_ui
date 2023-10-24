import { makeAutoObservable } from "mobx";
import agent from "../agent";

export default class buildInfoStore {
  isReady = false;

  version = "dev";
  latestDockerTag = null;

  constructor() {
    makeAutoObservable(this);
  }

  $reqDockerTags() {
    return agent.BuildInfo.getDockerTags();
  }

  $reqVersion() {
    return agent.BuildInfo.getVersion();
  }

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

  _updateVersion(version) {
    this.version = version;
  }

  _updateDockerTag(dockerTag) {
    this.latestDockerTag = dockerTag;
  }

  loadBuildInfo(callback = () => {}) {
    this.$reqVersion().then(version => {

      if(
        typeof version !== 'undefined' &&
          version
      ) {
        this._updateVersion(version);
        this.loadLatestDockerTag();
      }

      callback(this);
    })
  }

  loadLatestDockerTag() {
    this.$reqDockerTags().then(dockerTags => {
      const dockerTag = dockerTags &&
        dockerTags.results &&
        dockerTags.results
                  .find(tag => {
                    return tag.match(/v\d+\.\d+\.\d+$/g)
                  });
      this._updateDockerTag(dockerTag);
    })
  }
}
