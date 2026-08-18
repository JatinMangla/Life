import { useId, useRef, useState } from 'react';
import type { ChangeEvent, CSSProperties, FocusEvent, FormEvent, Ref } from 'react';
import { Icon } from '~/components/icon';
import { tokens } from '~/components/theme-provider/theme';
import { Transition } from '~/components/transition';
import { classes, cssProps, msToNum } from '~/utils/style';
import { TextArea } from './text-area';
import styles from './input.module.css';

type InputElement = HTMLInputElement | HTMLTextAreaElement;

export interface InputProps {
  id?: string;
  label: string;
  value?: string;
  /** Render a growing textarea instead of a single-line input. */
  multiline?: boolean;
  className?: string;
  style?: CSSProperties;
  /** Validation message; shown in an alert region below the field. */
  error?: string;
  onBlur?: (event: FocusEvent<InputElement>) => void;
  onChange?: (event: ChangeEvent<InputElement>) => void;
  onInvalid?: (event: FormEvent<InputElement>) => void;
  autoComplete?: string;
  required?: boolean;
  maxLength?: number;
  type?: string;
  name?: string;
}

export const Input = ({
  id,
  label,
  value,
  multiline,
  className,
  style,
  error,
  onBlur,
  autoComplete,
  required,
  maxLength,
  type,
  onChange,
  onInvalid,
  name,
  ...rest
}: InputProps) => {
  const [focused, setFocused] = useState(false);
  const generatedId = useId();
  const errorRef = useRef<HTMLDivElement>(null);
  const inputId = id ?? `${generatedId}input`;
  const errorId = `${inputId}-error`;
  const InputElement = multiline ? TextArea : 'input';

  const handleBlur = (event: FocusEvent<InputElement>) => {
    setFocused(false);
    onBlur?.(event);
  };

  return (
    <div
      className={classes(styles.container, className)}
      data-error={!!error}
      style={style}
      {...rest}
    >
      <div className={styles.content}>
        {/* htmlFor/id is the whole association; an aria-labelledby pointing at
            the same label would just restate it. */}
        <label
          className={styles.label}
          data-focused={focused}
          data-filled={!!value}
          htmlFor={inputId}
        >
          {label}
        </label>
        <InputElement
          className={styles.input}
          id={inputId}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={error ? true : undefined}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur as never}
          value={value}
          onChange={onChange as never}
          // Must sit on the field itself: `invalid` does not bubble, so when
          // this landed on the wrapper div via ...rest it never fired, and
          // the custom error message never appeared.
          onInvalid={onInvalid as never}
          autoComplete={autoComplete}
          required={required}
          maxLength={maxLength}
          type={type}
          name={name}
        />
        <div className={styles.underline} data-focused={focused} />
      </div>
      <Transition unmount in={!!error} timeout={msToNum(tokens.base.durationM)}>
        {({ visible, nodeRef }) => (
          <div
            ref={nodeRef as Ref<HTMLDivElement>}
            className={styles.error}
            data-visible={visible}
            id={errorId}
            role="alert"
            style={cssProps({
              height: visible ? errorRef.current?.getBoundingClientRect().height : 0,
            })}
          >
            <div className={styles.errorMessage} ref={errorRef}>
              <Icon icon="error" />
              {error}
            </div>
          </div>
        )}
      </Transition>
    </div>
  );
};
