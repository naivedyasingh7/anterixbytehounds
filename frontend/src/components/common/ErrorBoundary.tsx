import React, { Component, ErrorInfo, ReactNode } from 'react';
import { DharaNav } from './DharaNav';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FBF9F5] text-[#1B1D1C] font-sans selection:bg-[#8B5F4D]/25 selection:text-[#1B1D1C]">
          <DharaNav />
          <main className="max-w-xl mx-auto px-6 pt-48 pb-20 text-center space-y-6">
            <div className="bg-[#F5EFE6] border border-[#EAE3D9] p-8 sm:p-10 rounded-3xl shadow-[0_4px_24px_rgba(27,29,28,0.03)] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EAE3D9] text-[#8B5F4D] flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#1B1D1C]">
                Workspace Safety Shield
              </h2>
              <p className="text-xs sm:text-sm text-[#68625B] leading-relaxed max-w-md mx-auto">
                A rendering issue was intercepted safely. Your session and records are intact.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    this.setState({ hasError: false });
                    window.history.back();
                  }}
                  className="px-6 py-2.5 rounded-full bg-[#1B1D1C] text-[#FBF9F5] text-xs font-sans font-medium hover:bg-[#333634] transition active:scale-95 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Go Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    this.setState({ hasError: false });
                    window.location.href = '/';
                  }}
                  className="px-6 py-2.5 rounded-full bg-[#8B5F4D] text-[#FBF9F5] text-xs font-sans font-medium hover:bg-[#74503F] transition active:scale-95 flex items-center gap-1.5"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Return Home</span>
                </button>
              </div>
            </div>
          </main>
        </div>
      );
    }

    return this.props.children;
  }
}
