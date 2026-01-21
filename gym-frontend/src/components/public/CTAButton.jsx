/**
 * Call-to-action button component for public website.
 */
import { Link } from 'react-router-dom';

const CTAButton = ({
  children,
  to,
  onClick,
  variant = 'primary',
  size = 'lg',
  className = '',
  type = 'button',
  disabled = false,
}) => {
  const baseClasses = 'font-bold rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
    secondary: 'bg-white hover:bg-gray-100 text-gray-900 focus:ring-white',
    outline: 'border-2 border-primary-400 text-primary-400 hover:bg-primary-400 hover:text-white focus:ring-primary-500',
  };

  const sizeClasses = {
    sm: 'px-6 py-3 text-sm',
    md: 'px-8 py-4 text-base',
    lg: 'px-10 py-5 text-lg',
    xl: 'px-12 py-6 text-xl',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} disabled={disabled}>
      {children}
    </button>
  );
};

export default CTAButton;

