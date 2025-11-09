import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionWrapperProps {
  children: ReactNode;
  id?: string;
  className?: string;
  title?: string;
  subtitle?: string;
  headerAction?: ReactNode;
}

export default function SectionWrapper({
  children,
  id,
  className,
  title,
  subtitle,
  headerAction,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn('py-16 md:py-24 px-4', className)}
    >
      <div className="container mx-auto">
        {(title || subtitle || headerAction) && (
          <div className={cn('mb-12', headerAction ? 'flex flex-col md:flex-row items-center justify-between gap-4' : 'text-center')}>
            <div className={cn(headerAction ? 'flex-1 text-left' : 'text-center w-full')}>
              {title && (
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-gray-600 text-lg max-w-2xl">
                  {subtitle}
                </p>
              )}
            </div>
            {headerAction && (
              <div className="shrink-0">
                {headerAction}
              </div>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
