import { ReactNode } from 'react';

import { App as DemoApp } from './react-router';

import './index.css';

const styles = {
    display: 'grid',
    placeContent: 'center',
    gap: '5rem',
    height: '100%',
    padding: '2rem',
};

// TODO: Remove this
const CenterLayout = ({ children }: { children?: ReactNode }) => (
    <div style={styles}>{children}</div>
);

export const App = () => {
    return (
        <CenterLayout>
            <DemoApp />
        </CenterLayout>
    );
};
