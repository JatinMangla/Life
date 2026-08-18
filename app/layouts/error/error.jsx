import { Button } from '~/components/button';
import { DecoderText } from '~/components/decoder-text';
import { Heading } from '~/components/heading';
import { Text } from '~/components/text';
import { Transition } from '~/components/transition';
import styles from './error.module.css';

// Route errors carry a numeric `status`; thrown JS errors do not. Anything
// without one is an unexpected failure rather than a known HTTP response.
function getMessage(error) {
  switch (error?.status) {
    case 404:
      return {
        code: '404',
        summary: 'Page not found',
        message:
          'This page doesn’t exist, or it moved. The links below will get you back on track.',
      };
    case 405:
      return {
        code: '405',
        summary: 'Method not allowed',
        message: error.data || 'That request method isn’t supported on this route.',
      };
    default:
      return {
        code: error?.status ? String(error.status) : 'Error',
        summary: 'Something went wrong',
        message:
          error?.statusText ||
          error?.data ||
          'An unexpected error occurred. Try again, or head back to the homepage.',
      };
  }
}

export function Error({ error }) {
  const { code, summary, message } = getMessage(error);

  return (
    <section className={styles.page}>
      <Transition in>
        {({ visible }) => (
          <div className={styles.details}>
            <div className={styles.text}>
              <Heading
                className={styles.title}
                data-visible={visible}
                level={0}
                weight="bold"
              >
                {code}
              </Heading>
              <Heading
                className={styles.subheading}
                data-visible={visible}
                as="h1"
                level={4}
              >
                <DecoderText text={summary} start={visible} delay={300} />
              </Heading>
              <Text className={styles.description} data-visible={visible} as="p">
                {message}
              </Text>
              <div className={styles.actions} data-visible={visible}>
                <Button
                  secondary
                  iconHoverShift
                  className={styles.button}
                  href="/"
                  icon="chevron-right"
                >
                  Back to homepage
                </Button>
                <Button
                  secondary
                  iconHoverShift
                  className={styles.button}
                  href="/contact"
                  icon="send"
                >
                  Get in touch
                </Button>
              </div>
            </div>
          </div>
        )}
      </Transition>
    </section>
  );
}
