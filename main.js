const { Observable, of } = require('rxjs');

const double = (source) =>
    new Observable((subscriber) => {
        const subscription = source.subscribe({
            next: (value) => subscriber.next(2 * value),
            error: (err) => subscriber.error(err),
            complete: () => subscriber.complete(),
        });

        return () => {
            subscription.unsubscribe();
        };
    });

of(1, 2, 3).pipe(double).subscribe(console.log);

const obs = new Observable((subscriber) => {
    subscriber.next(10);
});

const observer = {
    next: console.log,
    error: console.log,
    complete: console.log,
};

obs.subscribe(observer);
