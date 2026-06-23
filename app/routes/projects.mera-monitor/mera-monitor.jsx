import backgroundSprLarge from '~/assets/spr-background-large.jpg';
import backgroundSprPlaceholder from '~/assets/spr-background-placeholder.jpg';
import backgroundSpr from '~/assets/spr-background.jpg';
import mmAnalyticsDashboard from '~/assets/mm-analytics-dashboard.png';
import mmScreenMonitoring from '~/assets/mm-screen-monitoring.png';
import mmProductivity from '~/assets/mm-productivity.png';
import mmWebApps from '~/assets/mm-web-apps.png';
import mmAttendance from '~/assets/mm-attendance.png';
import mmTeamSupport from '~/assets/mm-team-support.png';
import mmEfficiency from '~/assets/mm-efficiency.png';
import mmVisibility from '~/assets/mm-visibility.png';
import mmHoursSaved from '~/assets/mm-hours-saved.png';
import mmPrivateMode from '~/assets/mm-private-mode.png';
import mmTimeClaim from '~/assets/mm-time-claim.png';
import mmHomeFeatured from '~/assets/mm-home-featured.gif';
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
import { baseMeta } from '~/utils/meta';
import { media } from '~/utils/style';

const title = 'Mera Monitor — Employee Productivity Platform';
const description =
  'Lead front-end development for a flagship SaaS product with 3,500+ active users. Built a comprehensive employee monitoring and productivity platform using React.js, TypeScript, Redux, and SCSS with real-time data streaming.';
const roles = [
  'Lead Frontend Development',
  'React.js & TypeScript',
  'Redux State Management',
  'SSO Authentication (MSAL/OAuth)',
  'Real-time Features (SignalR)',
];

export const meta = () => {
  return baseMeta({ title, description, prefix: 'Projects' });
};

