import { ReactNode, FC, createContext, useState, useContext } from 'react';

interface ContextI {
    count: number;
    inc: () => void;
}

const CounterContext = createContext<ContextI | null>(null);

export const CounterProvider: FC<{ children: ReactNode }> = ({ children }) => {
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
