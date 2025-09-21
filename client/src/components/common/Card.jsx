const Card = ({ 
  children, 
  className = '', 
  padding = 'default',
  hover = false,
  interactive = false
}) => {
  const baseClasses = 'bg-white border border-neutral-200 rounded-lg shadow-sm';
  
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8'
  };
  
  const interactiveClasses = interactive || hover ? 
    'transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer' : '';
  
  return (
    <div 
      className={`
        ${baseClasses}
        ${paddingClasses[padding]}
        ${interactiveClasses}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// Specialized card variants
export const StatsCard = ({ title, value, change, trend, icon: Icon }) => (
  <Card className="relative overflow-hidden">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-neutral-500 mb-1">{title}</p>
        <p className="text-2xl font-semibold text-neutral-900">{value}</p>
        {change && (
          <div className={`flex items-center mt-2 text-sm ${
            trend === 'up' ? 'text-success-600' : 
            trend === 'down' ? 'text-error-600' : 'text-neutral-500'
          }`}>
            {trend === 'up' && (
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            )}
            {trend === 'down' && (
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
            {change}
          </div>
        )}
      </div>
      {Icon && (
        <div className="p-3 bg-primary-50 rounded-lg">
          <Icon className="w-6 h-6 text-primary-600" />
        </div>
      )}
    </div>
  </Card>
);

export const EmptyState = ({ title, description, action, icon: Icon }) => (
  <Card className="text-center py-12">
    {Icon && (
      <div className="mx-auto w-12 h-12 mb-4 text-neutral-400">
        <Icon className="w-full h-full" />
      </div>
    )}
    <h3 className="text-lg font-medium text-neutral-900 mb-2">{title}</h3>
    {description && (
      <p className="text-neutral-500 mb-6 max-w-sm mx-auto">{description}</p>
    )}
    {action}
  </Card>
);

export default Card;