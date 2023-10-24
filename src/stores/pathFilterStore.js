import { makeAutoObservable } from "mobx";

export default class pathFilterStore {
    filters = [];

    constructor() {
        makeAutoObservable(this);
    }

    addPathFilter = path => {
        if(!this.filters.includes(path))
            this.filters = [...this.filters, path]
    }

    removePathFilter = path => {
        let newFilteredPath = [...this.filters]
        newFilteredPath.splice(newFilteredPath.indexOf(path), 1)
        this.filters = newFilteredPath
    }
}
