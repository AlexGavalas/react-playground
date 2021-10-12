import { Component } from 'react';
import { render } from 'react-dom';

import { useRxStore } from './rx-store';

const styles = {
    alignItems: 'center',
    display: 'flex',
    fontSize: '150%',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '100vh',
};

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

const Wrapper = () => {
    const r = useRxStore();

    // throw new Error('Hey');
    // console.log(r);

    return <div style={styles}>{JSON.stringify(r)}</div>;
};

render(
    <ErrorBoundary>
        <Wrapper />
    </ErrorBoundary>,
    document.getElementById('root'),
);
