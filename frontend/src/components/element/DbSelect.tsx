import { toEnvLabel } from '../../utilities/EnvMap';

type DbSelectProps = {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;

  databases: string[];

  required?: boolean;
  className?: string;
  disabled?: boolean;

  placeholderLabel?: string;
  showSelectAll?: boolean;
  selectAllValue?: string;
  selectAllLabel?: string;
  'aria-describedby'?: string;
};

export function DbSelect({
  id = 'db-select',
  name = 'database',
  value,
  onChange,
  databases,
  required = false,
  className = 'form-select w-full appearance-none rounded border border-gray-300 bg-white px-3 py-2 pr-10',
  disabled = false,
  placeholderLabel = '-- Select --',
  showSelectAll = false,
  selectAllValue = '__ALL__',
  selectAllLabel = 'All',
  'aria-describedby': ariaDescribedBy,
}: DbSelectProps) {
  const shouldShowAllOption = showSelectAll && databases.length > 1;
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
      required={required}
      disabled={disabled}
      aria-describedby={ariaDescribedBy}
    >
      <option value="" disabled>
        {placeholderLabel}
      </option>

      {shouldShowAllOption && (
        <option value={selectAllValue}>{selectAllLabel}</option>
      )}

      {databases.map((code) => (
        <option key={code} value={code}>
          {toEnvLabel(code)}
        </option>
      ))}
    </select>
  );
}
