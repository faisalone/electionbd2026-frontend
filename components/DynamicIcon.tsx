import * as LucideIcons from 'lucide-react';
import { Tag } from 'lucide-react';

interface DynamicIconProps {
  name?: string | null;
  className?: string;
  fallback?: keyof typeof LucideIcons;
}

/**
 * Dynamic icon renderer for Lucide icons
 * Converts icon names from database (e.g., "flag", "layout-grid") to proper React components
 * Falls back to Tag icon if icon name is not found
 */
export default function DynamicIcon({ 
  name, 
  className = "w-6 h-6",
  fallback = 'Tag'
}: DynamicIconProps) {
  if (!name) {
    const FallbackIcon = (LucideIcons as any)[fallback] || Tag;
    return <FallbackIcon className={className} />;
  }
  
  // Convert icon name to PascalCase
  // Examples: "flag" -> "Flag", "layout-grid" -> "LayoutGrid"
  const iconName = name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  
  const IconComponent = (LucideIcons as any)[iconName];
  
  if (!IconComponent) {
    const FallbackIcon = (LucideIcons as any)[fallback] || Tag;
    return <FallbackIcon className={className} />;
  }
  
  return <IconComponent className={className} />;
}
