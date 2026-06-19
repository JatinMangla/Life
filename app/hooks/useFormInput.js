import { useCallback, useState } from 'react';

export function useFormInput(initialValue = '') {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState();
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = useCallback(
    event => {
      setValue(event.target.value);
      setIsDirty(true);

      // Resolve errors as soon as input becomes valid
      if (error && event.target.checkValidity()) {
        setError(null);
      }
    },
    [error]
  );

  const handleInvalid = useCallback(event => {
    // Prevent native errors appearing
    event.preventDefault();
    setError(event.target.validationMessage);
  }, []);

  const handleBlur = useCallback(
    event => {
      // Only validate when the user has made a change
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
