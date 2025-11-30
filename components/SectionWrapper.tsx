import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionWrapperProps {
  children: ReactNode;
  id?: string;
  className?: string;
  title?: string;
  subtitle?: string;
  headerAction?: ReactNode;
  variant?: 'white' | 'gray';
}

export default function SectionWrapper({
  children,
  id,
  className,
  title,
  subtitle,
  headerAction,
  variant = 'white',
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn(
        'py-10 md:py-12 px-4',
        className
      )}
    >
      <div className="container mx-auto">
        {(title || subtitle || headerAction) && (
          <div className={cn('mb-12', headerAction ? 'flex flex-col md:flex-row items-center justify-between gap-4' : '')}>
            <div className={cn(headerAction ? 'flex-1 text-left' : 'text-left w-full')}>
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
