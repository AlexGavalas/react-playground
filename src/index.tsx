import { FC } from 'react';
import { render } from 'react-dom';

import { LineChart } from './charts/line';

import './index.css';

const styles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, 1fr)',
    gridAutoRows: 'minmax(0, 1fr)',
    gap: '5rem',
    height: '100%',
    padding: '2rem',
};

const CenterLayout: FC = ({ children }) => <div style={styles}>{children}</div>;

const App = () => {
    return (
        <CenterLayout>
            <LineChart />
        </CenterLayout>
    );
};

render(<App />, document.getElementById('root'));
