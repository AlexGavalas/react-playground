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
    const [count, setCount] = useState(0);

    return (
        <div style={styles}>
            Testing {count}
            <button onClick={() => setCount(count + 1)}>Add one</button>
        </div>
    );
};

render(
    <ErrorBoundary>
        <Wrapper />
    </ErrorBoundary>,
    document.getElementById('root'),
);
