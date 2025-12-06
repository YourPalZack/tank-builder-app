import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, children, ...props }: CardProps) {
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
