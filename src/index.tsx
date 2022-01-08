import { render } from 'react-dom';

import { LineChart } from './charts/line';
import { TimeSeries } from './charts/time-series';
import { Histogram } from './charts/histogram';

import './index.css';

const styles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, 1fr)',
    gridAutoRows: 'minmax(0, 1fr)',
    gap: '5rem',
    height: '100%',
    padding: '2rem',
};

const CenterLayout = ({ children }) => <div style={styles}>{children}</div>;

const App = () => {
    return (
        <CenterLayout>
            <LineChart />
            <TimeSeries />
            <Histogram />
        </CenterLayout>
    );
};

render(<App />, document.getElementById('root'));
