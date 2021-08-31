import { observable, action } from "mobx";

export class pathFilterStore {
    @observable filters = [];

    @action
    addPathFilter = path => {
        if(!this.filters.includes(path))
            this.filters = [...this.filters, path]
    }

    @action
    removePathFilter = path => {
        let newFilteredPath = [...this.filters]
        newFilteredPath.splice(newFilteredPath.indexOf(path), 1)
        this.filters = newFilteredPath
    }
}

export default new pathFilterStore();
