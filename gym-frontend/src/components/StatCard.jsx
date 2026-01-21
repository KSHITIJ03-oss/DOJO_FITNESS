/**
 * StatCard component for displaying dashboard statistics.
 * Displays a metric with an optional icon and trend indicator.
 */
const StatCard = ({ title, value, icon: Icon, trend, subtitle, className = '' }) => {
  return (
    <div
      className={`
        bg-gray-800 rounded-xl p-6 border border-gray-700
        hover:border-primary-500 transition-all duration-200
        ${className}
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
          {title}
        </h3>
        {Icon && (
          <div className="p-2 bg-primary-500/10 rounded-lg">
            <Icon className="h-5 w-5 text-primary-400" />
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-white">{value}</p>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-400">{subtitle}</p>
        )}
        {trend && (
          <div className={`mt-2 flex items-center text-sm ${trend.positive ? 'text-green-400' : 'text-red-400'}`}>
            <span>{trend.positive ? '↑' : '↓'}</span>
            <span className="ml-1">{trend.value}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;

