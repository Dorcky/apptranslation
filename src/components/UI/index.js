import React from 'react';

export const Card = ({ children, className }) => (
  <div className={`bg-white shadow-md rounded-lg ${className}`}>{children}</div>
);

export const CardHeader = ({ children, className }) => (
  <div className={`p-4 border-b ${className}`}>{children}</div>
);

export const CardTitle = ({ children }) => <h2 className="text-xl font-semibold">{children}</h2>;

export const CardContent = ({ children }) => <div className="p-4">{children}</div>;

export const Button = ({ children, onClick, disabled, className, variant }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-md ${
      variant === 'outline' ? 'border border-gray-300 bg-transparent' : 'bg-blue-500 text-white'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
  >
    {children}
  </button>
);

export const Select = ({ value, onValueChange, children, multiple }) => (
  <select
    value={value}
    onChange={(e) => onValueChange(multiple ? Array.from(e.target.selectedOptions, (option) => option.value) : e.target.value)}
    className="w-32 p-2 border rounded-md"
    multiple={multiple}
  >
    {children}
  </select>
);