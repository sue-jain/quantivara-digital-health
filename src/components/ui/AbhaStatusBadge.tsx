import React from 'react';
import { CheckCircle, Clock, Building2 } from 'lucide-react';

interface AbhaStatusBadgeProps {
  hasAbhaLinked: boolean;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const AbhaStatusBadge: React.FC<AbhaStatusBadgeProps> = ({ 
  hasAbhaLinked, 
  size = 'sm', 
  showText = false 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5', 
    lg: 'w-6 h-6'
  };

  const badgeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  if (hasAbhaLinked) {
    return (
      <div className="flex items-center gap-1">
        <div className="relative">
          <Building2 className={`${sizeClasses[size]} text-gray-600`} />
          <div className="absolute -top-1 -right-1">
            <CheckCircle className={`${badgeClasses[size]} text-green-500 bg-white rounded-full`} />
          </div>
        </div>
        {showText && (
          <span className="text-xs text-green-600 font-medium">ABHA Linked</span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <div className="relative">
        <Building2 className={`${sizeClasses[size]} text-gray-400`} />
        <div className="absolute -top-1 -right-1">
          <Clock className={`${badgeClasses[size]} text-orange-500 bg-white rounded-full`} />
        </div>
      </div>
      {showText && (
        <span className="text-xs text-orange-600 font-medium">ABHA Pending</span>
      )}
    </div>
  );
};

export default AbhaStatusBadge;

