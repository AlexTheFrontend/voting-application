import Label from '@/components/atoms/Label';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import TextArea from '@/components/atoms/TextArea';

interface FormFieldProps {
  id: string;
  name: string;
  label: string;
  type?: 'input' | 'select' | 'textarea';
  inputType?: string;
  value: string;
  onChange: (value: string) => void;
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  rows?: number;
  className?: string;
}

export default function FormField({
  id,
  name,
  label,
  type = 'input',
  inputType = 'text',
  value,
  onChange,
  options = [],
  placeholder,
  required = false,
  error,
  disabled = false,
  rows,
  className = '',
}: FormFieldProps) {
  const renderField = () => {
    switch (type) {
      case 'select':
        return (
          <Select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            options={options}
            placeholder={placeholder}
            required={required}
            error={error}
            disabled={disabled}
          />
        );
      case 'textarea':
        return (
          <TextArea
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            error={error}
            disabled={disabled}
            rows={rows}
          />
        );
      default:
        return (
          <Input
            id={id}
            name={name}
            type={inputType}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            error={error}
            disabled={disabled}
          />
        );
    }
  };

  return (
    <div className={`space-y-1 ${className}`}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      {renderField()}
    </div>
  );
}