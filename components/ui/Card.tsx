import { cn } from '@/lib/utils';

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        "bg-white border border-slate-200 rounded-xl shadow-sm text-slate-900",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
}
