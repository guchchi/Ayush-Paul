import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Container } from './ui/Container';
import { FirebaseConfigWarning } from './FirebaseConfigWarning';
import { getFirebaseStatus } from '../firebase';

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const errorStr = this.state.error?.toString() || "";
      const isConfigError = errorStr.includes("invalid-api-key") ||
        errorStr.includes("Firebase: Error") ||
        errorStr.includes("network-request-failed") ||
        !getFirebaseStatus().isConfigured;

      if (isConfigError) {
        return <FirebaseConfigWarning variant="fullscreen" />;
      }

      return (
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6">
          <Container>
            <div className="glass-card p-12 rounded-[40px] border border-red-500/20 max-w-2xl mx-auto text-center">
              <div className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-500 mx-auto mb-8">
                <AlertCircle size={40} />
              </div>
              <h1 className="text-3xl font-bold mb-4">Something went wrong.</h1>
              <p className="text-white/40 mb-8 leading-relaxed">
                We've encountered an unexpected error. Don't worry, your data is safe.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-4 bg-brand-primary text-white rounded-2xl font-bold hover:scale-105 transition-all"
              >
                Reload Page
              </button>
              <pre className="mt-8 p-6 bg-black/50 rounded-2xl text-left text-xs text-red-400 overflow-auto max-h-[200px]">
                {this.state.error?.toString()}
              </pre>
            </div>
          </Container>
        </div>
      );
    }

    return this.props.children;
  }
}
