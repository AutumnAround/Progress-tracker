import React, { Component, ReactNode } from "react";

type ErrorBoundaryProps = { children: ReactNode };
type ErrorBoundaryState = { hasError: boolean };

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <h2>Что-то пошло не так... Перезагрузите страницу.</h2>;
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
