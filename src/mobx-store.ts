import { observable, computed, action } from 'mobx';
import { toStream } from 'mobx-utils';
import { from } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { pluck, takeUntil, tap } from 'rxjs/operators';

const makeRequest = ({ url, onSuccess, cancelStream$, onCancel, onError }) => {
    ajax.get(url)
        .pipe(
            pluck('response'),
            takeUntil(from(cancelStream$).pipe(onCancel())),
        )
        .subscribe(onSuccess, onError, () => console.log('Done'));
};

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
    @observable repos = [];
    @observable loading = false;
    @observable cancelled = false;

    @computed get reposCount() {
        return this.repos.length;
    }

    @computed get count() {
        return this.counter;
    }

    @computed get loadingState() {
        return this.loading;
    }

    @action setLoadingState(state) {
        this.loading = state;
    }

    @action increase() {
        this.counter++;
    }

    @action cancelRequest() {
        if (this.loading) {
            this.cancelled = true;
        }
    }

    @action initCancel() {
        this.cancelled = false;
    }

    @action searchRepos() {
        if (this.loading) return;

        this.setLoadingState(true);

        const url = `http://localhost:3000/items`;

        const cancelStream$ = toStream(() => this.cancelled);

        const onCancel = () => {
            return tap(() => {
                this.setLoadingState(false);
                this.initCancel();
            });
        };

        const onSuccess = (data) => {
            this.setRepos(data);
            this.setLoadingState(false);
        };

        const onError = () => {
            this.setLoadingState(false);
            this.setRepos([1]);
        };

        makeRequest({ url, onSuccess, cancelStream$, onCancel, onError });
    }

    @action.bound setRepos(repos) {
        this.repos = repos;
    }
}
