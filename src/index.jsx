import { Component, useState } from 'react';
import { render } from 'react-dom';

const styles = {
    alignItems: 'center',
    display: 'flex',
    fontSize: '150%',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '100vh',
};

// eslint-disable-next-line no-unused-vars
class ErrorBoundary extends Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.log({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div>
                    <h1>Oops</h1>
                    <button onClick={() => this.setState({ hasError: false })}>
                        Try again?
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

import axios from 'axios';

const Wrapper = () => {
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
        <div style={styles}>
            {data.length > 0 && <div data-testid="1">{data.length}</div>}
            {data2 && <div data-testid="2">test {data2.id}</div>}
            <button onClick={() => setCount(count + 1)}>Add one</button>
        </div>
    );
};

import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { ApiProvider } from '@reduxjs/toolkit/query/react';
import { itemsAPI } from './redux-store';

const client = new QueryClient();

export const App = () => {
    return (
        <QueryClientProvider client={client}>
            <Wrapper />
        </QueryClientProvider>
    );
};

const Item = ({ item }) => {
    const [t, setT] = useState(item.title);
    const [updateOne] = itemsAPI.useUpdateOneMutation();

    return (
        <div>
            <input value={t} onChange={(e) => setT(e.target.value)} />
            <button onClick={() => updateOne({ ...item, title: t })}>
                Save
            </button>
        </div>
    );
};

const RTKAppDemo = () => {
    const { data: items = [] } = itemsAPI.useGetAllQuery();

    return (
        <div style={styles}>
            {items.map((item) => {
                return <Item item={item} key={item.id} />;
            })}
        </div>
    );
};

const RTKApp = () => (
    <ApiProvider api={itemsAPI}>
        <RTKAppDemo />
    </ApiProvider>
);

render(<RTKApp />, document.getElementById('root'));
