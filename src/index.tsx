import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';

import { App } from './app';

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
