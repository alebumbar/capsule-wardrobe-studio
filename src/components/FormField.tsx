import type { ReactNode } from "react";

type FormFieldProps = {
    id: string;
    label: string;
    hint?: string;
    children: ReactNode
};

export function FormField({
    id,
    label,
    hint,
    children,
}: FormFieldProps) {
    const hintId = `${id}-hint`;

    return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      {children}

      {hint && (
        <p id={hintId} className="form-field__hint">
          {hint}
        </p>
      )}
    </div>
  );
}
