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
import { projectMeta } from '~/utils/meta';
import { getProject } from '~/data/projects';

const { title, description, roles, liveUrl, repoUrl, access, stack, hue } =
  getProject('kundli-predict');

export const meta = () => projectMeta(getProject('kundli-predict'));

export const KundliPredict = () => {
  return (
    <>
      <ProjectContainer>
        <ProjectAtmosphere hue={hue} />
        <ProjectHeader
          slug="kundli-predict"
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
                Most kundli sites are a black box: birth details go to a server and a
                chart and a paragraph of predictions come back, with no way to check
                either. I wanted the two halves separated. The astronomy and the
                classical rules are deterministic, so they run in the browser where
                they can be tested against reference values. Interpretation is where a
                language model is genuinely good, so Gemini reads the complete computed
                chart — and only that part is generated.
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
                  title: 'Hindu calendar',
                  detail:
                    'A panchang month grid with an astronomically drawn moon per day, tithi at local sunrise, festivals, and a personal calendar coloured by each chart’s Tarabala and Chandra Bala.',
                },
                {
                  title: 'Precision timing',
                  detail:
                    'The classical five-step funnel for a goal: birth-time tolerance, whether the chart promises it, which dashas can deliver it, transit windows, then exact muhurta days.',
                },
              ]}
            />
          </ProjectSectionContent>
        </ProjectSection>

        <ProjectSection>
          <ProjectSectionContent>
            <ProjectTextRow>
              <ProjectSectionHeading>Exact maths locally, readings from AI</ProjectSectionHeading>
              <ProjectSectionText>
                Nothing is fetched to produce a chart: the ephemeris maths runs locally,
                a 36,000-city database ships with the app so birth places resolve to
                coordinates and timezones without a lookup, and profiles persist in
                IndexedDB through Dexie. With the network off, charts, dashas, transits
                and the calendar all still work.
              </ProjectSectionText>
              <ProjectSectionText>
                Answers to questions and period predictions are written by Gemini from
                the full computed chart — dashas, divisional charts, transits and
                ashtakavarga together — rather than from a sun or moon sign. The Rashi
                deep-dive shows the difference directly: the model gives the general
                forecast for a moon sign, then checks each point against this specific
                chart and marks it as applying, modified or not applying, naming the
                placement that decides it.
              </ProjectSectionText>
            </ProjectTextRow>
            <ArchitectureDiagram
              caption="Chart computation and storage run in the browser; only sign-in and AI readings need the network."
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
                  name: 'Online',
                  nodes: [
                    { id: 'auth', label: 'Auth.js v5', detail: 'owner-only sign-in' },
                    { id: 'llm', label: 'Google Gemini', detail: 'reads the whole chart' },
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
            <ProjectTextRow>
              <ProjectSectionHeading>When a retired model looks like a bad key</ProjectSectionHeading>
              <ProjectSectionText>
                One day every reading failed with &ldquo;AI is unavailable (offline or
                no API key)&rdquo;. The key was fine. Google had retired the model for
                newly created keys — older keys were still grandfathered onto it — so a
                routine key rotation took the whole AI path down, and the API&rsquo;s
                404 fell into an error branch that treated every non-rate-limit failure
                as &ldquo;no AI configured&rdquo;. The fix was moving to the current model,
                verified against the live API with the same request shape. The lesson
                was the error handling: a message that names the wrong cause costs more
                time than the fault itself.
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>

        <ProjectSection light>
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
