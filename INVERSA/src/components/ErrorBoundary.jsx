import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import Button from '../components/Button';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-white dark:bg-dark-background flex items-center justify-center px-4">
                    <div className="max-w-md w-full text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                            <FiAlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-light-primary dark:text-dark-primary mb-2">
                            Oops! Something went wrong
                        </h1>
                        <p className="text-light-secondary dark:text-dark-secondary mb-6">
                            We encountered an unexpected error. Please try again or contact support.
                        </p>
                        {process.env.NODE_ENV === 'development' && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-left">
                                <p className="text-xs font-mono text-red-600 dark:text-red-400 break-words">
                                    {this.state.error?.message}
                                </p>
                            </div>
                        )}
                        <Button variant="primary" onClick={this.handleReset}>
                            Go to Home
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
