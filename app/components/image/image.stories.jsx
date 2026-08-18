import { Image } from '~/components/image';
import scPhoneDashboard from '~/assets/sc-phone-dashboard.jpg';
import scPhoneDashboardPlaceholder from '~/assets/sc-phone-dashboard-placeholder.jpg';
import { StoryContainer } from '../../../.storybook/story-container';

export default {
  title: 'Image',
};

const imageData = {
  alt: 'Screen Coach dashboard showing screen time analytics',
  src: scPhoneDashboard,
  width: 750,
  height: 1500,
  placeholder: scPhoneDashboardPlaceholder,
};

const Story = args => (
  <StoryContainer>
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0px, 480px)' }}>
      <Image {...imageData} {...args} />
    </div>
  </StoryContainer>
);

export const Default = Story.bind({});

Default.args = {
  ...imageData,
};

export const Reveal = Story.bind({});

Reveal.args = {
  ...imageData,
  reveal: true,
};
