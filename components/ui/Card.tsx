import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div 
      className={cn(
        "bg-ocean-800/60 backdrop-blur-md border border-white/10 rounded-xl shadow-xl text-white",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
}
