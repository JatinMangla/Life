import { Button } from '~/components/button';
import { DecoderText } from '~/components/decoder-text';
import { Divider } from '~/components/divider';
import { useHydrated } from '~/hooks/useHydrated';
import { Heading } from '~/components/heading';
import { Icon } from '~/components/icon';
import { Input } from '~/components/input';
import { Section } from '~/components/section';
import { Text } from '~/components/text';
import { tokens } from '~/components/theme-provider/theme';
import { Transition } from '~/components/transition';
import { useFormInput } from '~/hooks';
import { Suspense, lazy, useRef } from 'react';
import { cssProps, msToNum, numToMs } from '~/utils/style';
import { baseMeta } from '~/utils/meta';
import { useFetcher } from '@remix-run/react';
import type { ContactActionData } from '~/routes/api.contact/route';
import styles from './contact.module.css';

// Purely decorative and aria-hidden, so keep three.js and the ~1MB globe
// model out of the entry chunk for a page that is three text inputs.
const ContactEarth = lazy(() =>
  import('./earth').then(module => ({ default: module.ContactEarth }))
);

export const meta = () => {
  return baseMeta({
    title: 'Contact',
    path: '/contact',
    description:
      'Send me a message if you want to discuss a project, collaboration, or just want to connect',
  });
};

// Prefetch the draco decoder so the 3D globe model decodes without delay
export const links = () => [
  {
    rel: 'prefetch',
    href: '/draco/draco_wasm_wrapper.js',
    as: 'script',
    type: 'text/javascript',
    importance: 'low',
  },
  {
    rel: 'prefetch',
    href: '/draco/draco_decoder.wasm',
    as: 'fetch',
    type: 'application/wasm',
    importance: 'low',
  },
];

const MAX_EMAIL_LENGTH = 512;
const MAX_MESSAGE_LENGTH = 4096;
const MAX_NAME_LENGTH = 100;

export const Contact = () => {
  const errorRef = useRef<HTMLDivElement>(null);
  const isHydrated = useHydrated();
  const name = useFormInput('');
  const email = useFormInput('');
  const message = useFormInput('');
  const initDelay = tokens.base.durationS;
  // Email sending lives in the /api/contact resource route (server-only).
  const fetcher = useFetcher<ContactActionData>();
  const actionData = fetcher.data;
  const sending = fetcher.state === 'submitting';

  return (
    <Section className={styles.contact}>
      <Transition<HTMLFormElement> unmount in={!actionData?.success} timeout={1600}>
        {({ status, nodeRef }) => (
          <fetcher.Form
            className={styles.form}
            method="post"
            action="/api/contact"
            ref={nodeRef}
          >
            <Heading
              className={styles.title}
              data-status={status}
              level={3}
              as="h1"
              style={getDelay(tokens.base.durationXS, initDelay, 0.3)}
            >
              <DecoderText text="Say hello" start={status !== 'exited'} delay={300} />
            </Heading>
            <Divider
              className={styles.divider}
              data-status={status}
              style={getDelay(tokens.base.durationXS, initDelay, 0.4)}
            />
            {/* Honeypot — hidden from real users, bots fill it */}
            <Input
              className={styles.botkiller}
              label="Website"
              name="website"
              maxLength={MAX_EMAIL_LENGTH}
            />
            <Input
              required
              className={styles.input}
              data-status={status}
              style={getDelay(tokens.base.durationXS, initDelay, 0.5)}
              autoComplete="name"
              label="Your name"
              type="text"
              name="name"
              maxLength={MAX_NAME_LENGTH}
              {...name}
            />
            <Input
              required
              className={styles.input}
              data-status={status}
              style={getDelay(tokens.base.durationXS, initDelay)}
              autoComplete="email"
              label="Your email"
              type="email"
              name="email"
              maxLength={MAX_EMAIL_LENGTH}
              {...email}
            />
            <Input
              required
              multiline
              className={styles.input}
              data-status={status}
              style={getDelay(tokens.base.durationS, initDelay)}
              autoComplete="off"
              label="Message"
              name="message"
              maxLength={MAX_MESSAGE_LENGTH}
              {...message}
            />
            <Transition<HTMLDivElement>
              unmount
              in={!sending && !!actionData?.errors}
              timeout={msToNum(tokens.base.durationM)}
            >
              {({ status: errorStatus, nodeRef }) => (
                <div
                  className={styles.formError}
                  ref={nodeRef}
                  data-status={errorStatus}
                  style={cssProps({
                    height: errorStatus ? errorRef.current?.offsetHeight : 0,
                  })}
                >
                  <div className={styles.formErrorContent} ref={errorRef}>
                    <div className={styles.formErrorMessage} role="alert">
                      <Icon className={styles.formErrorIcon} icon="error" />
                      {actionData?.errors?.name}
                      {actionData?.errors?.name && ' '}
                      {actionData?.errors?.email}
                      {actionData?.errors?.email && actionData?.errors?.message && ' '}
                      {actionData?.errors?.message}
                      {actionData?.errors?.general}
                    </div>
                  </div>
                </div>
              )}
            </Transition>
            <Button
              className={styles.button}
              data-status={status}
              data-sending={sending}
              style={getDelay(tokens.base.durationM, initDelay)}
              disabled={sending}
              loading={sending}
              loadingText="Sending..."
              icon="send"
              type="submit"
            >
              Send message
            </Button>
          </fetcher.Form>
        )}
      </Transition>
      <Transition<HTMLDivElement> unmount in={actionData?.success}>
        {({ status, nodeRef }) => (
          <div className={styles.complete} aria-live="polite" ref={nodeRef}>
            <Heading
              level={3}
              as="h3"
              className={styles.completeTitle}
              data-status={status}
            >
              Message Sent
            </Heading>
            <Text
              size="l"
              as="p"
              className={styles.completeText}
              data-status={status}
              style={getDelay(tokens.base.durationXS)}
            >
              Thanks{actionData?.name ? `, ${actionData.name}` : ''}! I&rsquo;ll get back to you within a couple days.
            </Text>
            <Button
              secondary
              iconHoverShift
              className={styles.completeButton}
              data-status={status}
              style={getDelay(tokens.base.durationM)}
              href="/"
              icon="chevron-right"
            >
              Back to homepage
            </Button>
          </div>
        )}
      </Transition>
      <div className={styles.earthColumn} aria-hidden>
        <div className={styles.globe}>
          {isHydrated && (
            <Suspense fallback={null}>
              <ContactEarth />
            </Suspense>
          )}
        </div>
      </div>
    </Section>
  );
};

function getDelay(delayMs: string, offset: string = numToMs(0), multiplier = 1) {
  const numDelay = msToNum(delayMs) * multiplier;
  return cssProps({ delay: numToMs(Math.round(msToNum(offset) + numDelay)) });
}
