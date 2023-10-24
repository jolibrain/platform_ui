import { autorun, set, toJS } from "mobx";
import store from "store";

const autoSave = function(_this, key) {
  let firstRun = true;

  // will run on change
  autorun(() => {
    // on load check if there's an existing store on localStorage and extend the store
    if (firstRun) {
      const existingStore = store.get(key);
      if (existingStore) {
        set(_this, existingStore);
      }
    }

    // limit storage of objects under 1Mo
    const obj = toJS(_this);
    if (JSON.stringify(obj).length < 1000000) {
      // from then on serialize and save to localStorage
      store.set(key, obj);
    }
  });

  firstRun = false;
}
export default autoSave;
