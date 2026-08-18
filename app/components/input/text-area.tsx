import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, TextareaHTMLAttributes } from 'react';
import { classes, cssProps } from '~/utils/style';
import styles from './text-area.module.css';

interface TextareaDimensions {
  lineHeight: number;
  paddingHeight: number;
}

export interface TextAreaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'rows'> {
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
  minRows?: number;
  maxRows?: number;
}

/** A textarea that grows with its content, up to `maxRows`. */
export const TextArea = ({
  className,
  resize = 'none',
  value,
  onChange,
  minRows = 1,
  maxRows,
  ...rest
}: TextAreaProps) => {
  const [rows, setRows] = useState(minRows);
  const [dimensions, setDimensions] = useState<TextareaDimensions>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!textareaRef.current) return;

    const style = getComputedStyle(textareaRef.current);

    setDimensions({
      lineHeight: parseInt(style.lineHeight, 10),
      paddingHeight: parseInt(style.paddingTop, 10) + parseInt(style.paddingBottom, 10),
    });
  }, []);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(event);

    // Dimensions are measured on mount; bail out if that hasn't happened yet
    // rather than dividing by NaN.
    if (!dimensions) return;

    const { lineHeight, paddingHeight } = dimensions;
    const target = event.target;
    const previousRows = target.rows;

    target.rows = minRows;

    const currentRows = Math.floor((target.scrollHeight - paddingHeight) / lineHeight);

    if (currentRows === previousRows) {
      target.rows = currentRows;
    }

    if (maxRows && currentRows >= maxRows) {
      target.rows = maxRows;
      target.scrollTop = target.scrollHeight;
    }

    setRows(maxRows && currentRows > maxRows ? maxRows : currentRows);
  };

  return (
    <textarea
      className={classes(styles.textarea, className)}
      ref={textareaRef}
      onChange={handleChange}
      style={cssProps({ resize })}
      rows={rows}
      value={value}
      {...rest}
    />
  );
};
