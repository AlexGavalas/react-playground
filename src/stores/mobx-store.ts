import { observable, computed, action } from 'mobx';
import axios from 'axios';

class State1 {
    @observable statevar = 1;

    @action.bound setState() {
        this.statevar++;
    }
}

class State2 {
    @observable statevar = 2;

    @action setState() {
        this.statevar++;
    }
}

export class State {
    state1 = new State1();
    state2 = new State2();

    @computed get property() {
        return this.state1.statevar + this.state2.statevar;
    }
}

export default class Counter {
    @observable counter = 0;
    @observable repos: number[] = [];
    @observable loading = false;
    @observable cancelled = false;
    @observable abortController = new AbortController();

    @computed get reposCount() {
        return this.repos.length;
    }

    @computed get count() {
        return this.counter;
    }

    @computed get loadingState() {
        return this.loading;
    }

    @action setLoadingState(state: boolean) {
        this.loading = state;
    }

    @action increase() {
        this.counter++;
    }

    @action cancelRequest() {
        if (this.loading) {
            this.abortController.abort();
        }
    }

    @action initCancel() {
        this.abortController = new AbortController();
    }

    @action async searchRepos() {
        if (this.loading) return;

        this.setLoadingState(true);

        const url = 'http://localhost:3000/items';

        try {
            const { data } = await axios.get(url, {
                signal: this.abortController.signal,
            });

            this.setRepos(data);
        } catch (e) {
            this.setRepos([1]);
        } finally {
            this.setLoadingState(false);
        }
    }

    @action.bound setRepos(repos: number[]) {
        this.repos = repos;
    }
}
