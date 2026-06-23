import scHowItWorks from '~/assets/sc-how-it-works.gif';
import scAnimateBox from '~/assets/sc-animate-box.gif';
import scChildDriven from '~/assets/sc-child-driven.gif';
import scTamperproof from '~/assets/sc-tamperproof.png';
import scRewards from '~/assets/sc-rewards.png';
import scNagFree from '~/assets/sc-nag-free.png';
import scFunFilled from '~/assets/sc-fun-filled.png';
import scReport from '~/assets/sc-report.png';
import scTeen from '~/assets/sc-teen.png';
import scLogo from '~/assets/sc-logo.png';
import { Button } from '~/components/button';
import { Footer } from '~/components/footer';
import { Image } from '~/components/image';
import { Link } from '~/components/link';
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

const title = 'Screen Coach — Screen Time Monitoring';
const description =
  'Developed a responsive UI and RESTful APIs for a screen-time monitoring tool optimized for low-memory set-top devices. Built with JavaScript, Node.js, and MongoDB for real-time data handling and smooth frontend-backend integration.';
const roles = [
  'Frontend Development',
  'Node.js & MongoDB APIs',
  'Performance Optimization',
  'Real-time Data',
];

export const meta = () => {
  return baseMeta({ title, description, prefix: 'Projects' });
};

