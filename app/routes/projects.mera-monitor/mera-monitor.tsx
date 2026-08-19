import mmAnalyticsDashboardPlaceholder from '~/assets/mm-analytics-dashboard-placeholder.jpg';
import mmHomeFeaturedPlaceholder from '~/assets/mm-home-featured-placeholder.jpg';
import mmScreenMonitoringPlaceholder from '~/assets/mm-screen-monitoring-placeholder.jpg';
import mmProductivityPlaceholder from '~/assets/mm-productivity-placeholder.jpg';
import mmWebAppsPlaceholder from '~/assets/mm-web-apps-placeholder.jpg';
import mmAttendancePlaceholder from '~/assets/mm-attendance-placeholder.jpg';
import mmPrivateModePlaceholder from '~/assets/mm-private-mode-placeholder.jpg';
import mmEfficiencyPlaceholder from '~/assets/mm-efficiency-placeholder.jpg';
import mmVisibilityPlaceholder from '~/assets/mm-visibility-placeholder.jpg';
import mmTimeClaimPlaceholder from '~/assets/mm-time-claim-placeholder.jpg';
import mmHoursSavedPlaceholder from '~/assets/mm-hours-saved-placeholder.jpg';
import mmTeamSupportPlaceholder from '~/assets/mm-team-support-placeholder.jpg';
import mmAnalyticsDashboard from '~/assets/mm-analytics-dashboard.webp';
import mmScreenMonitoring from '~/assets/mm-screen-monitoring.webp';
import mmProductivity from '~/assets/mm-productivity.webp';
import mmWebApps from '~/assets/mm-web-apps.webp';
import mmAttendance from '~/assets/mm-attendance.webp';
import mmTeamSupport from '~/assets/mm-team-support.webp';
import mmEfficiency from '~/assets/mm-efficiency.webp';
import mmVisibility from '~/assets/mm-visibility.webp';
import mmHoursSaved from '~/assets/mm-hours-saved.webp';
import mmPrivateMode from '~/assets/mm-private-mode.webp';
import mmTimeClaim from '~/assets/mm-time-claim.webp';
import mmHomeFeatured from '~/assets/mm-home-featured.webp';
import { Footer } from '~/components/footer';
import { Image } from '~/components/image';
import { Link } from '~/components/link';
import {
  ProjectContainer,
  ProjectHeader,
  ProjectImage,
  ProjectSection,
  ProjectSectionColumns,
  ProjectSectionContent,
  ProjectSectionHeading,
  ProjectSectionText,
  ProjectTextRow,
  ProjectAtmosphere,
} from '~/layouts/project';
import { baseMeta, OG_IMAGE_SIZE } from '~/utils/meta';
import config from '~/config.json';
import { media } from '~/utils/style';
import { getProject, projectOgImage, projectPath } from '~/data/projects';
import { ArchitectureDiagram } from '~/components/architecture-diagram';
import styles from './mera-monitor.module.css';
import { metrics } from '~/data/experience';

const { title, description, roles, liveUrl, stack, hue } = getProject('mera-monitor');

export const meta = () => {
  return baseMeta({
    title,
    description,
    prefix: 'Projects',
    path: projectPath('mera-monitor'),
    ogImage: new URL(projectOgImage('mera-monitor'), config.url).href,
    ogImageAlt: `${title} — case study`,
    ogImageSize: OG_IMAGE_SIZE,
    ogType: 'article',
  });
};

