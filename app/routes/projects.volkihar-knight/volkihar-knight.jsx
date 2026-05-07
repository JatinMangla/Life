import volkiharBackgroundLarge from '~/assets/volkihar-background-large.jpg';
import volkiharBackgroundPlaceholder from '~/assets/volkihar-background-placeholder.jpg';
import volkiharBackground from '~/assets/volkihar-background.jpg';
import volkiharBannerLarge from '~/assets/volkihar-banner-large.jpg';
import volkiharBannerPlaceholder from '~/assets/volkihar-banner-placeholder.jpg';
import volkiharBanner from '~/assets/volkihar-banner.jpg';
import volkiharBookLarge from '~/assets/volkihar-book-large.png';
import volkiharBookPlaceholder from '~/assets/volkihar-book-placeholder.png';
import volkiharBook from '~/assets/volkihar-book.png';
import volkiharEnderalLarge from '~/assets/volkihar-enderal-large.jpg';
import volkiharEnderalLogoLarge from '~/assets/volkihar-enderal-logo-large.png';
import volkiharEnderalLogoPlaceholder from '~/assets/volkihar-enderal-logo-placeholder.png';
import volkiharEnderalLogo from '~/assets/volkihar-enderal-logo.png';
import volkiharEnderalPlaceholder from '~/assets/volkihar-enderal-placeholder.jpg';
import volkiharEnderal from '~/assets/volkihar-enderal.jpg';
import volkiharSlide1Large from '~/assets/volkihar-slide-1-large.jpg';
import volkiharSlide1 from '~/assets/volkihar-slide-1.jpg';
import volkiharSlide2Large from '~/assets/volkihar-slide-2-large.jpg';
import volkiharSlide2 from '~/assets/volkihar-slide-2.jpg';
import volkiharSlide3Large from '~/assets/volkihar-slide-3-large.jpg';
import volkiharSlide3 from '~/assets/volkihar-slide-3.jpg';
import volkiharSlidePlaceholder from '~/assets/volkihar-slide-placeholder.jpg';
import { Button } from '~/components/button';
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
import { Fragment, Suspense, lazy } from 'react';
import { media } from '~/utils/style';
import { baseMeta } from '~/utils/meta';
import { VolkiharLogo } from './volkihar-logo';
import styles from './volkihar-knight.module.css';

const Carousel = lazy(() =>
  import('~/components/carousel').then(module => ({ default: module.Carousel }))
);

const Armor = lazy(() => import('./armor').then(module => ({ default: module.Armor })));

const title = 'Screen Coach — Screen Time Monitoring';
const description =
  'Developed a responsive UI and RESTful APIs for a screen-time monitoring tool optimized for low-memory set-top devices. Built with JavaScript, Node.js, and MongoDB for real-time data handling and smooth frontend-backend integration.';
const roles = ['Frontend Development', 'Node.js & MongoDB APIs', 'Performance Optimization', 'Real-time Data'];

export const meta = () => {
  return baseMeta({ title, description, prefix: 'Projects' });
};