export function ScreenCoach() {
  return (
    <Fragment>
      <ProjectContainer>
        <ProjectBackground
          opacity={0.5}
          src={scAnimateBox}
          srcSet={`${scAnimateBox} 800w`}
          placeholder={scAnimateBox}
        />
        <ProjectHeader
          title={title}
          description={description}
          url="https://www.myscreencoach.com"
          roles={roles}
        />
        <ProjectSection padding="top">
          <ProjectSectionContent>
            <ProjectTextRow center noMargin>
              <ProjectImage
                raised
                srcSet={`${scHowItWorks} 1000w`}
                width={1000}
                height={150}
                placeholder={scHowItWorks}
                sizes={`(max-width: ${media.mobile}px) 100vw, 1000px`}
                alt="Screen Coach application showing how the screen time monitoring works"
                style={{ maxWidth: '100%' }}
              />
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection>
          <ProjectTextRow>
            <ProjectSectionHeading>The Challenge</ProjectSectionHeading>
            <ProjectSectionText>
              Screen Coach needed a lightweight, performant frontend optimized for
              low-memory set-top box devices while providing real-time screen time
              monitoring capabilities. The backend required RESTful APIs with Node.js
              and MongoDB for efficient data synchronization between devices and the
              monitoring dashboard.
            </ProjectSectionText>
          </ProjectTextRow>
        </ProjectSection>
        <ProjectSection light>
          <ProjectSectionContent>
            <ProjectTextRow center noMargin>
              <Image
                srcSet={`${scChildDriven} 950w`}
                width={950}
                height={1920}
                placeholder={scChildDriven}
                alt="Screen Coach child-driven screen time management interface"
                sizes="(max-width: 600px) 95vw, 400px"
                style={{ maxWidth: '400px', width: '100%', height: 'auto' }}
              />
            </ProjectTextRow>
            <ProjectTextRow>
              <ProjectSectionHeading>Child-Driven Screen Time Management</ProjectSectionHeading>
              <ProjectSectionText>
                Built an intuitive interface that empowers children to manage their
                own screen time through a reward-based system. The child-driven
                approach encourages responsible device usage while giving parents
                visibility into screen time patterns and habits.
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection>
          <ProjectSectionContent>
            <ProjectTextRow center noMargin>
              <ProjectImage
                raised
                srcSet={`${scTamperproof} 950w`}
                width={950}
                height={1920}
                placeholder={scTamperproof}
                alt="Screen Coach tamper-proof protection preventing children from bypassing screen time limits"
                sizes="(max-width: 600px) 95vw, 400px"
                style={{ maxWidth: '400px', width: '100%', height: 'auto' }}
              />
            </ProjectTextRow>
            <ProjectTextRow>
              <ProjectSectionHeading>Tamper-Proof Protection</ProjectSectionHeading>
              <ProjectSectionText>
                Implemented robust tamper-proof mechanisms to prevent children from
                bypassing screen time limits. The system monitors device activity in
                real-time and enforces time restrictions even across multiple apps,
                ensuring the monitoring cannot be easily circumvented.
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection>
          <ProjectSectionContent>
            <ProjectTextRow center noMargin>
              <ProjectImage
                raised
                srcSet={`${scRewards} 800w`}
                width={800}
                height={1600}
                placeholder={scRewards}
                alt="Screen Coach rewards system encouraging positive screen time behavior"
                sizes="(max-width: 600px) 95vw, 400px"
                style={{ maxWidth: '400px', width: '100%', height: 'auto' }}
              />
            </ProjectTextRow>
            <ProjectTextRow>
              <ProjectSectionHeading>Rewards System</ProjectSectionHeading>
              <ProjectSectionText>
                Developed a gamified rewards system that motivates children to earn
                additional screen time through positive behaviors. The reward
                mechanism tracks tasks and achievements, converting them into
                screen time credits with real-time updates.
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection light>
          <ProjectSectionContent>
            <ProjectTextRow center noMargin>
              <Image
                srcSet={`${scReport} 500w`}
                width={500}
                height={600}
                placeholder={scReport}
                alt="Screen Coach reporting dashboard showing screen time analytics"
                sizes="(max-width: 600px) 95vw, 500px"
                style={{ maxWidth: '500px', width: '100%', height: 'auto' }}
              />
            </ProjectTextRow>
            <ProjectTextRow>
              <ProjectSectionHeading>Reporting & Analytics</ProjectSectionHeading>
              <ProjectSectionText>
                Built comprehensive reporting dashboards that give parents detailed
                insights into screen time usage across all devices. The dashboard
                shows daily and weekly trends, app-by-app breakdowns, and helps
                parents make informed decisions about screen time limits.
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection>
          <ProjectTextRow>
            <ProjectSectionHeading>Nag-Free & Fun-Filled Experience</ProjectSectionHeading>
            <ProjectSectionText>
              Screen Coach eliminates the constant nagging between parents and children
              about screen time. The app provides a fun-filled, engaging experience
              where kids take ownership of their screen time, while parents get peace
              of mind knowing the system is working in the background.
            </ProjectSectionText>
          </ProjectTextRow>
        </ProjectSection>
        <ProjectSection>
          <ProjectSectionContent>
            <ProjectSectionColumns>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                <Image
                  raised
                  srcSet={`${scNagFree} 800w`}
                  width={800}
                  height={1600}
                  placeholder={scNagFree}
                  alt="Screen Coach nag-free screen time monitoring"
                  sizes="(max-width: 600px) 45vw, 250px"
                  style={{ maxWidth: '250px', width: '100%', height: 'auto' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                <Image
                  raised
                  srcSet={`${scFunFilled} 800w`}
                  width={800}
                  height={1600}
                  placeholder={scFunFilled}
                  alt="Screen Coach fun-filled experience for children"
                  sizes="(max-width: 600px) 45vw, 250px"
                  style={{ maxWidth: '250px', width: '100%', height: 'auto' }}
                />
              </div>
            </ProjectSectionColumns>
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection>
          <ProjectSectionContent>
            <ProjectTextRow center noMargin>
              <Image
                raised
                srcSet={`${scTeen} 451w`}
                width={451}
                height={340}
                placeholder={scTeen}
                alt="Screen Coach teen-focused screen time monitoring and parental controls"
                sizes="(max-width: 600px) 95vw, 600px"
                style={{ maxWidth: '600px', width: '100%', height: 'auto' }}
              />
            </ProjectTextRow>
            <ProjectTextRow>
              <ProjectSectionHeading>Technical Architecture</ProjectSectionHeading>
              <ProjectSectionText>
                On the backend, I developed RESTful APIs using Node.js and Express.js
                with MongoDB for storing screen time data. The system handles real-time
                data synchronization between devices and the monitoring dashboard,
                with efficient querying for usage analytics and trend reporting.
                Optimized JavaScript execution for low-memory environments with lazy
                resource loading and debounced event handlers.
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection>
          <ProjectSectionContent>
            <ProjectTextRow center centerMobile noMargin>
              <ProjectSectionHeading>Project Outcomes</ProjectSectionHeading>
              <ProjectSectionText>
                Screen Coach successfully delivered a performant screen-time monitoring
                solution for resource-constrained devices. The optimized JavaScript
                frontend maintained smooth performance even on low-memory set-top boxes,
                while the Node.js/MongoDB backend handled real-time data streaming
                efficiently. Visit{' '}
                <Link href="https://www.myscreencoach.com">myscreencoach.com</Link>{' '}
                to learn more.
              </ProjectSectionText>
              <Button
                secondary
                iconHoverShift
                icon="chevron-right"
                href="https://www.myscreencoach.com"
              >
                Visit Screen Coach
              </Button>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
      </ProjectContainer>
      <Footer />
    </Fragment>
  );
}