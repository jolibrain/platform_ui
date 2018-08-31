/* global describe, it, before */

import chai from "chai";

import modelRepositoriesStore from "../../src/stores/modelRepositoriesStore";

chai.expect();
const expect = chai.expect;

describe("Model repositories store setup", () => {
  it("setup model repositories store", () => {
    const store = new modelRepositoriesStore();

    store.setup({
      modelRepositories: [
        {
          name: "public",
          nginxPath: "/store/public",
          systemPath: "/opt/platform/models/public"
        }
      ]
    });

    except(store.isReady).to.equal(true);
    except(store.repositoryStores).to.have.lengthOf(1);
  });
});