export const MeraMonitor = () => {
  return (
    <>
      <ProjectContainer>
        <ProjectBackground
          opacity={0.5}
          src={backgroundSpr}
          srcSet={`${backgroundSpr} 1080w, ${backgroundSprLarge} 2160w`}
          placeholder={backgroundSprPlaceholder}
        />
        <ProjectHeader
          title={title}
          description={description}
          url="https://meramonitor.com"
          roles={roles}
        />
        <ProjectSection padding="top">
          <ProjectSectionContent>
            <ProjectImage
              raised
              srcSet={`${mmHomeFeatured} 1280w`}
              width={1280}
              height={800}
              placeholder={mmHomeFeatured}
              sizes={`(max-width: ${media.mobile}px) 100vw, (max-width: ${media.tablet}px) 800px, 1000px`}
              alt="Mera Monitor dashboard showing employee productivity analytics and real-time monitoring."
            />
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection>
          <ProjectTextRow>
            <ProjectSectionHeading>The Challenge</ProjectSectionHeading>
            <ProjectSectionText>
              Mera Monitor needed a complete frontend overhaul to support 3,500+ active
              users with real-time employee productivity tracking. The existing system
              lacked performance optimization, proper state management, and secure
              authentication. The goals were to build a scalable React.js application
              with lazy loading, code splitting, Redux for complex state flows, and
              enterprise-grade SSO via Microsoft MSAL and Google OAuth.
            </ProjectSectionText>
          </ProjectTextRow>
        </ProjectSection>
        <ProjectSection light>
          <ProjectSectionContent>
            <Image
              srcSet={`${mmAnalyticsDashboard} 1024w`}
              width={1024}
              height={800}
              placeholder={mmAnalyticsDashboard}
              alt="Mera Monitor analytics dashboard with real-time productivity metrics and team performance data"
              sizes="100vw"
            />
            <ProjectTextRow>
              <ProjectSectionHeading>Analytics Dashboard</ProjectSectionHeading>
              <ProjectSectionText>
                Built a comprehensive analytics dashboard with interactive charts powered
                by ApexCharts, displaying real-time productivity metrics, screen time
                tracking, application usage statistics, and team performance insights.
                The dashboard supports multiple data views and custom date ranges for
                enterprise reporting.
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection>
          <ProjectSectionContent>
            <ProjectImage
              raised
              srcSet={`${mmScreenMonitoring} 1280w`}
              width={1280}
              height={800}
              placeholder={mmScreenMonitoring}
              alt="Mera Monitor screen monitoring showing live employee activity tracking"
              sizes="100vw"
            />
            <ProjectTextRow>
              <ProjectSectionHeading>Screen Monitoring & Activity Tracking</ProjectSectionHeading>
              <ProjectSectionText>
                Implemented real-time screen monitoring with periodic screenshot capture
                and activity tracking. Built an intuitive interface for managers to view
                live employee screens, track application usage, and monitor productivity
                levels. The system handles concurrent streams from 3,500+ active users
                with optimized WebSocket connections via SignalR.
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection>
          <ProjectSectionContent>
            <ProjectImage
              raised
              srcSet={`${mmProductivity} 1280w`}
              width={1280}
              height={800}
              placeholder={mmProductivity}
              alt="Mera Monitor productivity and unproductivity tracking interface"
              sizes="100vw"
            />
            <ProjectTextRow>
              <ProjectSectionHeading>Productivity & Unproductivity Classification</ProjectSectionHeading>
              <ProjectSectionText>
                Developed an intelligent productivity classification system that categorizes
                employee activities as productive or unproductive based on application
                usage, time spent, and custom rules. Built Redux-powered state management
                for complex async workflows with Thunk and Saga middleware.
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection light>
          <ProjectSectionContent>
            <Image
              srcSet={`${mmWebApps} 1024w`}
              width={1024}
              height={800}
              placeholder={mmWebApps}
              alt="Mera Monitor web applications monitoring dashboard"
              sizes="100vw"
            />
            <ProjectTextRow>
              <ProjectSectionHeading>Web Applications & URL Tracking</ProjectSectionHeading>
              <ProjectSectionText>
                Built comprehensive web application monitoring that tracks visited URLs,
                time spent on each site, and categorizes websites by productivity level.
                Implemented with React.js, TypeScript for type safety, and SCSS modules
                for scoped styling with Webpack for optimized builds.
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection>
          <ProjectTextRow>
            <ProjectSectionHeading>Authentication & Security</ProjectSectionHeading>
            <ProjectSectionText>
              Implemented Microsoft MSAL and Google OAuth for enterprise SSO
              authentication, supporting multi-tenant access. Built JWT-based
              session management with secure token refresh flows, ensuring
              data protection for 3,500+ daily active users.
            </ProjectSectionText>
          </ProjectTextRow>
        </ProjectSection>
        <ProjectSection>
          <ProjectSectionContent>
            <ProjectImage
              raised
              srcSet={`${mmAttendance} 1280w`}
              width={1280}
              height={800}
              placeholder={mmAttendance}
              alt="Mera Monitor attendance tracking and time management interface"
              sizes={`(max-width: ${media.mobile}px) 100vw, 80vw`}
            />
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection>
          <ProjectSectionContent>
            <ProjectImage
              raised
              srcSet={`${mmPrivateMode} 1280w`}
              width={1280}
              height={800}
              placeholder={mmPrivateMode}
              alt="Mera Monitor private mode and time claim management"
              sizes={`(max-width: ${media.mobile}px) 100vw, 80vw`}
            />
            <ProjectTextRow>
              <ProjectSectionHeading>Private Mode & Time Claims</ProjectSectionHeading>
              <ProjectSectionText>
                Developed privacy-aware monitoring features including private mode toggles
                and time claim management. Employees can request breaks or mark specific
                time periods with custom reasons, while admins get full visibility into
                attendance patterns and work-hour tracking.
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection>
          <ProjectSectionColumns width="full">
            <ProjectSectionContent width="full">
              <ProjectTextRow width="s">
                <ProjectSectionHeading>Real-time Features</ProjectSectionHeading>
                <ProjectSectionText>
                  Integrated SignalR and WebSockets for real-time employee activity
                  monitoring. Built live dashboards with ApexCharts for data
                  visualization, showing productivity metrics, screen time, and
                  application usage in real-time across the entire platform.
                </ProjectSectionText>
              </ProjectTextRow>
            </ProjectSectionContent>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', maxWidth: '600px' }}>
              <Image
                raised
                srcSet={`${mmEfficiency} 400w`}
                width={400}
                height={300}
                placeholder={mmEfficiency}
                alt="Increased efficiency metrics from Mera Monitor"
                sizes={`(max-width: ${media.mobile}px) 50vw, 25vw`}
              />
              <Image
                raised
                srcSet={`${mmVisibility} 400w`}
                width={400}
                height={300}
                placeholder={mmVisibility}
                alt="More visibility in team operations"
                sizes={`(max-width: ${media.mobile}px) 50vw, 25vw`}
              />
            </div>
          </ProjectSectionColumns>
        </ProjectSection>
        <ProjectSection>
          <ProjectSectionColumns>
            <ProjectSectionContent>
              <ProjectTextRow>
                <ProjectSectionHeading>
                  Scalable Frontend Architecture
                </ProjectSectionHeading>
                <ProjectSectionText>
                  Designed a modular architecture with React Query for server-state
                  caching, Formik for complex forms, and React Table for data-heavy
                  views. The system supports internationalization via React Intl and
                  handles complex role-based access control across the application.
                  Optimized performance through lazy loading, code splitting, and
                  virtualization for large data grids.
                </ProjectSectionText>
              </ProjectTextRow>
            </ProjectSectionContent>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Image
                raised
                srcSet={`${mmTimeClaim} 400w`}
                width={400}
                height={600}
                placeholder={mmTimeClaim}
                alt="Time claim management interface"
                sizes={`(max-width: ${media.mobile}px) 50vw, 25vw`}
              />
              <Image
                raised
                srcSet={`${mmHoursSaved} 400w`}
                width={400}
                height={600}
                placeholder={mmHoursSaved}
                alt="Hours saved per week through productivity insights"
                sizes={`(max-width: ${media.mobile}px) 50vw, 25vw`}
              />
            </div>
          </ProjectSectionColumns>
        </ProjectSection>
        <ProjectSection>
          <ProjectSectionContent>
            <ProjectTextRow center centerMobile noMargin>
              <ProjectSectionHeading>Project Outcomes</ProjectSectionHeading>
              <ProjectSectionText>
                Mera Monitor has grown to serve 3,500+ daily active users across
                multiple enterprise clients. The platform successfully reduced
                page load times by 40% through performance optimizations, achieved
                99.9% uptime with robust error handling, and streamlined team
                productivity tracking for organizations worldwide. Visit{' '}
                <Link href="https://meramonitor.com">meramonitor.com</Link>{' '}
                to learn more.
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection light>
          <ProjectSectionContent>
            <ProjectImage
              raised
              srcSet={`${mmTeamSupport} 1280w`}
              width={1280}
              height={800}
              placeholder={mmTeamSupport}
              alt="Mera Monitor team support and enterprise deployment"
              sizes="100vw"
            />
          </ProjectSectionContent>
        </ProjectSection>
      </ProjectContainer>
      <Footer />
    </>
  );
};