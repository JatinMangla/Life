import mmAnalyticsDashboardPlaceholder from '~/assets/mm-analytics-dashboard-placeholder.jpg';
import mmProductivityPlaceholder from '~/assets/mm-productivity-placeholder.jpg';
import mmWebAppsPlaceholder from '~/assets/mm-web-apps-placeholder.jpg';
import mmAttendancePlaceholder from '~/assets/mm-attendance-placeholder.jpg';
import mmPrivateModePlaceholder from '~/assets/mm-private-mode-placeholder.jpg';
import mmTimeClaimPlaceholder from '~/assets/mm-time-claim-placeholder.jpg';
import mmAnalyticsDashboard from '~/assets/mm-analytics-dashboard.webp';
import mmProductivity from '~/assets/mm-productivity.webp';
import mmWebApps from '~/assets/mm-web-apps.webp';
import mmAttendance from '~/assets/mm-attendance.webp';
import mmPrivateMode from '~/assets/mm-private-mode.webp';
import mmTimeClaim from '~/assets/mm-time-claim.webp';
import { Image } from '~/components/image';
import { Link } from '~/components/link';
import {
  ProjectContainer,
  ProjectHeader,
  ProjectImage,
  ProjectSection,
  ProjectSectionContent,
  ProjectSectionHeading,
  ProjectSectionText,
  ProjectTextRow,
  ProjectAtmosphere,
} from '~/layouts/project';
import { projectMeta } from '~/utils/meta';
import { media } from '~/utils/style';
import { getProject } from '~/data/projects';
import { ArchitectureDiagram } from '~/components/architecture-diagram';
import { employer, metrics } from '~/data/experience';
import styles from './mera-monitor.module.css';

const project = getProject('mera-monitor');
const { title, description, roles, liveUrl, stack, hue } = project;

/**
 * Every screenshot on this page is the product's own demo organisation
 * ("Kevin", round member counts), exported at 856x583. Declared sizes must
 * match the files — see app/assets/assets.test.ts.
 */
const SCREENSHOT = { width: 856, height: 583 } as const;

export const meta = () => projectMeta(project);

