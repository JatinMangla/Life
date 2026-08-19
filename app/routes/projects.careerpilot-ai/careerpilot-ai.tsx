import { Footer } from '~/components/footer';
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
} from '~/layouts/project';
import { baseMeta, OG_IMAGE_SIZE } from '~/utils/meta';
import { getProject, projectOgImage, projectPath } from '~/data/projects';
import config from '~/config.json';

const { title, description, roles, liveUrl, repoUrl, access, stack, hue } =
  getProject('careerpilot-ai');

export const meta = () => {
  return baseMeta({
    title,
    description,
    prefix: 'Projects',
    path: projectPath('careerpilot-ai'),
    ogImage: new URL(projectOgImage('careerpilot-ai'), config.url).href,
    ogImageAlt: `${title} — case study`,
    ogImageSize: OG_IMAGE_SIZE,
    ogType: 'article',
  });
};

export const CareerPilotAi = () => {
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
            <ProjectTextRow>
              <ProjectSectionHeading>The idea</ProjectSectionHeading>
              <ProjectSectionText>
                Job hunting is a pile of repetitive, context-heavy work: rewriting the
                same resume for each posting, judging whether a role is worth
                applying to, drafting outreach, then rehearsing answers. Each step
                needs the same background about you, and none of the tools share it.
                CareerPilot is one assistant that holds that context and works across
                all of it.
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>

        <ProjectSection light>
          <ProjectSectionContent>
            <ProjectTextRow>
              <ProjectSectionHeading>What it does</ProjectSectionHeading>
            </ProjectTextRow>
            <FeatureGrid
              hue={hue}
              items={[
                {
                  title: 'Resume review',
                  detail:
                    'Checks a resume against the conventions recruiters actually screen on, and suggests concrete rewrites rather than generic advice.',
                },
                {
                  title: 'Job matching',
                  detail:
                    'Reads a posting against your background and argues both sides — what fits, what does not, and whether it is worth the application.',
                },
                {
                  title: 'Application prep',
                  detail:
                    'Drafts tailored cover letters and per-posting content, ready to review before anything is sent.',
                },
                {
                  title: 'Inbox triage',
                  detail:
                    'Sorts job-related mail out of a busy Gmail inbox and drafts replies to recruiters.',
                },
                {
                  title: 'Mock interviews',
                  detail:
                    'Practice in text, voice or video, with follow-up questions that react to the answer you actually gave.',
                },
                {
                  title: 'Adaptive strategy',
                  detail:
                    'Adjusts its approach from feedback across sessions instead of restarting cold each time.',
                },
              ]}
            />
          </ProjectSectionContent>
        </ProjectSection>

        <ProjectSection>
          <ProjectSectionContent>
            <ProjectTextRow>
              <ProjectSectionHeading>Constraining a language model</ProjectSectionHeading>
              <ProjectSectionText>
                The hard part of building on an LLM is not calling it, it is making
                the output safe to render. Gemini is called with an enforced response
                schema so replies arrive as structured JSON the UI can rely on rather
                than prose to be parsed, and responses stream so long answers appear
                as they are generated instead of after a blank pause.
              </ProjectSectionText>
            </ProjectTextRow>
            <ArchitectureDiagram
              caption="Serverless throughout: no separate backend, with state shared across devices via Redis."
              layers={[
                {
                  name: 'Interface',
                  nodes: [
                    { id: 'next', label: 'Next.js 14', detail: 'App Router' },
                    { id: 'tailwind', label: 'Tailwind CSS', detail: 'styling' },
                    { id: 'stream', label: 'Streaming UI', detail: 'incremental answers' },
                  ],
                },
                {
                  name: 'API',
                  nodes: [
                    { id: 'routes', label: 'Route handlers', detail: 'Vercel functions' },
                    { id: 'middleware', label: 'middleware.ts', detail: 'auth gate' },
                  ],
                },
                {
                  name: 'Intelligence',
                  nodes: [
                    { id: 'gemini', label: 'Google Gemini', detail: 'schema-enforced JSON' },
                    { id: 'agent', label: 'Agent layer', detail: 'task orchestration' },
                  ],
                },
                {
                  name: 'State',
                  nodes: [
                    { id: 'redis', label: 'Upstash Redis', detail: 'cross-device sync' },
                    { id: 'cookie', label: 'HMAC cookie', detail: 'single-user session' },
                  ],
                },
              ]}
            />
          </ProjectSectionContent>
        </ProjectSection>

        <ProjectSection light>
          <ProjectSectionContent>
            <ProjectTextRow>
              <ProjectSectionHeading>Two deliberate limits</ProjectSectionHeading>
              <ProjectSectionText>
                It never submits an application. Automated submission breaks the terms
                of every job board worth applying through, so the tool prepares
                everything and stops at the point a human clicks apply. It also labels
                where a listing came from — live results via Adzuna are marked
                separately from openings the model surfaced — because a role an LLM
                recalled is not the same claim as a role that exists in a feed today.
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>

        <ProjectSection>
          <ProjectSectionContent>
            <ProjectTextRow center centerMobile noMargin>
              <ProjectSectionHeading>Where it stands</ProjectSectionHeading>
              <ProjectSectionText>
                Running on Vercel and in daily use by exactly one person, which is who
                it was built for. Auth is a single HMAC-signed cookie, so the live
                link shows the sign-in screen — the{' '}
                <Link href={repoUrl}>source is on GitHub</Link>.
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
      </ProjectContainer>
      <Footer />
    </>
  );
};
