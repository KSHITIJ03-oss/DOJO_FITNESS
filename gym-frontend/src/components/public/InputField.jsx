/*
 * Input field component for public forms.
 * use of this file is to render input and textarea elements with labels and error messages.
 */
const InputField = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = '',
  rows,
}) => {
  const baseInputClasses = `
    w-full px-4 py-3 bg-gray-800 border rounded-lg
    text-gray-100 placeholder-gray-500
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-all duration-200
    ${error ? 'border-red-500' : 'border-gray-700'}
    ${className}
  `;

  return (
    <div className="mb-6">
      {label && (
        <label htmlFor={name} className="block text-sm font-semibold text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows || 4}
          className={baseInputClasses}
        />
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={baseInputClasses}
        />
      )}
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};

export default InputField;

