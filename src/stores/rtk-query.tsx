import { useState } from 'react';
import { ApiProvider } from '@reduxjs/toolkit/query/react';

import { itemsAPI } from './redux-store';

interface Item {
    id: number;
    author: string;
    title: string;
}

const Item = ({ item }: { item: Item }) => {
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
    const { data: items = [] } = itemsAPI.useGetAllQuery(null);

    return (
        <>
            {items.map((item) => (
                <Item item={item} key={item.id} />
            ))}
        </>
    );
};

export const RTKApp = () => (
    <ApiProvider api={itemsAPI}>
        <RTKAppDemo />
    </ApiProvider>
);
