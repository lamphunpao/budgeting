
import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  description?: string;
  date?: string;
}

const PageContainer = ({
  children,
  title,
  description,
  date
}: PageContainerProps) => {
  return (
    <div className="container py-6 space-y-6 animate-enter relative">
      {/* Decorative elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl"></div>

      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h1 className="text-3xl font-bold tracking-tight relative">
              {title}
              <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-full"></span>
              <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-full animate-pulse-ring opacity-50"></span>
            </h1>
          )}
          {description && <p className="text-muted-foreground">{description}</p>}
          {date && (
            <div className="text-sm text-muted-foreground">
              ข้อมูล ณ วันที่ 1 ตุลาคม 2568 {date}
            </div>
          )}
        </div>
      )}
      <div className="space-y-6">
        {Array.isArray(children)
          ? children.map((child, index) => (
            <div
              key={index}
              className="animate-slide-in-bottom"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {child}
            </div>
          ))
          : children
        }
      </div>
    </div>
  );
};

export default PageContainer;
