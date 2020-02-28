import { observable, action } from "mobx";
import agent from "../agent";
import path from "path";

export class dataRepositoriesStore {
  @observable loaded = false;
  @observable isLoading = false;
  @observable settings = {};
  @observable repositories = [];

  @action
  setup(configStore) {
    this.settings = configStore.dataRepositories;

    if (typeof this.settings.maxDepth === "undefined")
      this.settings.maxDepth = 1;
  }

  async refresh() {
    this.isLoading = true;
    let repositories = await this.load(this.settings.nginxPath);

    // Append id attribute to new repositories
    repositories.forEach((o, i) => (o.id = i));
    this.repositories = repositories;

    this.isLoading = false;
    this.loaded = true;
  }

  $reqFolder(rootPath) {
    return agent.Webserver.listFolders(rootPath);
  }

  @action
  async load(rootPath, level = 0) {
    return new Promise(resolve => {
      let repositories = [];

      this.$reqFolder(rootPath)
        .then(async content => {
          const { folders } = content;

          const filteredFolders = folders.filter(f => {
            let keepFolder = true;

            if (this.settings.filter) {
              if (this.settings.filter.exclude) {
                keepFolder = this.settings.filter.exclude.every(
                  e => f.href.indexOf(e) === -1
                );
              }
            }

            //
            // Uncomment following section if you need to debug filter
            //
            // if (!keepFolder)
            //   console.log(
            //     "dataRepositoriesStore - load - folder filtered out: " +
            //       rootPath +
            //       " - " +
            //       f.href
            //   );

            return keepFolder;
          });

          for (const folder of filteredFolders) {
            const fPath = path.join(rootPath, folder.href, "/");
            const fLabel = fPath.replace(/^\/data\//gm, "");
            let containsSubRepositories = false;

            // Only allow `this.settings.maxDepth` level of recursion
            // in order to avoid data loading issues
            if (level < this.settings.maxDepth) {
              const subRepositories = await this.load(fPath, level + 1);

              if (subRepositories.length > 0) {
                repositories = repositories.concat(subRepositories);
                containsSubRepositories = true;
              }
            }

            //
            // Only add current folder if it doesn't contain sub-folders
            //
            // it avoids issue when selecting a data folder, it should only contains
            // data and no sub-folders
            if (!containsSubRepositories) {
              repositories.push({
                name: folder.name,
                path: fPath,
                label: fLabel
              });
            }
          }
        })
        .finally(() => {
          resolve(repositories);
        });
    });
  }
}

export default new dataRepositoriesStore();
