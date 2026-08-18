import phoneTexture from '~/assets/sc-phone-dashboard.jpg';
import phoneTexturePlaceholder from '~/assets/sc-phone-dashboard-placeholder.jpg';
import phoneTexture2 from '~/assets/sc-phone-rewards.jpg';
import phoneTexture2Placeholder from '~/assets/sc-phone-rewards-placeholder.jpg';
import laptopTexture from '~/assets/mm-analytics-dashboard.png';
import { Model } from '~/components/model';
import { StoryContainer } from '../../../.storybook/story-container';
import { deviceModels } from './device-models';

export default {
  title: 'Model',
};

const modelStyle = { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 };

export const Phone = () => (
  <StoryContainer padding={0}>
    <Model
      style={modelStyle}
      cameraPosition={{ x: 0, y: 0, z: 11.5 }}
      alt="Phone models"
      models={[
        {
          ...deviceModels.phone,
          position: { x: -0.6, y: 0.8, z: 0.1 },
          texture: {
            srcSet: `${phoneTexture} 750w`,
            placeholder: phoneTexturePlaceholder,
          },
        },
        {
          ...deviceModels.phone,
          position: { x: 0.6, y: -0.8, z: 0.4 },
          texture: {
            srcSet: `${phoneTexture2} 750w`,
            placeholder: phoneTexture2Placeholder,
          },
        },
      ]}
    />
  </StoryContainer>
);

export const Laptop = () => (
  <StoryContainer padding={0}>
    <Model
      style={modelStyle}
      cameraPosition={{ x: 0, y: 0, z: 8 }}
      alt="Laptop model"
      models={[
        {
          ...deviceModels.laptop,
          position: { x: 0, y: 0, z: 0 },
          texture: {
            srcSet: `${laptopTexture} 1280w`,
            placeholder: laptopTexture,
          },
        },
      ]}
    />
  </StoryContainer>
);
