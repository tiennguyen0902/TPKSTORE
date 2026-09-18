import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[280px] w-full flex items-center justify-center p-6 bg-[#0b0f19] text-slate-100">
          <div className="max-w-md w-full p-6 rounded-3xl bg-[#131c2e] border border-slate-800 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-white">
              {this.props.fallbackTitle || "Đã xảy ra lỗi hiển thị"}
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              {this.props.fallbackMessage ||
                "Hệ thống đã tự động bảo vệ phiên làm việc của bạn để tránh màn hình bị treo. Bạn có thể làm mới hoặc đóng cửa sổ này."}
            </p>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Đóng thông báo</span>
              </button>

              <button
                onClick={this.handleReload}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-lg shadow-violet-600/30 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Tải lại trang</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
