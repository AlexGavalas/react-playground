import { useEffect, useState } from 'react';
import { ajax } from 'rxjs/ajax';
import { tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

const dataStore = {
    data: new BehaviorSubject([]),
    loading: new BehaviorSubject(false),
    getData() {
        this.loading.next(true);

        ajax.getJSON('http://localhost:3000/items')
            .pipe(
                tap((data) => {
                    this.data.next(data);
                    this.loading.next(false);
                }),
            )
            .subscribe();
    },
};

const useObservableValue = (value) => {
    const [data, setData] = useState(value.getValue());

    useEffect(() => {
        value.subscribe(setData);

        return () => value.unsubscribe();
    }, []);

    return data;
};

export const useRxStore = () => {
    const data = useObservableValue(dataStore.data);
    const loading = useObservableValue(dataStore.loading);

    useEffect(() => {
        dataStore.getData();
    }, []);

    return { data, loading };
};
