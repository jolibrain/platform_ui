import { autorun, set, toJS } from "mobx";
import store from "store";

export default function(_this, key) {
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

    // from then on serialize and save to localStorage
    store.set(key, toJS(_this));
  });

  firstRun = false;
}
