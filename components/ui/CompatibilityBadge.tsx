import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface CompatibilityBadgeProps {
  status: 'ok' | 'warning' | 'error';
  className?: string;
}

export function CompatibilityBadge({ status, className = '' }: CompatibilityBadgeProps) {
  if (status === 'ok') {
    return (
      <div className={`flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full border border-green-200 text-sm font-medium ${className}`}>
        <CheckCircle className="w-4 h-4" /> Compatible
      </div>
    );
  }
  
  if (status === 'warning') {
    return (
      <div className={`flex items-center gap-2 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full border border-yellow-200 text-sm font-medium ${className}`}>
        <AlertTriangle className="w-4 h-4" /> Warnings
      </div>
    );
  }
  
  return (
    <div className={`flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full border border-red-200 text-sm font-medium ${className}`}>
      <XCircle className="w-4 h-4" /> Incompatible
    </div>
  );
}
