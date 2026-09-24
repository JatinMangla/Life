import { Link } from '~/components/link';
import { StoryContainer } from '../../../.storybook/story-container';

export default {
  title: 'Link',
};

export const Default = () => (
  <StoryContainer style={{ fontSize: 18 }}>
    <Link href="/">Primary link</Link>
    <Link secondary href="/">
      Secondary link
    </Link>
  </StoryContainer>
);
