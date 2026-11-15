import React, { useId } from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Standardized form control on cream paper background with error and helper text.
 */
export default function Field({
  as = 'input',
  label,
  helper,
  error,
  id,
  className = '',
  controlClassName = '',
  children,
  ...props
}) {
  const generatedId = useId();
  const fieldId = id || generatedId;
  const helperId = helper ? `${fieldId}-helper` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

  if (as === 'checkbox' || props.type === 'checkbox') {
    const { type: _omit, ...checkProps } = props;
    return (
      <div className={['field', error ? 'field--error' : '', className].filter(Boolean).join(' ')}>
        <label htmlFor={fieldId} className="field-check">
          <input
            id={fieldId}
            type="checkbox"
            className={['field-check__input', controlClassName].filter(Boolean).join(' ')}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={describedBy}
            {...checkProps}
          />
          {label ? <span className="field__label">{label}</span> : null}
        </label>
        {helper ? (
          <span id={helperId} className="field__helper">
            {helper}
          </span>
        ) : null}
        {error ? (
          <span id={errorId} className="field__error" role="alert">
            <AlertCircle size={15} strokeWidth={2} aria-hidden="true" />
            {error}
          </span>
        ) : null}
      </div>
    );
  }

  const Control = as === 'textarea' ? 'textarea' : as === 'select' ? 'select' : 'input';

  return (
    <div className={['field', error ? 'field--error' : '', className].filter(Boolean).join(' ')}>
      {label ? (
        <label htmlFor={fieldId} className="field__label">
          {label}
        </label>
      ) : null}

      <Control
        id={fieldId}
        className={['field__control', controlClassName].filter(Boolean).join(' ')}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        {...props}
      >
        {as === 'select' ? children : undefined}
      </Control>

      {helper ? (
        <span id={helperId} className="field__helper">
          {helper}
        </span>
      ) : null}

      {error ? (
        <span id={errorId} className="field__error" role="alert">
          <AlertCircle size={15} strokeWidth={2} aria-hidden="true" />
          {error}
        </span>
      ) : null}
    </div>
  );
}
