import React from 'react';

/**
 * Loading spinner component with customizable size and message
 * 
 * @param {Object} props
 * @param {string} [props.size='medium'] - Size of the spinner (small, medium, large)
 * @param {string} [props.message='Loading...'] - Message to display while loading
 * @param {boolean} [props.fullScreen=false] - Whether to center in the full screen
 * @param {string} [props.className=''] - Additional classes
 */
export function Loading({ 
  size = 'medium', 
  message = 'Loading...', 
  fullScreen = false,
  className = ''
}) {
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-50' 
    : 'flex flex-col items-center justify-center py-6';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="flex flex-col items-center gap-3">
        <div 
          className={`${sizeClasses[size]} border-t-primary rounded-full animate-spin`} 
          role="status" 
          aria-label="loading"
        />
        {message && (
          <p className="text-sm text-slate-600 dark:text-slate-400">{message}</p>
        )}
      </div>
    </div>
  );
}

/**
 * Loading skeleton for content that is still loading
 * 
 * @param {Object} props
 * @param {string} [props.height='h-4'] - Height of the skeleton
 * @param {string} [props.width='w-full'] - Width of the skeleton
 * @param {string} [props.className=''] - Additional classes
 * @param {boolean} [props.rounded=true] - Whether to use rounded corners
 */
export function Skeleton({
  height = 'h-4',
  width = 'w-full',
  className = '',
  rounded = true,
}) {
  return (
    <div 
      className={`
        animate-pulse bg-slate-200 dark:bg-slate-700
        ${height} ${width} ${rounded ? 'rounded-md' : ''} ${className}
      `}
    />
  );
} 