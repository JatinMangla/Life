import { AnimatePresence, usePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { MutableRefObject, ReactNode, RefObject } from 'react';

export type TransitionStatus = 'entering' | 'entered' | 'exiting' | 'exited';

export interface TransitionState {
  /** True while the element should be in its visible state. */
  visible: boolean;
  status: TransitionStatus;
  /** Attach to the animating element so reflows can be forced on it. */
  nodeRef: RefObject<HTMLElement>;
}

export type TransitionTimeout = number | { enter: number; exit: number };

interface TransitionOwnProps {
  children: (state: TransitionState) => ReactNode;
  /** Whether the content should be shown. */
  in?: boolean;
  /** Remove the content from the DOM once it has exited. */
  unmount?: boolean;
  /** Start from the exited state on first mount. */
  initial?: boolean;
  timeout?: TransitionTimeout;
  nodeRef?: RefObject<HTMLElement>;
  onEnter?: () => void;
  onEntered?: () => void;
  onExit?: () => void;
  onExited?: () => void;
}

type Timer = ReturnType<typeof setTimeout> | undefined;

/**
 * A lightweight Framer Motion `AnimatePresence` implementation of
 * `react-transition-group`, for driving plain CSS transitions.
 */
export const Transition = ({
  children,
  in: show,
  unmount,
  initial = true,
  ...props
}: TransitionOwnProps) => {
  const enterTimeout = useRef<Timer>(undefined);
  const exitTimeout = useRef<Timer>(undefined);

  useEffect(() => {
    if (show) {
      clearTimeout(exitTimeout.current);
    } else {
      clearTimeout(enterTimeout.current);
    }
  }, [show]);

  return (
    <AnimatePresence>
      {(show || !unmount) && (
        <TransitionContent
          enterTimeout={enterTimeout}
          exitTimeout={exitTimeout}
          in={show}
          initial={initial}
          {...props}
        >
          {children}
        </TransitionContent>
      )}
    </AnimatePresence>
  );
};

interface TransitionContentProps extends Omit<TransitionOwnProps, 'unmount'> {
  enterTimeout: MutableRefObject<Timer>;
  exitTimeout: MutableRefObject<Timer>;
}

const TransitionContent = ({
  children,
  timeout = 0,
  enterTimeout,
  exitTimeout,
  onEnter,
  onEntered,
  onExit,
  onExited,
  initial,
  nodeRef: defaultNodeRef,
  in: show,
}: TransitionContentProps) => {
  const [status, setStatus] = useState<TransitionStatus>(initial ? 'exited' : 'entered');
  const [isPresent, safeToRemove] = usePresence();
  const [hasEntered, setHasEntered] = useState(!initial);
  const internalNodeRef = useRef<HTMLElement>(null);
  const nodeRef = defaultNodeRef ?? internalNodeRef;
  const visible = hasEntered && show ? isPresent : false;

  useEffect(() => {
    if (hasEntered || !show) return;

    const actualTimeout = typeof timeout === 'object' ? timeout.enter : timeout;

    clearTimeout(enterTimeout.current);
    clearTimeout(exitTimeout.current);

    setHasEntered(true);
    setStatus('entering');
    onEnter?.();

    // Force a reflow so the browser doesn't batch the class change with the
    // initial paint and skip the transition entirely.
    void nodeRef.current?.offsetHeight;

    enterTimeout.current = setTimeout(() => {
      setStatus('entered');
      onEntered?.();
    }, actualTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onEnter, onEntered, timeout, status, show]);

  useEffect(() => {
    if (isPresent && show) return;

    const actualTimeout = typeof timeout === 'object' ? timeout.exit : timeout;

    clearTimeout(enterTimeout.current);
    clearTimeout(exitTimeout.current);

    setStatus('exiting');
    onExit?.();

    void nodeRef.current?.offsetHeight;

    exitTimeout.current = setTimeout(() => {
      setStatus('exited');
      safeToRemove?.();
      onExited?.();
    }, actualTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPresent, onExit, safeToRemove, timeout, onExited, show]);

  return <>{children({ visible: visible ?? false, status, nodeRef })}</>;
};
