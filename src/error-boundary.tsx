import { Component, ErrorInfo, ReactNode } from 'react';

export class ErrorBoundary extends Component<{ children?: ReactNode }> {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.log({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div>
                    <h1>Oops</h1>
                    <button onClick={() => this.setState({ hasError: false })}>
                        Reload
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
