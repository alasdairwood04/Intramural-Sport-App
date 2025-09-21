import { MoreHorizontal, ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const Table = ({ 
  columns = [], 
  data = [], 
  loading = false,
  emptyMessage = "No data available",
  className = "",
  sortable = false,
  onSort,
  sortConfig = { key: null, direction: 'asc' }
}) => {
  const [HoveredRow, setHoveredRow] = useState(null);

  if (loading) {
    return <TableSkeleton />;
  }

  const handleSort = (key) => {
    if (!sortable || !onSort) return;
    
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    onSort({ key, direction });
  };

  return (
    <div className={`bg-white rounded-lg border border-neutral-200 overflow-hidden ${className}`}>
      {data.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-neutral-400 mb-2">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2" />
            </svg>
          </div>
          <p className="text-neutral-500 font-medium">{emptyMessage}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`
                      px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider
                      ${sortable && column.sortable ? 'cursor-pointer hover:text-neutral-700 select-none' : ''}
                    `}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.title}</span>
                      {sortable && column.sortable && (
                        <div className="flex flex-col">
                          <ChevronUp 
                            className={`h-3 w-3 ${
                              sortConfig.key === column.key && sortConfig.direction === 'asc'
                                ? 'text-primary-500' : 'text-neutral-400'
                            }`}
                          />
                          <ChevronDown 
                            className={`h-3 w-3 -mt-1 ${
                              sortConfig.key === column.key && sortConfig.direction === 'desc'
                                ? 'text-primary-500' : 'text-neutral-400'
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {data.map((row, index) => (
                <tr
                  key={row.id || index}
                  className="hover:bg-neutral-50 transition-colors duration-150"
                  onMouseEnter={() => setHoveredRow(index)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm relative">
                      {column.render ? column.render(row, index) : (
                        <span className="text-neutral-900">
                          {row[column.key]}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Action Column Component for common table actions
export const ActionColumn = ({ actions = [], row, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-lg hover:bg-neutral-100 transition-colors duration-150"
      >
        <MoreHorizontal className="h-4 w-4 text-neutral-500" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-20">
            {actions.map((action, actionIndex) => (
              <button
                key={actionIndex}
                onClick={() => {
                  action.onClick(row, index);
                  setIsOpen(false);
                }}
                className={`
                  w-full px-4 py-2 text-left text-sm transition-colors duration-150
                  ${action.variant === 'danger' 
                    ? 'text-error-600 hover:bg-error-50' 
                    : 'text-neutral-700 hover:bg-neutral-50'
                  }
                `}
              >
                <div className="flex items-center">
                  {action.icon && <action.icon className="h-4 w-4 mr-2" />}
                  {action.label}
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Status Badge Component for table cells
export const StatusBadge = ({ status, variant }) => {
  const variants = {
    success: 'bg-success-100 text-success-800',
    warning: 'bg-warning-100 text-warning-800',
    error: 'bg-error-100 text-error-800',
    info: 'bg-primary-100 text-primary-800',
    neutral: 'bg-neutral-100 text-neutral-800'
  };

  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
      ${variants[variant] || variants.neutral}
    `}>
      {status}
    </span>
  );
};

// Avatar Component for table cells
export const TableAvatar = ({ name, src, size = 'sm' }) => {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base'
  };

  const initials = name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  return (
    <div className={`
      ${sizes[size]} rounded-full flex items-center justify-center font-medium
      ${src ? '' : 'bg-primary-100 text-primary-700'}
    `}>
      {src ? (
        <img src={src} alt={name} className="rounded-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
};

// Loading Skeleton for Table
const TableSkeleton = () => (
  <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
    {/* Header skeleton */}
    <div className="bg-neutral-50 border-b border-neutral-200 px-6 py-3">
      <div className="flex space-x-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-4 bg-neutral-200 rounded animate-pulse flex-1" />
        ))}
      </div>
    </div>
    
    {/* Rows skeleton */}
    <div className="divide-y divide-neutral-200">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="px-6 py-4 flex space-x-8">
          {[1, 2, 3, 4].map(j => (
            <div key={j} className="h-4 bg-neutral-200 rounded animate-pulse flex-1" />
          ))}
        </div>
      ))}
    </div>
  </div>
);

// Pagination Component
export const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  showInfo = true 
}) => {
  const pages = [];
  const maxVisible = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);
  
  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-neutral-200">
      {showInfo && (
        <div className="text-sm text-neutral-500">
          Page {currentPage} of {totalPages}
        </div>
      )}
      
      <div className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm font-medium text-neutral-500 hover:text-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        {pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              px-3 py-1 text-sm font-medium rounded transition-colors duration-150
              ${page === currentPage
                ? 'bg-primary-500 text-white'
                : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100'
              }
            `}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm font-medium text-neutral-500 hover:text-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Table;