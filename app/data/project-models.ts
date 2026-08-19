import mmDashboard from '~/assets/mm-analytics-dashboard.webp';
import mmDashboardPlaceholder from '~/assets/mm-analytics-dashboard-placeholder.jpg';
import scPhoneDashboard from '~/assets/sc-phone-dashboard.jpg';
import scPhoneDashboardPlaceholder from '~/assets/sc-phone-dashboard-placeholder.jpg';
import scPhoneRewards from '~/assets/sc-phone-rewards.jpg';
import scPhoneRewardsPlaceholder from '~/assets/sc-phone-rewards-placeholder.jpg';
import type { ProjectModel, ProjectSlug } from './projects';

/**
 * The 3D device preview for each project's home-page card.
 *
 * Split out from `projects.ts` so that module stays free of asset imports and
 * can be read (or tested) without pulling images through the bundler.
 */
export const projectModels: Record<ProjectSlug, ProjectModel> = {
  'mera-monitor': {
    type: 'laptop',
    alt: 'Mera Monitor dashboard showing employee productivity metrics',
    textures: [
      {
        srcSet: `${mmDashboard} 1280w`,
        placeholder: mmDashboardPlaceholder,
      },
    ],
  },
  'screen-coach': {
    type: 'phone',
    alt: 'Screen Coach app showing screen time analytics',
    textures: [
      {
        srcSet: `${scPhoneDashboard} 750w`,
        placeholder: scPhoneDashboardPlaceholder,
      },
      {
        srcSet: `${scPhoneRewards} 750w`,
        placeholder: scPhoneRewardsPlaceholder,
      },
    ],
  },
};
