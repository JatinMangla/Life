import profileImgLarge from '~/assets/profileFull.jpeg';
import profileImgPlaceholder from '~/assets/profile-placeholder.jpg';
import profileImg from '~/assets/profile.jpeg';
import { Button } from '~/components/button';
import { DecoderText } from '~/components/decoder-text';
import { Divider } from '~/components/divider';
import { Heading } from '~/components/heading';
import { Image } from '~/components/image';
import { Section } from '~/components/section';
import { Text } from '~/components/text';
import { Transition } from '~/components/transition';
import { Fragment, useState } from 'react';
import type { Ref } from 'react';
import { media } from '~/utils/style';
import jatin from './jatin.svg';
import { bio } from '~/data/bio';
import styles from './profile.module.css';

interface ProfileTextProps {
  visible: boolean;
  titleId: string;
}

const ProfileText = ({ visible, titleId }: ProfileTextProps) => (
  <Fragment>
    <Heading className={styles.title} data-visible={visible} level={3} id={titleId}>
      <DecoderText text="Hi there" start={visible} delay={500} />
    </Heading>
    {bio.map(paragraph => (
      <Text
        key={paragraph.slice(0, 32)}
        className={styles.description}
        data-visible={visible}
        size="s"
        as="p"
      >
        {paragraph}
      </Text>
    ))}
  </Fragment>
);

export interface ProfileProps {
  id: string;
  visible: boolean;
  sectionRef: Ref<HTMLElement>;
}

export const Profile = ({ id, visible, sectionRef }: ProfileProps) => {
  const [focused, setFocused] = useState(false);
  const titleId = `${id}-title`;

  return (
    <Section
      className={styles.profile}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      as="section"
      id={id}
      ref={sectionRef}
      aria-labelledby={titleId}
      tabIndex={-1}
    >
      <Transition<HTMLDivElement> in={visible || focused} timeout={0}>
        {({ visible, nodeRef }) => (
          <div className={styles.content} ref={nodeRef}>
            <div className={styles.column}>
              <ProfileText visible={visible} titleId={titleId} />
              <Button
                secondary
                className={styles.button}
                data-visible={visible}
                href="/contact"
                icon="send"
              >
                Send me a message
              </Button>
            </div>
            <div className={styles.column}>
              <div className={styles.tag} aria-hidden>
                <Divider
                  notchWidth="64px"
                  notchHeight="8px"
                  collapsed={!visible}
                  collapseDelay={1000}
                />
                <div className={styles.tagText} data-visible={visible}>
                  About me
                </div>
              </div>
              <div className={styles.image}>
                <Image
                  reveal
                  delay={100}
                  placeholder={profileImgPlaceholder}
                  srcSet={`${profileImg} 480w, ${profileImgLarge} 960w`}
                  width={960}
                  height={1100}
                  sizes={`(max-width: ${media.mobile}px) 100vw, 480px`}
                  alt="Portrait of Jatin Mangla, Frontend Developer"
                />
                <svg className={styles.svg} data-visible={visible} viewBox="0 0 200 900">
                  <use href={`${jatin}#katakana-profile`} />
                </svg>
              </div>
            </div>
          </div>
        )}
      </Transition>
    </Section>
  );
};
