import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Keep this for diagnostics in browser console/log collectors
    // eslint-disable-next-line no-console
    console.error('Unhandled UI error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '24px' }}>
          <div style={{ maxWidth: 520, textAlign: 'center', lineHeight: 1.5 }}>
            <h1>Something went wrong</h1>
            <p>The page failed to render. Please refresh once. If it continues, try again in a minute.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
