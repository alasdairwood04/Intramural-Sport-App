import { ChevronDown } from 'lucide-react';

const Select = ({ 
  label, 
  name, 
  register, 
  errors, 
  children,
  placeholder = "Select an option...",
  description,
  required = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const hasError = errors && errors[name];
  
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label 
          htmlFor={name} 
          className="block text-sm font-medium text-neutral-700"
        >
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          id={name}
          name={name}
          disabled={disabled}
          {...(register ? register(name) : {})}
          {...props}
          className={`
            block w-full px-3 py-2 pr-10 text-sm
            bg-white border rounded-lg appearance-none
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:bg-neutral-50 disabled:text-neutral-500 disabled:cursor-not-allowed
            ${hasError 
              ? 'border-error-300 focus:border-error-500 focus:ring-error-100' 
              : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-100'
            }
          `}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {children}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDown className="h-4 w-4 text-neutral-400" />
        </div>
      </div>
      
      {description && !hasError && (
        <p className="text-xs text-neutral-500">{description}</p>
      )}
      
      {hasError && (
        <div className="flex items-center mt-1">
          <svg className="w-4 h-4 text-error-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-error-600">{hasError.message}</p>
        </div>
      )}
    </div>
  );
};


export default Select;