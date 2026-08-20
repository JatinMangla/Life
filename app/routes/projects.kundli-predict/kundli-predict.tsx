import kpApp from '~/assets/kp-app.webp';
import kpAppPlaceholder from '~/assets/kp-app-placeholder.jpg';
import { Link } from '~/components/link';
import { ArchitectureDiagram } from '~/components/architecture-diagram';
import { FeatureGrid } from '~/components/feature-grid';
import {
  ProjectAtmosphere,
  ProjectContainer,
  ProjectHeader,
  ProjectSection,
  ProjectSectionContent,
  ProjectSectionHeading,
  ProjectSectionText,
  ProjectTextRow,
  ProjectImage,
} from '~/layouts/project';
import { baseMeta, OG_IMAGE_SIZE } from '~/utils/meta';
import { getProject, projectOgImage, projectPath } from '~/data/projects';
import config from '~/config.json';

const { title, description, roles, liveUrl, repoUrl, access, stack, hue } =
  getProject('kundli-predict');

export const meta = () => {
  return baseMeta({
    title,
    description,
    prefix: 'Projects',
    path: projectPath('kundli-predict'),
    ogImage: new URL(projectOgImage('kundli-predict'), config.url).href,
    ogImageAlt: `${title} — case study`,
    ogImageSize: OG_IMAGE_SIZE,
    ogType: 'article',
  });
};

export const KundliPredict = () => {
  return (
    <>
      <ProjectContainer>
        <ProjectAtmosphere hue={hue} />
        <ProjectHeader
          title={title}
          description={description}
          url={liveUrl}
          linkLabel="Open the app"
          roles={roles}
          stack={stack}
          hue={hue}
          repoUrl={repoUrl}
          note={access}
        />

        <ProjectSection padding="top">
          <ProjectSectionContent>
            <ProjectImage
              raised
              srcSet={`${kpApp} 1200w`}
              width={1200}
              height={1000}
              placeholder={kpAppPlaceholder}
              sizes="(max-width: 696px) 100vw, 900px"
              alt="Kundli Predict sign-in screen, showing the bilingual English and Hindi subtitle and the owner-only Google sign-in."
            />
            <ProjectTextRow>
              <ProjectSectionHeading>The idea</ProjectSectionHeading>
              <ProjectSectionText>
                Almost every kundli site sends your birth details to a server and
                returns a chart. That is a privacy problem for unusually personal
                data, and it makes the app useless without a connection. I wanted the
                opposite: a full Vedic astrology engine that runs in the browser, so
                nothing about a birth chart ever leaves the device.
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>

        <ProjectSection light>
          <ProjectSectionContent>
            <ProjectTextRow>
              <ProjectSectionHeading>What it computes</ProjectSectionHeading>
              <ProjectSectionText>
                Everything is derived from first principles rather than fetched.
                Sidereal positions come from{' '}
                <Link href="https://github.com/cosinekitty/astronomy">
                  astronomy-engine
                </Link>{' '}
                with the Lahiri ayanamsa applied; the rest is rule evaluation on top
                of those positions.
              </ProjectSectionText>
            </ProjectTextRow>
            <FeatureGrid
              hue={hue}
              items={[
                {
                  title: 'Charts',
                  detail:
                    'Divisional charts from D1 to D60 in both North and South Indian styles, with nakshatra placement and planetary dignity.',
                },
                {
                  title: 'Dashas',
                  detail:
                    'Vimshottari timelines down to Pratyantar level, expandable through Maha and Antar periods.',
                },
                {
                  title: 'Yogas and doshas',
                  detail:
                    'Over 30 combinations, including Gajakesari, Panch Mahapurusha, Kaal Sarp and Sade Sati.',
                },
                {
                  title: 'Ashtakavarga',
                  detail:
                    'Bindu tables used to score current transits against the natal chart.',
                },
                {
                  title: 'Panchang',
                  detail:
                    'Tithi, vara, nakshatra, yoga and karana resolved for any given moment.',
                },
                {
                  title: 'Question engine',
                  detail:
                    'Answers on career, marriage, wealth, health and more, derived from the chart itself and returned with a confidence score.',
                },
              ]}
            />
          </ProjectSectionContent>
        </ProjectSection>

        <ProjectSection>
          <ProjectSectionContent>
            <ProjectTextRow>
              <ProjectSectionHeading>
                Offline-first, not merely offline-capable
              </ProjectSectionHeading>
              <ProjectSectionText>
                The distinction matters. Nothing is fetched in order to produce a
                chart: the ephemeris maths runs locally, a 36,000-city database ships
                with the app so birth places resolve to coordinates and timezones
                without a lookup, and results persist in IndexedDB through Dexie.
                Claude and Gemini are wired in as optional fallbacks for phrasing,
                never as a dependency — with the network off, the app still answers.
              </ProjectSectionText>
            </ProjectTextRow>
            <ArchitectureDiagram
              caption="Everything above the storage layer runs in the browser; no server is involved in producing a chart."
              layers={[
                {
                  name: 'Interface',
                  nodes: [
                    { id: 'next', label: 'Next.js 15', detail: 'App Router' },
                    { id: 'tailwind', label: 'Tailwind CSS 4', detail: 'theming' },
                    { id: 'i18n', label: 'Bilingual UI', detail: 'English and Hindi' },
                  ],
                },
                {
                  name: 'Engine',
                  nodes: [
                    {
                      id: 'astro',
                      label: 'astronomy-engine',
                      detail: 'sidereal positions',
                    },
                    { id: 'luxon', label: 'luxon', detail: 'timezone maths' },
                    {
                      id: 'rules',
                      label: 'Rule evaluation',
                      detail: 'yogas, dashas, transits',
                    },
                  ],
                },
                {
                  name: 'Storage',
                  nodes: [
                    { id: 'dexie', label: 'Dexie', detail: 'IndexedDB' },
                    {
                      id: 'cities',
                      label: 'City database',
                      detail: '36,000 entries, bundled',
                    },
                  ],
                },
                {
                  name: 'Optional',
                  nodes: [
                    { id: 'auth', label: 'Auth.js v5', detail: 'owner-only sign-in' },
                    { id: 'llm', label: 'Claude / Gemini', detail: 'phrasing fallback' },
                  ],
                },
              ]}
            />
          </ProjectSectionContent>
        </ProjectSection>

        <ProjectSection light>
          <ProjectSectionContent>
            <ProjectTextRow>
              <ProjectSectionHeading>
                Testing an engine with no obvious oracle
              </ProjectSectionHeading>
              <ProjectSectionText>
                Astronomical code fails quietly. An ayanamsa off by an arc-minute
                still produces a plausible-looking chart, so &ldquo;it renders&rdquo;
                proves nothing. The engine carries 38 Vitest unit tests that check
                computed values against known reference points — sankranti dates,
                planetary positions at fixed instants, and ashtakavarga totals
                verified against classical tables. Those are the tests that catch a
                wrong answer that still looks right.
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>

        <ProjectSection>
          <ProjectSectionContent>
            <ProjectTextRow center centerMobile noMargin>
              <ProjectSectionHeading>Where it stands</ProjectSectionHeading>
              <ProjectSectionText>
                Deployed on Vercel as an installable PWA. Sign-in is restricted to my
                own Google account, so the live link shows the auth screen — the{' '}
                <Link href={repoUrl}>source is on GitHub</Link> if you want to read
                the engine.
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
      </ProjectContainer>
    </>
  );
};
