import { TextAreaProps } from '@/types';

export default function TextArea({
  id,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  disabled = false,
  rows = 4,
  className = '',
}: TextAreaProps) {
  const baseClasses =
    'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical';

  const errorClasses = error
    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
    : 'border-gray-300';

  const disabledClasses = disabled
    ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
    : 'bg-white';

  return (
    <div className="w-full">
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        className={`${baseClasses} ${errorClasses} ${disabledClasses} ${className}`}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={!!error}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}