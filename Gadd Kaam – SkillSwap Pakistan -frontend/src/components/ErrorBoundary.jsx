// src/components/ErrorBoundary.jsx
import React from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
          backgroundColor: '#f8fafc',
          color: '#1e293b'
        }}>
          <div style={{
            maxWidth: '500px',
            background: '#ffffff',
            padding: '40px',
            borderRadius: '16px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              display: 'inline-flex',
              padding: '16px',
              borderRadius: '50%',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              marginBottom: '20px'
            }}>
              <AlertTriangle size={48} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
              Something Went Wrong
            </h2>
            <p style={{ color: '#64748b', fontSize: '15px', lineHeight: '1.6', marginBottom: '28px' }}>
              We encountered an unexpected problem loading this section of Gadd Kaam. Please try refreshing the page or returning to the home screen.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={this.handleReload}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  backgroundColor: '#e38b40',
                  color: '#ffffff',
                  fontWeight: '600',
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                <RotateCcw size={16} /> Reload Page
              </button>
              <button
                onClick={this.handleGoHome}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  backgroundColor: '#f1f5f9',
                  color: '#334155',
                  fontWeight: '600',
                  fontSize: '14px',
                  border: '1px solid #cbd5e1',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                <Home size={16} /> Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
