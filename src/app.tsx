import { ReactNode } from 'react';

import { useMutation, useQuery, useQueryClient } from 'react-query';

import './index.css';

const styles = {
    display: 'grid',
    placeContent: 'center',
    gap: '5rem',
    height: '100%',
    padding: '2rem',
};

const CenterLayout = ({ children }: { children?: ReactNode }) => (
    <div style={styles}>{children}</div>
);

const useCustomHook = () => {
    const queryClient = useQueryClient();

    const { data, isFetching } = useQuery(['test'], () =>
        fetch('hello').then((res) => res.json()),
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
                return queryClient.refetchQueries(['test']);
            },
        },
    );

    return { isFetching, data, mutate, isLoading };
};

export const App = () => {
    // const { data, mutate, isLoading } = useCustomHook();

    return (
        <CenterLayout>
            {/* <button onClick={() => mutate({ title: 'Hey' })}>
                {isLoading ? 'Creating...' : 'Create'}
                {JSON.stringify(data)}
            </button> */}
        </CenterLayout>
    );
};
