import { useState } from 'react';
import { useQuery, QueryClient, QueryClientProvider } from 'react-query';
import axios from 'axios';

const select = ({ data }) => data;

export const Content = () => {
    const [count, setCount] = useState(0);

    const { data = [] } = useQuery(
        'items',
        () => axios.get('http://localhost:3000/items'),
        { select },
    );

    const { data: item } = useQuery(
        'items 2',
        () => axios.get(`http://localhost:3000/items?id=${data[0].id}`),
        {
            select,
            enabled: !!data.length,
        },
    );

    return (
        <>
            {data.length > 0 && <div data-testid="1">{data.length}</div>}
            {item && <div data-testid="2">test {item.id}</div>}
            <button onClick={() => setCount(count + 1)}>Add one</button>
        </>
    );
};

const client = new QueryClient();

export const ReactQueryApp = () => {
    return (
        <QueryClientProvider client={client}>
            <Content />
        </QueryClientProvider>
    );
};