export const MeraMonitor = () => {
  return (
    <>
      <ProjectContainer>
        <ProjectAtmosphere hue={hue} />
        <ProjectHeader
          slug="mera-monitor"
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
              priority
              srcSet={`${mmAnalyticsDashboard} ${SCREENSHOT.width}w`}
              {...SCREENSHOT}
              placeholder={mmAnalyticsDashboardPlaceholder}
              sizes={`(max-width: ${media.mobile}px) 100vw, (max-width: ${media.tablet}px) 800px, 1000px`}
              alt="Mera Monitor organisation dashboard: live member counts, active and productive hours, and a productive-versus-unproductive trend chart."
            />
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection>
          <ProjectTextRow>
            <ProjectSectionHeading>My part in it</ProjectSectionHeading>
            <ProjectSectionText>
              Mera Monitor is {employer.name}&rsquo;s workforce-analytics product, used by{' '}
              {metrics.activeUsers.value} people. I work on its web app as a{' '}
              {employer.role.toLowerCase()} in a product team: I build and maintain the
              dashboard, reporting and settings screens in React and Redux, wired up the
              single sign-on flows, and did the load-time work described at the end of
              this page.
            </ProjectSectionText>
            <ProjectSectionText>
              What makes it interesting to build is volume. A manager&rsquo;s view
              aggregates every member&rsquo;s activity across a date range, so most
              screens are data-heavy tables and charts that have to stay responsive
              when an organisation is large.
            </ProjectSectionText>
          </ProjectTextRow>
        </ProjectSection>
        <ProjectSection light>
          <ProjectSectionContent>
            <Image
              srcSet={`${mmWebApps} ${SCREENSHOT.width}w`}
              {...SCREENSHOT}
              placeholder={mmWebAppsPlaceholder}
              alt="Websites and applications report: each member's tracked sites and apps with time spent."
              sizes={`(max-width: ${media.mobile}px) 100vw, 80vw`}
            />
            <ProjectTextRow>
              <ProjectSectionHeading>Reports that stay fast at scale</ProjectSectionHeading>
              <ProjectSectionText>
                The websites-and-applications report lists every tracked site and app per
                member with time spent. Server state lives in React Query, so switching
                between team and individual views or date ranges can reuse cached
                results instead of refetching, and large grids are virtualised rather
                than rendered in full.
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection>
          <ProjectSectionContent>
            <ProjectImage
              raised
              srcSet={`${mmProductivity} ${SCREENSHOT.width}w`}
              {...SCREENSHOT}
              placeholder={mmProductivityPlaceholder}
              alt="Productivity configuration: lists of URLs an organisation marks as productive or unproductive."
              sizes={`(max-width: ${media.mobile}px) 100vw, 80vw`}
            />
            <ProjectTextRow>
              <ProjectSectionHeading>Productivity rules</ProjectSectionHeading>
              <ProjectSectionText>
                Each organisation decides which sites and apps count as productive. The
                configuration screen edits those lists, and every chart on the dashboard
                is classified by them. Forms like this one across the app are built on
                Formik.
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection>
          <ProjectSectionContent>
            <div className={styles.imagePair}>
              <Image
                raised
                srcSet={`${mmAttendance} ${SCREENSHOT.width}w`}
                {...SCREENSHOT}
                placeholder={mmAttendancePlaceholder}
                alt="Attendance report: days present and daily totals per member."
                sizes={`(max-width: ${media.mobile}px) 100vw, 40vw`}
              />
              <Image
                raised
                srcSet={`${mmTimeClaim} ${SCREENSHOT.width}w`}
                {...SCREENSHOT}
                placeholder={mmTimeClaimPlaceholder}
                alt="Time claim screen: a day's activity sessions with their status, ready to be claimed."
                sizes={`(max-width: ${media.mobile}px) 100vw, 40vw`}
              />
            </div>
            <ProjectTextRow>
              <ProjectSectionHeading>Attendance and time claims</ProjectSectionHeading>
              <ProjectSectionText>
                Attendance rolls tracked activity up into per-member attendance. Time
                claims let a member account for time the tracker
                couldn&rsquo;t see — a meeting away from the desk — and send it for
                approval, so the report reflects the working day rather than just
                keyboard activity.
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection light>
          <ProjectSectionContent>
            <Image
              srcSet={`${mmPrivateMode} ${SCREENSHOT.width}w`}
              {...SCREENSHOT}
              placeholder={mmPrivateModePlaceholder}
              alt="The desktop tracker's session panel with a private-mode toggle."
              sizes={`(max-width: ${media.mobile}px) 100vw, 80vw`}
            />
            <ProjectTextRow>
              <ProjectSectionHeading>Private mode</ProjectSectionHeading>
              <ProjectSectionText>
                Monitoring software is only acceptable if people can see and control it.
                Private mode pauses capture for personal time, and the session panel
                shows the current and recent sessions.
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection>
          <ProjectTextRow>
            <ProjectSectionHeading>Sign-in</ProjectSectionHeading>
            <ProjectSectionText>
              Organisations sign in with the identity provider they already use:
              Microsoft accounts through MSAL and Google accounts through OAuth. I
              integrated both single sign-on flows into the web app.
            </ProjectSectionText>
          </ProjectTextRow>
        </ProjectSection>
        <ProjectSection>
          <ProjectSectionContent>
            <ProjectTextRow>
              <ProjectSectionHeading>How the pieces fit together</ProjectSectionHeading>
              <ProjectSectionText>
                Four concerns, deliberately kept separate: what the user sees, where state
                lives, how data arrives, and who the user is. Server state sits in React
                Query rather than Redux, so cache invalidation and refetching are not
                hand-rolled; Redux holds only the client state that genuinely spans
                routes. Live activity arrives over SignalR rather than polling.
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
                  ],
                },
              ]}
            />
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection>
          <ProjectSectionContent>
            <ProjectTextRow center centerMobile noMargin>
              <ProjectSectionHeading>Load time</ProjectSectionHeading>
              <ProjectSectionText>
                Route-level code splitting, lazy-loaded chart libraries and bundle
                trimming cut initial load time by {metrics.loadTimeReduction.value} (
                {metrics.loadTimeReduction.method}). The product is live at{' '}
                <Link href={liveUrl}>meramonitor.com</Link>.
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
      </ProjectContainer>
    </>
  );
};
