import msgBackground from '~/assets/msg-background.jpg';
import msgBackgroundLarge from '~/assets/msg-background-large.jpg';
import msgBackgroundPlaceholder from '~/assets/msg-background-placeholder.jpg';
import msgApp from '~/assets/msg-laptop-context.jpg';
import msgAppLarge from '~/assets/msg-laptop-context-large.jpg';
import msgAppPlaceholder from '~/assets/msg-laptop-context-placeholder.jpg';
import msgSidebar1 from '~/assets/msg-sidebar-1.jpg';
import msgSidebar1Large from '~/assets/msg-sidebar-1-large.jpg';
import msgSidebar1Placeholder from '~/assets/msg-sidebar-1-placeholder.jpg';
import msgSidebar2 from '~/assets/msg-sidebar-2.jpg';
import msgSidebar2Large from '~/assets/msg-sidebar-2-large.jpg';
import msgSidebar2Placeholder from '~/assets/msg-sidebar-2-placeholder.jpg';
import msgCampaign from '~/assets/msg-laptop-context-2.jpg';
import msgCampaignLarge from '~/assets/msg-laptop-context-2-large.jpg';
import msgCampaignPlaceholder from '~/assets/msg-laptop-context-2-placeholder.jpg';
import msgIrl from '~/assets/msg-team-irl.jpg';
import msgIrlPlaceholder from '~/assets/msg-team-irl-placeholder.jpg';
import { Footer } from '~/components/footer';
import { Image } from '~/components/image';
import {
  ProjectBackground,
  ProjectContainer,
  ProjectHeader,
  ProjectImage,
  ProjectSection,
  ProjectSectionColumns,
  ProjectSectionContent,
  ProjectSectionHeading,
  ProjectSectionText,
  ProjectTextRow,
} from '~/layouts/project';
import { Fragment } from 'react';
import { media } from '~/utils/style';
import { baseMeta } from '~/utils/meta';
import styles from './slice.module.css';

const title = 'UI Integration — Messaging Automation';
const description =
  'Designed and implemented user interfaces for WhatsApp, Telegram, and SMS automation integrations, delivering a unified multi-channel dashboard that supports bulk campaigns, workflow automation, scheduled messaging, and real-time delivery analytics — with full cross-browser compatibility and responsive design.';
const roles = [
  'Frontend Development',
  'UI/UX Design',
  'REST API Integration',
  'Cross-browser Compatibility',
  'Responsive Design',
  'jQuery & HTML5/CSS3',
];

export const meta = () => {
  return baseMeta({ title, description, prefix: 'Projects' });
};

export const Slice = () => {
  return (
    <Fragment>
      <ProjectContainer className={styles.slice}>
        <ProjectBackground
          src={msgBackground}
          srcSet={`${msgBackground} 1280w, ${msgBackgroundLarge} 2560w`}
          width={1280}
          height={720}
          placeholder={msgBackgroundPlaceholder}
          opacity={0.8}
        />
        <ProjectHeader
          title={title}
          description={description}
          roles={roles}
        />
        <ProjectSection padding="top">
          <ProjectSectionContent>
            <ProjectImage
              srcSet={`${msgAppLarge} 1920w, ${msgApp} 1280w`}
              width={1280}
              height={854}
              placeholder={msgAppPlaceholder}
              alt="Laptop displaying the messaging automation dashboard with WhatsApp, Telegram, and SMS channel management."
              sizes={`(max-width: ${media.mobile}px) 100vw, (max-width: ${media.tablet}px) 90vw, 80vw`}
            />
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection>
          <ProjectSectionColumns centered className={styles.columns}>
            <div className={styles.imagesText}>
              <ProjectSectionHeading>Multi-channel Integration</ProjectSectionHeading>
              <ProjectSectionText>
                Built a unified messaging interface that consolidates WhatsApp, Telegram,
                and SMS channels into a single dashboard. Operators can manage automated
                campaigns, schedule messages in advance, and monitor delivery analytics
                across all platforms without switching tools.
              </ProjectSectionText>
              <ProjectSectionText>
                Implemented contact segmentation, template management, and dynamic
                variable substitution to enable personalised bulk messaging at scale.
                The UI adapts seamlessly across desktop and mobile with consistent
                cross-browser behaviour on Chrome, Firefox, Safari, and Edge.
              </ProjectSectionText>
            </div>
            <div className={styles.sidebarImages}>
              <Image
                className={styles.sidebarImage}
                srcSet={`${msgSidebar1Large} 700w, ${msgSidebar1} 440w`}
                width={350}
                height={525}
                placeholder={msgSidebar1Placeholder}
                alt="Smartphone screen showing active WhatsApp messaging conversation with automated replies."
                sizes={`(max-width: ${media.mobile}px) 200px, 343px`}
              />
              <Image
                className={styles.sidebarImage}
                srcSet={`${msgSidebar2Large} 700w, ${msgSidebar2} 440w`}
                width={350}
                height={525}
                placeholder={msgSidebar2Placeholder}
                alt="Person holding a smartphone using a Telegram or SMS automation chat interface."
                sizes={`(max-width: ${media.mobile}px) 200px, 343px`}
              />
            </div>
          </ProjectSectionColumns>
        </ProjectSection>
        <ProjectSection light>
          <ProjectSectionContent>
            <ProjectTextRow>
              <ProjectSectionHeading>Responsive UI Architecture</ProjectSectionHeading>
              <ProjectSectionText>
                The frontend is built with HTML5, CSS3, and jQuery, using a custom
                component library for forms, modals, and notification banners. Implemented
                drag-and-drop message template builders, real-time delivery status
                indicators, and role-based permission panels that render correctly at
                every screen size — from a 320 px phone to a 4 K display.
              </ProjectSectionText>
              <ProjectSectionText>
                RESTful API integrations were kept thin and declarative: each channel
                adapter exposes a consistent interface so the UI layer never needs to
                branch on provider-specific payload formats.
              </ProjectSectionText>
            </ProjectTextRow>
            <Image
              srcSet={`${msgCampaignLarge} 1920w, ${msgCampaign} 1280w`}
              width={1280}
              height={854}
              placeholder={msgCampaignPlaceholder}
              alt="Laptop open in a workspace showing the messaging campaign management interface."
              sizes={`(max-width: ${media.mobile}px) 500px, (max-width: ${media.tablet}px) 800px, 1000px`}
            />
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection>
          <ProjectSectionContent>
            <ProjectTextRow>
              <ProjectSectionHeading>Project outcomes</ProjectSectionHeading>
              <ProjectSectionText>
                The messaging automation UI streamlined communication workflows for
                enterprise clients, enabling bulk messaging across WhatsApp, Telegram,
                and SMS from a single interface. Delivery reports and open-rate dashboards
                gave marketing teams immediate visibility into campaign performance.
                The responsive design achieved 100 % cross-browser compatibility, and
                the intuitive UX cut onboarding time for new operators significantly.
              </ProjectSectionText>
            </ProjectTextRow>
            <Image
              src={msgIrl}
              width={940}
              height={1410}
              placeholder={msgIrlPlaceholder}
              alt="Professional team reviewing messaging campaign analytics on laptops in a modern workspace."
            />
          </ProjectSectionContent>
        </ProjectSection>
      </ProjectContainer>
      <Footer />
    </Fragment>
  );
};
