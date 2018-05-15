import { observable, action, computed } from 'mobx';
import agent from '../agent';

const LIMIT = 10;

export class ServicesStore {

    @observable isLoading = false;
    @observable page = 0;
    @observable totalPagesCount = 0;
    @observable servicesRegistry = observable.map();
    @observable predicate = {};

    @computed get services() {
          return this.servicesRegistry.values();
        };

    @action setPage(page) {
          this.page = page;
        }

    clear() {
          this.servicesRegistry.clear();
          this.page = 0;
        }

    $req() {
          return agent.Deepdetect.services(this.page, LIMIT, this.predicate);
        }

    @action loadServices() {
          this.isLoading = true;
          return this.$req()
            .then(action(({ services, servicesCount }) => {
                      this.servicesRegistry.clear();
                      services.forEach(service => this.servicesRegistry.set(service.name, service));
                      this.totalPagesCount = Math.ceil(servicesCount / LIMIT);
                    }))
            .finally(action(() => { this.isLoading = false; }));
        }

    @action loadArticle(slug, { acceptCached = false } = {}) {
          if (acceptCached) {
                  const article = this.getArticle(slug);
                  if (article) return Promise.resolve(article);
                }
          this.isLoading = true;
          return agent.Deepdetect.service(slug)
            .then(action(({ article }) => {
                      this.servicesRegistry.set(article.slug, article);
                      return article;
                    }))
            .finally(action(() => { this.isLoading = false; }));
        }


    @action createService(service) {
          return agent.Deepdetect.createService(service)
            .then(({ service }) => {
                      this.servicesRegistry.set(service.name, service);
                      return service;
                    })
        }

    @action deleteArticle(slug) {
          this.servicesRegistry.delete(slug);
          return agent.Deepdetect.deleteService(slug)
            .catch(action(err => { this.loadServices(); throw err; }));
        }
}

export default new ServicesStore();
