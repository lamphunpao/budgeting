
import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

const StatCard = ({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
  className
}: StatCardProps) => {
  return (
    <Card className={cn("overflow-hidden card-hover", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && (
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse-light"></div>
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/70 text-white flex items-center justify-center shadow-lg shadow-primary/20 relative z-10">
              {icon}
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <CardDescription className="text-xs text-muted-foreground mt-1">
            {description}
          </CardDescription>
        )}
        {trend && trendValue && (
          <p className={cn(
            "text-xs font-medium mt-2 flex items-center gap-1",
            trend === 'up' && "text-green-500",
            trend === 'down' && "text-red-500"
          )}>
            <span className={cn(
              "inline-block w-5 h-5 rounded-full flex items-center justify-center shadow-sm",
              trend === 'up' && "bg-green-100",
              trend === 'down' && "bg-red-100",
              trend === 'neutral' && "bg-gray-100"
            )}>
              {trend === 'up' && '↑'}
              {trend === 'down' && '↓'}
              {trend === 'neutral' && '→'}
            </span> 
            {trendValue}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
