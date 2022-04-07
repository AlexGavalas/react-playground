import { FC } from 'react';
import { createRoot } from 'react-dom/client';

import {
    QueryClient,
    QueryClientProvider,
    useMutation,
    useQuery,
    useQueryClient,
} from 'react-query';

import './index.css';

const styles = {
    display: 'grid',
    placeContent: 'center',
    gap: '5rem',
    height: '100%',
    padding: '2rem',
};

const CenterLayout: FC = ({ children }) => <div style={styles}>{children}</div>;

const useCustomHook = () => {
    const queryClient = useQueryClient();

    const { data, isFetching } = useQuery(
        ['test'],
        () => {
            console.log('running');

            return fetch('https://jsonplaceholder.typicode.com/posts/1').then(
                (res) => res.json(),
            );
        },
        {
            onSuccess: () => {
                console.log('success');
            },
        },
    );

    const { mutate, isLoading } = useMutation(
        ({ title }: { title: string }) => {
            return fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                body: JSON.stringify({
                    title,
                    body: 'bar',
                    userId: 1,
                }),
                headers: {
                    'Content-type': 'application/json',
                },
            }).then((res) => res.json());
        },
        {
            onSuccess: () => {
                queryClient.refetchQueries(['test']);
            },
        },
    );

    return { isFetching, data, mutate, isLoading };
};

const App = () => {
    const { mutate, isLoading } = useCustomHook();

    return (
        <CenterLayout>
            <button onClick={() => mutate({ title: 'Hey' })}>
                {isLoading ? 'Creating...' : 'Create'}
            </button>
        </CenterLayout>
    );
};

const container = document.getElementById('root');

if (!container) throw new Error('Could not find root element');

const root = createRoot(container);

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

root.render(
    <QueryClientProvider client={queryClient}>
        <App />
    </QueryClientProvider>,
);
