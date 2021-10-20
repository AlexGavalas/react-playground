import { render } from 'react-dom';

const styles = {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '100vh',
    gap: '1rem',
};

const CenterLayout = ({ children }) => <div style={styles}>{children}</div>;

const App = () => <CenterLayout>Put app here to test</CenterLayout>;

render(<App />, document.getElementById('root'));