export const MeraMonitor = () => {
  return (
    <>
      <ProjectContainer>
        <ProjectAtmosphere hue={hue} />
        <ProjectHeader
          title={title}
          description={description}
          url={liveUrl}
          roles={roles}
          stack={stack}
          hue={hue}
        />
        <ProjectSection padding="top">
          <ProjectSectionContent>
            <ProjectImage
              raised
              srcSet={`${mmHomeFeatured} 1280w`}
              width={1280}
              height={800}
              placeholder={mmHomeFeaturedPlaceholder}
              sizes={`(max-width: ${media.mobile}px) 100vw, (max-width: ${media.tablet}px) 800px, 1000px`}
              alt="Mera Monitor dashboard showing employee productivity analytics and real-time monitoring."
            />
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection>
          <ProjectTextRow>
            <ProjectSectionHeading>The Challenge</ProjectSectionHeading>
            <ProjectSectionText>
              Mera Monitor needed a complete frontend overhaul to support 10,500+ active
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
              placeholder={mmAnalyticsDashboardPlaceholder}
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
              placeholder={mmScreenMonitoringPlaceholder}
              alt="Mera Monitor screen monitoring showing live employee activity tracking"
              sizes="100vw"
            />
            <ProjectTextRow>
              <ProjectSectionHeading>Screen Monitoring & Activity Tracking</ProjectSectionHeading>
              <ProjectSectionText>
                Implemented real-time screen monitoring with periodic screenshot capture
                and activity tracking. Built an intuitive interface for managers to view
                live employee screens, track application usage, and monitor productivity
                levels. The system handles concurrent streams from 10,500+ active users
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
              placeholder={mmProductivityPlaceholder}
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
              placeholder={mmWebAppsPlaceholder}
              alt="Mera Monitor web applications monitoring dashboard"
              sizes="100vw"
            />
            <ProjectTextRow>
              <ProjectSectionHeading>Web Applications & URL Tracking</ProjectSectionHeading>
              <ProjectSectionText>
                Built comprehensive web application monitoring that tracks visited URLs,
                time spent on each site, and categorizes websites by productivity level.
                Implemented with React.js and SCSS modules
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
              data protection for 10,500+ active users.
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
              placeholder={mmAttendancePlaceholder}
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
              placeholder={mmPrivateModePlaceholder}
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
            <div className={styles.imagePair} data-narrow="true">
              <Image
                raised
                srcSet={`${mmEfficiency} 400w`}
                width={400}
                height={300}
                placeholder={mmEfficiencyPlaceholder}
                alt="Increased efficiency metrics from Mera Monitor"
                sizes={`(max-width: ${media.mobile}px) 50vw, 25vw`}
              />
              <Image
                raised
                srcSet={`${mmVisibility} 400w`}
                width={400}
                height={300}
                placeholder={mmVisibilityPlaceholder}
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
            <div className={styles.imagePair}>
              <Image
                raised
                srcSet={`${mmTimeClaim} 400w`}
                width={400}
                height={600}
                placeholder={mmTimeClaimPlaceholder}
                alt="Time claim management interface"
                sizes={`(max-width: ${media.mobile}px) 50vw, 25vw`}
              />
              <Image
                raised
                srcSet={`${mmHoursSaved} 400w`}
                width={400}
                height={600}
                placeholder={mmHoursSavedPlaceholder}
                alt="Hours saved per week through productivity insights"
                sizes={`(max-width: ${media.mobile}px) 50vw, 25vw`}
              />
            </div>
          </ProjectSectionColumns>
        </ProjectSection>
        <ProjectSection>
          <ProjectSectionContent>
            <ProjectTextRow>
              <ProjectSectionHeading>How the pieces fit together</ProjectSectionHeading>
              <ProjectSectionText>
                Four concerns, deliberately kept separate: what the user sees,
                where state lives, how data arrives, and who the user is. Server
                state sits in React Query rather than Redux, so cache
                invalidation and refetching are not hand-rolled; Redux holds only
                the client state that genuinely spans routes. Live monitoring
                arrives over SignalR rather than polling, because the dashboard
                shows activity as it happens.
              </ProjectSectionText>
            </ProjectTextRow>
            <ArchitectureDiagram
              caption="Frontend architecture: interface, state, transport and identity layers."
              layers={[
                {
                  name: 'Interface',
                  nodes: [
                    { id: 'react', label: 'React.js', detail: 'views' },
                    { id: 'apexcharts', label: 'ApexCharts', detail: 'metrics' },
                    { id: 'react-table', label: 'React Table', detail: 'data grids' },
                    { id: 'formik', label: 'Formik', detail: 'forms' },
                    { id: 'scss', label: 'SCSS modules', detail: 'styling' },
                  ],
                },
                {
                  name: 'State',
                  nodes: [
                    { id: 'redux', label: 'Redux', detail: 'Thunk + Saga' },
                    { id: 'react-query', label: 'React Query', detail: 'server cache' },
                  ],
                },
                {
                  name: 'Transport',
                  nodes: [
                    { id: 'rest', label: 'REST', detail: 'reads and writes' },
                    { id: 'signalr', label: 'SignalR', detail: 'live activity' },
                  ],
                },
                {
                  name: 'Identity',
                  nodes: [
                    { id: 'msal', label: 'Microsoft MSAL', detail: 'enterprise SSO' },
                    { id: 'google', label: 'Google OAuth', detail: 'SSO' },
                    { id: 'jwt', label: 'JWT', detail: 'session' },
                  ],
                },
              ]}
            />
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection>
          <ProjectSectionContent>
            <ProjectTextRow center centerMobile noMargin>
              <ProjectSectionHeading>Project Outcomes</ProjectSectionHeading>
              <ProjectSectionText>
                Mera Monitor now serves {metrics.activeUsers.value} active users
                across multiple enterprise clients. Lazy loading, route-level code
                splitting and bundle trimming cut initial load time by{' '}
                {metrics.loadTimeReduction.value} —{' '}
                {metrics.loadTimeReduction.method}. Visit{' '}
                <Link href={liveUrl}>meramonitor.com</Link> to learn more.
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
              placeholder={mmTeamSupportPlaceholder}
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