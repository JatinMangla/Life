import { Button } from '~/components/button';
import { Icon } from '~/components/icon';
import { useTheme } from '~/components/theme-provider';
import { useReducedMotion } from 'framer-motion';
import { useHasMounted, useInViewport } from '~/hooks';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, MouseEvent, ReactNode } from 'react';
import { resolveSrcFromSrcSet } from '~/utils/image';
import { classes, cssProps, numToMs } from '~/utils/style';
import styles from './image.module.css';

function getIsVideo(src?: string): boolean {
  return typeof src === 'string' && src.includes('.mp4');
}

export interface ImageProps {
  className?: string;
  style?: CSSProperties;
  /** Animate in when the image scrolls into view. */
  reveal?: boolean;
  /** Reveal delay in ms. */
  delay?: number;
  raised?: boolean;
  src?: string;
  srcSet?: string;
  /** Low-resolution stand-in cross-faded out once the real image loads. */
  placeholder?: string;
  alt?: string;
  sizes?: string;
  width?: number;
  height?: number;
  cover?: boolean;
  /** Video only: whether the clip should be playing. */
  play?: boolean;
  restartOnPause?: boolean;
  noPauseButton?: boolean;
  children?: ReactNode;
  [key: string]: unknown;
}

export const Image = ({
  className,
  style,
  reveal,
  delay = 0,
  raised,
  src: baseSrc,
  srcSet,
  placeholder,
  ...rest
}: ImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const src = baseSrc ?? srcSet?.split(' ')[0];
  // Videos keep observing so they can pause when scrolled out of view;
  // images stop once they've been seen.
  const inViewport = useInViewport(containerRef, !getIsVideo(src));

  const onLoad = useCallback(() => setLoaded(true), []);

  return (
    <div
      className={classes(styles.image, className)}
      data-visible={inViewport || loaded}
      data-reveal={reveal}
      data-raised={raised}
      data-theme={theme}
      style={cssProps({ delay: numToMs(delay) }, style)}
      ref={containerRef}
    >
      <ImageElements
        delay={delay}
        onLoad={onLoad}
        loaded={loaded}
        inViewport={inViewport}
        reveal={reveal}
        src={src}
        srcSet={srcSet}
        placeholder={placeholder}
        {...rest}
      />
    </div>
  );
};

interface ImageElementsProps extends ImageProps {
  onLoad: () => void;
  loaded: boolean;
  inViewport: boolean;
}

const ImageElements = ({
  onLoad,
  loaded,
  inViewport,
  srcSet,
  placeholder,
  delay = 0,
  src,
  alt,
  play = true,
  restartOnPause,
  reveal,
  sizes,
  width,
  height,
  noPauseButton,
  cover,
  ...rest
}: ImageElementsProps) => {
  const reduceMotion = useReducedMotion();
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [playing, setPlaying] = useState(!reduceMotion);
  const [videoSrc, setVideoSrc] = useState<string>();
  const [videoInteracted, setVideoInteracted] = useState(false);
  const placeholderRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVideo = getIsVideo(src);
  const showFullRes = inViewport;
  const hasMounted = useHasMounted();

  useEffect(() => {
    if (!isVideo) return;

    if (srcSet) {
      resolveSrcFromSrcSet({ srcSet, sizes }).then(setVideoSrc).catch(() => {});
    } else {
      setVideoSrc(src);
    }
  }, [isVideo, sizes, src, srcSet]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !videoSrc) return;

    const playVideo = () => {
      setPlaying(true);
      void video.play().catch(() => {});
    };

    const pauseVideo = () => {
      setPlaying(false);
      video.pause();
    };

    if (!play) {
      pauseVideo();

      if (restartOnPause) {
        video.currentTime = 0;
      }
    }

    // Once someone has hit the pause button, stop overriding their choice.
    if (videoInteracted) return;

    if (!inViewport) {
      pauseVideo();
    } else if (!reduceMotion && play) {
      playVideo();
    }
  }, [inViewport, play, reduceMotion, restartOnPause, videoInteracted, videoSrc]);

  const togglePlaying = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();

    const video = videoRef.current;

    if (!video) return;

    setVideoInteracted(true);

    if (video.paused) {
      setPlaying(true);
      void video.play().catch(() => {});
    } else {
      setPlaying(false);
      video.pause();
    }
  };

  return (
    <div
      className={styles.elementWrapper}
      data-reveal={reveal}
      data-visible={inViewport || loaded}
      style={cssProps({ delay: numToMs(delay + 1000) })}
    >
      {isVideo && hasMounted && (
        <Fragment>
          <video
            muted
            loop
            playsInline
            className={styles.element}
            data-loaded={loaded}
            data-cover={cover}
            autoPlay={!reduceMotion}
            onLoadStart={onLoad}
            src={videoSrc}
            aria-label={alt}
            ref={videoRef}
            {...rest}
          />
          {!noPauseButton && (
            <Button
              className={styles.button}
              onClick={togglePlaying}
              aria-pressed={playing}
            >
              <Icon icon={playing ? 'pause' : 'play'} />
              {playing ? 'Pause' : 'Play'}
            </Button>
          )}
        </Fragment>
      )}
      {!isVideo && (
        <img
          className={styles.element}
          data-loaded={loaded}
          data-cover={cover}
          onLoad={onLoad}
          decoding="async"
          loading="lazy"
          src={showFullRes ? src : undefined}
          srcSet={showFullRes ? srcSet : undefined}
          width={width}
          height={height}
          alt={alt}
          sizes={sizes}
          {...rest}
        />
      )}
      {showPlaceholder && (
        <img
          aria-hidden
          className={styles.placeholder}
          data-loaded={loaded}
          data-cover={cover}
          style={cssProps({ delay: numToMs(delay) })}
          ref={placeholderRef}
          src={placeholder}
          width={width}
          height={height}
          onTransitionEnd={() => setShowPlaceholder(false)}
          decoding="async"
          alt=""
          role="presentation"
        />
      )}
    </div>
  );
};
