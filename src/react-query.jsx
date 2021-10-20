import { useState } from 'react';
import { useQuery, QueryClient, QueryClientProvider } from 'react-query';
import axios from 'axios';

const Content = () => {
    const [count, setCount] = useState(0);

    const { data = [] } = useQuery('items', async () => {
        const { data } = await axios.get('http://localhost:3000/items');
        return data;
    });

    const { data: data2 } = useQuery(
        'items 2',
        async () => {
            const { data: d } = await axios.get(
                `http://localhost:3000/items?id=${data[0].id}`,
            );

            return d;
        },
        {
            enabled: !!data.length,
        },
    );

    return (
        <>
            {data.length > 0 && <div data-testid="1">{data.length}</div>}
            {data2 && <div data-testid="2">test {data2.id}</div>}
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
