import { createContext, useState, useContext } from 'react';

const CounterContext = createContext();

export const CounterProvider = ({ children }) => {
    const [count, setCount] = useState(0);

    const providerValue = {
        count,
        inc: () => setCount(count + 1),
    };

    return (
        <CounterContext.Provider value={providerValue}>
            {children}
        </CounterContext.Provider>
    );
};

export const useCount = () => {
    return useContext(CounterContext);
};
