import React from 'react';
import { CheckCircle, Info, AlertTriangle } from 'lucide-react';

export function Toast({ toasts }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className="toast">
          {toast.type === 'success' && <CheckCircle size={18} color="#34d399" />}
          {toast.type === 'info' && <Info size={18} color="#818cf8" />}
          {toast.type === 'warning' && <AlertTriangle size={18} color="#fbbf24" />}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
