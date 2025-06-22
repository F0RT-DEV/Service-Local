import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  children: React.ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export function ActionButton({ 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon, 
  children, 
  disabled = false,
  type = 'button'
}: ActionButtonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-gray-600 hover:bg-gray-700 text-white';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 text-white';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1 text-sm';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${getVariantClasses()} 
        ${getSizeClasses()} 
        rounded-md font-medium transition-colors flex items-center
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      {Icon && <Icon className="h-4 w-4 mr-1" />}
      {children}
    </button>
  );
}