export function VolkiharKnight() {
  return (
    <Fragment>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            [data-theme='dark'] {
              --primary: oklch(87.71% 0.084 85.29);
              --accent: oklch(87.71% 0.084 85.29);
            }
            [data-theme='light'] {
              --primary: oklch(52.25% 0.121 81.53);
              --accent: oklch(52.25% 0.121 81.53);
            }
          `,
        }}
      />
      <ProjectContainer>
        <ProjectBackground
          srcSet={`${volkiharBackground} 1280w, ${volkiharBackgroundLarge} 1920w`}
          width={1280}
          height={720}
          placeholder={volkiharBackgroundPlaceholder}
          opacity={0.5}
        />
        <ProjectHeader
          title={title}
          description={description}
          roles={roles}
        />
        <ProjectSection>
          <ProjectSectionContent>
            <ProjectImage
              srcSet={`${volkiharBanner} 800w, ${volkiharBannerLarge} 1100w`}
              width={800}
              height={436}
              placeholder={volkiharBannerPlaceholder}
              alt="Screen Coach application dashboard showing screen time analytics and usage patterns."
              sizes={`(max-width: ${media.mobile}px) 500px, (max-width: ${media.tablet}px) 800px, 1000px`}
            />
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection>
          <ProjectSectionContent>
            <Image
              srcSet={`${volkiharBook} 490w, ${volkiharBookLarge} 960w`}
              width={480}
              height={300}
              placeholder={volkiharBookPlaceholder}
              alt="Screen Coach backend architecture diagram showing Node.js API endpoints and MongoDB data flow"
              sizes={`(max-width: ${media.mobile}px) 90vw, (max-width: ${media.tablet}px) 80vw, 70vw`}
            />
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection>
          <ProjectSectionColumns>
            <div className={styles.armor}>
              <Suspense>
                <Armor alt="3D model of the Volkihar Knight armor" />
              </Suspense>
            </div>
            <div className={styles.textSection}>
              <ProjectSectionHeading>Technical Architecture</ProjectSectionHeading>
              <ProjectSectionText>
                Screen Coach required a lightweight frontend optimized for low-memory
                set-top box devices. I built the UI using vanilla JavaScript with
                minimal dependencies, ensuring smooth performance on resource-constrained
                hardware.
              </ProjectSectionText>
              <ProjectSectionText>
                On the backend, I developed RESTful APIs using Node.js and Express.js
                with MongoDB for storing screen time data. The system handles real-time
                data synchronization between devices and the monitoring dashboard,
                with efficient querying for usage analytics and trend reporting.
              </ProjectSectionText>
            </div>
          </ProjectSectionColumns>
        </ProjectSection>
        <ProjectSection>
          <ProjectSectionContent>
            <div className={styles.logoContainer}>
              <VolkiharLogo
                role="img"
                aria-label="The Volkihar Knight logo, a monogram using the letters 'V' and 'K"
              />
            </div>
            <ProjectTextRow center noMargin>
              <ProjectSectionHeading>Performance & Debugging</ProjectSectionHeading>
              <ProjectSectionText>
                Optimized JavaScript execution for low-memory environments. Implemented
                efficient memory management, lazy resource loading, and debounced event
                handlers to ensure smooth operation on constrained devices while
                maintaining accurate real-time screen time tracking.
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection>
          <ProjectSectionContent>
            <Suspense>
              <Carousel
                placeholder={volkiharSlidePlaceholder}
                images={[
                  {
                    srcSet: `${volkiharSlide1} 960w, ${volkiharSlide1Large} 1920w`,
                    sizes: `(max-width: ${media.mobile}px) 100vw, (max-width: ${media.tablet}px) 100vw, 1096px`,
                    alt: 'A female character wearing the black coloured armor set.',
                  },
                  {
                    srcSet: `${volkiharSlide2} 960w, ${volkiharSlide2Large} 1920w`,
                    sizes: `(max-width: ${media.mobile}px) 100vw, (max-width: ${media.tablet}px) 100vw, 1096px`,
                    alt: 'A close up of the custom gauntlets design.',
                  },
                  {
                    srcSet: `${volkiharSlide3} 960w, ${volkiharSlide3Large} 1920w`,
                    sizes: `(max-width: ${media.mobile}px) 100vw, (max-width: ${media.tablet}px) 100vw, 1096px`,
                    alt: 'A female character wielding a sword and wearing the red coloured armor.',
                  },
                ]}
                width={1920}
                height={1080}
              />
            </Suspense>
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection
          backgroundElement={
            <Image
              srcSet={`${volkiharEnderal} 1280w, ${volkiharEnderalLarge} 1920w`}
              width={1280}
              height={720}
              placeholder={volkiharEnderalPlaceholder}
              alt="A promotional image from Enderal showing several characters in the game overlooking a distant city."
              sizes={`100vw`}
            />
          }
        >
          <ProjectSectionContent>
            <ProjectTextRow center centerMobile noMargin>
              <Image
                srcSet={`${volkiharEnderalLogo} 180w, ${volkiharEnderalLogoLarge} 360w`}
                width={180}
                height={200}
                placeholder={volkiharEnderalLogoPlaceholder}
                alt="The Enderal game logo"
                sizes={`(max-width: ${media.mobile}px) 100vw, (max-width: ${media.tablet}px) 100vw, 220px`}
                style={{ maxWidth: 220, width: '100%', marginBottom: 30 }}
              />
              <ProjectSectionHeading>Project Outcomes</ProjectSectionHeading>
              <ProjectSectionText>
                Screen Coach successfully delivered a performant screen-time monitoring
                solution for resource-constrained devices. The optimized JavaScript
                frontend maintained smooth performance even on low-memory set-top boxes,
                while the Node.js/MongoDB backend handled real-time data streaming
                efficiently. The project improved debugging workflows and established
                best practices for building performance-critical applications.
              </ProjectSectionText>
              <Button
                secondary
                iconHoverShift
                icon="chevron-right"
                href="https://meramonitor.com"
              >
                View Mera Monitor
              </Button>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
      </ProjectContainer>
      <Footer />
    </Fragment>
  );
}
