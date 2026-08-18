import { useCallback, useState } from 'react';
import type { ChangeEvent, FocusEvent, FormEvent } from 'react';

type InputElement = HTMLInputElement | HTMLTextAreaElement;

export interface FormInput<T extends InputElement = InputElement> {
  value: string;
  error?: string;
  onChange: (event: ChangeEvent<T>) => void;
  onBlur: (event: FocusEvent<T>) => void;
  onInvalid: (event: FormEvent<T>) => void;
}

/**
 * Controlled input state backed by the browser's own constraint validation, so
 * the messages match what the platform would have shown natively.
 */
export function useFormInput<T extends InputElement = InputElement>(
  initialValue = ''
): FormInput<T> {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | undefined>();
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = useCallback(
    (event: ChangeEvent<T>) => {
      setValue(event.target.value);
      setIsDirty(true);

      // Clear the error as soon as the input becomes valid again.
      if (error && event.target.checkValidity()) {
        setError(undefined);
      }
    },
    [error]
  );

  const handleInvalid = useCallback((event: FormEvent<T>) => {
    // Suppress the native bubble; we render the message ourselves.
    event.preventDefault();
    setError((event.target as T).validationMessage);
  }, []);

  const handleBlur = useCallback(
    (event: FocusEvent<T>) => {
      // Only validate once the user has actually typed something.
      if (isDirty) {
        event.target.checkValidity();
      }
    },
    [isDirty]
  );

  return {
    value,
    error,
    onChange: handleChange,
    onBlur: handleBlur,
    onInvalid: handleInvalid,
  };
}
