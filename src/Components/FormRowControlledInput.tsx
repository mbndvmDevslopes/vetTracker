import { ChangeEvent } from 'react';

type FormRowControlledInputProps = {
  type: string;
  name: string;
  labelText: string;
  max?: string | undefined;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  value: string;
};

export const FormRowControlledInput: React.FC<FormRowControlledInputProps> = ({
  type,
  name,
  labelText,
  onChange,
  value,
  max,
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
        required
        onChange={onChange}
        value={value}
        max={max}
      />
    </div>
  );
};
