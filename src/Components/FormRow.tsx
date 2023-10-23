type FormRowProps = {
  type: string;
  name: string;
  labelText: string;
  defaultValue?: string | number | string[] | readonly string[];
  max?: string | undefined;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  value?: string | number | string[] | undefined;
};

export const FormRow: React.FC<FormRowProps> = ({
  type,
  name,
  labelText,
  defaultValue,
  max,
  onChange,
  value,
}) => {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        className="form-input"
        defaultValue={defaultValue === null ? '' : defaultValue}
        required
        max={max}
        onChange={onChange}
        value={value}
      />
    </div>
  );
};
