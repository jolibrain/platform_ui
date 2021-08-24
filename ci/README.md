# Platform_ui release to dockerhub

## howto release a new version on dockerhub

1. Create a new _Draft_ release on github
```
git clone https://github.com/jolibrain/platform_ui.git
cd platform_ui
./ci/release.sh
# by default, release a new patch version: v0.18.0 -> v0.18.1
# to release a minor version - v0.18.0 -> v0.19.0: ./ci/release.sh -minor
```
2. Edit newly created _Draft_ release to publish it on github: https://github.com/jolibrain/platform_ui/releases
3. Find release on jenkins `platform-ui-docker-build` tag tab, and press start icon to schedule a build: http://ip_ci/job/platform-ui-docker-build/view/tags/


## from platform_ui repository to github release

- `ci/release.sh`
	- runs `standard-version` command with `--release-as` option with the argument `major`, `minor` or `patch` (*default*)
	- `standard-version` command modifies the version number in `package.json`, this new version number will be used as the `tag` in the following commands
	- fetch changes from `CHANGELOG.md` and add them to `notes.md`
	- `tag` and `notes.md` are used to create a new release on github
	- Then, the new release will be available as a _Draft_ on github release page, this _Draft_ flag can be removed by editing the release information.

## from github release to dockerhub

http://ip_ci/job/platform-ui-docker-build/

- configured to discover new tags on github `platform_ui` repository: http://ip_ci/job/platform-ui-docker-build/configure
- new tags appear in tag tab: http://ip_ci/job/platform-ui-docker-build/view/tags/
- when a tag is available, it can be schedule for a build. Using `v0.18.0` as example: http://ip_ci/job/platform-ui-docker-build/view/tags/job/v0.18.0/build?delay=0sec

Jenkins script is available in `platform_ui` repository: `ci/Jenkinsfile.docker`:

- it runs the script `ci/build-docker-image.sh` to build `jolibrain/platform_ui` docker image, tag it with the correct version number and push it to docker hub.
- it updates the dockerhub readme with `docker-pushrm`: https://github.com/christian-korneck/docker-pushrm//
