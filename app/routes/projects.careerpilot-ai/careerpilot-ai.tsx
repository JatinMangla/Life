import cpApp from '~/assets/cp-app.webp';
import cpAppPlaceholder from '~/assets/cp-app-placeholder.jpg';
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
  getProject('careerpilot-ai');

export const meta = () => projectMeta(getProject('careerpilot-ai'));

export const CareerPilotAi = () => {
  return (
    <>
      <ProjectContainer>
        <ProjectAtmosphere hue={hue} />
        <ProjectHeader
          slug="careerpilot-ai"
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
              srcSet={`${cpApp} 1200w`}
              width={1200}
              height={1000}
              placeholder={cpAppPlaceholder}
              sizes="(max-width: 696px) 100vw, 900px"
              alt="CareerPilot AI sign-in screen, offering a six-digit login code by email with a password fallback."
            />
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
                  title: 'Job search',
                  detail:
                    'Reads 121 companies’ own applicant-tracking boards in parallel — over 15,000 live postings — plus aggregators, then scores each match against your profile on an anchored 0–100 scale.',
                },
                {
                  title: 'Application prep',
                  detail:
                    'Drafts tailored resume bullets, a cover letter and screening answers per posting, then opens each application in its own tab for you to check and submit.',
                },
                {
                  title: 'Inbox triage',
                  detail:
                    'Syncs a Gmail inbox over IMAP, sorts job-related mail from the rest, and drafts replies to recruiters.',
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
              <ProjectSectionText>
                It runs on Gemini&rsquo;s free tier — 250 calls a day — and that
                shapes the design. Answers that are genuinely the same for the same
                input, like classifying mail or scoring an unchanged resume, are cached
                in Redis with a lifetime per task; anything the user re-runs wanting
                something new is never cached. Batch work runs three calls at a time,
                because the client steps down to weaker models on a rate limit, so a
                bigger burst would not fail loudly — it would quietly return worse
                answers. Identical requests already in flight share one call, so a
                double-click costs nothing.
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
              <ProjectSectionHeading>The bug that lost 45 emails in 250</ProjectSectionHeading>
              <ProjectSectionText>
                Mail was arriving in Gmail and never showing up in the app. The sync
                cursor was a date, but pages came back in IMAP UID order, and the
                cursor advanced to the newest message on each page. Those two orders
                diverge in any real mailbox — forwarded threads, senders in other
                timezones, mail held in a queue — and every divergence was a permanent
                hole. Simulated against 250 messages with realistic date jitter, the old
                sync delivered 205.
              </ProjectSectionText>
              <ProjectSectionText>
                The cursor is now the UID itself, which only ever increases within a
                mailbox, and it carries the mailbox&rsquo;s UID validity so a rebuilt
                mailbox triggers one clean rescan instead of resuming from numbers that
                no longer mean anything. Each page is stored before the cursor moves, so
                an interrupted sync costs a repeat rather than a gap. The same pass
                fixed four smaller bugs on that path, including a re-sync that
                resurrected mail already dealt with.
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>

        <ProjectSection>
          <ProjectSectionContent>
            <ProjectTextRow>
              <ProjectSectionHeading>Two deliberate limits</ProjectSectionHeading>
              <ProjectSectionText>
                The last click stays human. An earlier version could submit
                applications on its own; I removed that path entirely. A sent
                application can&rsquo;t be recalled, so one mis-parsed form field would
                be permanent, and automated submission breaks the terms of most job
                boards anyway. The tool now prepares everything, fills the form, and
                stops with the submit button in view. It also labels
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
    </>
  );
};
