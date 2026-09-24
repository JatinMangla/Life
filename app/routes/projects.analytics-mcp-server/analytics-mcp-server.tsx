import { ArchitectureDiagram } from '~/components/architecture-diagram';
import { FeatureGrid } from '~/components/feature-grid';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from '~/components/table';
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
import { projectMeta } from '~/utils/meta';
import { getProject } from '~/data/projects';
import styles from './analytics-mcp-server.module.css';

/**
 * Deliberately anonymised: the server fronts a production API holding
 * employee data. No product name, domain, endpoint path or screenshot belongs
 * on this page — only the design.
 */
const project = getProject('analytics-mcp-server');
const { title, description, roles, access, stack, hue } = project;

export const meta = () => projectMeta(project);

const stateKeys = [
  {
    key: 'client:<id>',
    holds: 'Registered OAuth client',
    ttl: 'None — losing it breaks every connector',
  },
  {
    key: 'pending:<txn>',
    holds: 'In-flight authorization request',
    ttl: '10 minutes',
  },
  {
    key: 'code:<code>',
    holds: 'Authorization code',
    ttl: '10 minutes, deleted on use with GETDEL',
  },
  {
    key: 'token:<token>',
    holds: 'Access token and the identity it is bound to',
    ttl: 'Token lifetime',
  },
  {
    key: 'refresh:<token>',
    holds: 'Pointer to its access token',
    ttl: 'Token lifetime + 30 days',
  },
  {
    key: 'roster:<org>:<user>',
    holds: 'Cached member list — a read cache, not auth state',
    ttl: '90 seconds',
  },
] as const;

export const AnalyticsMcpServer = () => {
  return (
    <>
      <ProjectContainer>
        <ProjectAtmosphere hue={hue} />
        <ProjectHeader
          title={title}
          description={description}
          roles={roles}
          stack={stack}
          hue={hue}
          note={access}
        />

        <ProjectSection padding="top">
          <ProjectSectionContent>
            <ProjectTextRow>
              <ProjectSectionHeading>The problem</ProjectSectionHeading>
              <ProjectSectionText>
                A manager&rsquo;s questions about their team — who worked on what
                yesterday, which time claims are pending, what a given afternoon looked
                like — each take several screens of a workforce-analytics dashboard to
                answer. The Model Context Protocol lets Claude call tools directly, so I
                built a remote MCP server that exposes the product&rsquo;s API as twelve
                tools across four areas: identity, time tracking, time claims and
                screenshots.
              </ProjectSectionText>
              <ProjectSectionText>
                The interesting part is not the tools. It is that the data is real
                employee monitoring data, reached by a language model, on behalf of
                whoever signed in — so authorization, blast radius and auditability had
                to be designed first.
              </ProjectSectionText>
            </ProjectTextRow>
            <ArchitectureDiagram
              caption="Claude connects to the MCP endpoint; the server runs its own OAuth 2.1 authorization server, keeps auth state in Redis, and calls the analytics API as the signed-in user."
              layers={[
                {
                  name: 'Client',
                  nodes: [
                    { id: 'claude', label: 'Claude', detail: 'custom connector' },
                  ],
                },
                {
                  name: 'Server',
                  nodes: [
                    { id: 'mcp', label: 'MCP endpoint', detail: 'stateless per request' },
                    { id: 'oauth', label: 'OAuth 2.1 server', detail: 'PKCE, refresh' },
                    { id: 'tools', label: '12 tools', detail: 'with safety rails' },
                  ],
                },
                {
                  name: 'State',
                  nodes: [
                    { id: 'redis', label: 'Upstash Redis', detail: 'TTL per key' },
                  ],
                },
                {
                  name: 'Upstream',
                  nodes: [
                    { id: 'login', label: 'Product login', detail: 'credential check' },
                    { id: 'api', label: 'Analytics API', detail: 'as the signed-in user' },
                  ],
                },
              ]}
            />
          </ProjectSectionContent>
        </ProjectSection>

        <ProjectSection light>
          <ProjectSectionContent>
            <ProjectTextRow>
              <ProjectSectionHeading>Its own authorization server</ProjectSectionHeading>
              <ProjectSectionText>
                Claude&rsquo;s connectors speak OAuth 2.1 with dynamic client
                registration and PKCE; the analytics product speaks username and
                password. The server bridges the two: it implements the OAuth endpoints
                and discovery documents itself, and delegates the one step that matters
                — checking the credentials — to the product&rsquo;s own login. The
                token it issues is bound to that identity, so every tool call runs with
                exactly the permissions the person already has in the product, and no
                more.
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>

        <ProjectSection>
          <ProjectSectionContent>
            <ProjectTextRow>
              <ProjectSectionHeading>Safety rails that are not optional</ProjectSectionHeading>
              <ProjectSectionText>
                A language model will call whatever it is given, as often as seems
                useful. So the limits live in the tools, not in a prompt asking nicely.
              </ProjectSectionText>
            </ProjectTextRow>
            <FeatureGrid
              hue={hue}
              items={[
                {
                  title: 'No fetch-all',
                  detail:
                    'The screenshot tool requires an explicit, non-empty list of paths, caps the batch, and defaults to thumbnails.',
                },
                {
                  title: 'Every access audited',
                  detail:
                    'Each screenshot fetch writes to the product’s own audit log — in parallel with the image request, so the safeguard costs no latency.',
                },
                {
                  title: 'Writes are dry runs',
                  detail:
                    'Submitting a time claim does nothing unless confirm=true is passed, and no tool can approve, reject or delete.',
                },
                {
                  title: 'Refuses unsafe config',
                  detail:
                    'Start-up aborts on unsafe combinations — no durable state on serverless, or production without a fixed public URL — instead of running degraded.',
                },
                {
                  title: 'A cache that can’t leak',
                  detail:
                    'The member list is cached per caller, not per organisation. The API authorises that list by token, so an org-wide key could serve one person’s fuller view to someone who should see less.',
                },
                {
                  title: 'A response budget',
                  detail:
                    'Screenshot batches stop at 3.5 MB and name what was skipped, rather than failing against the platform’s 4.5 MB response limit.',
                },
              ]}
            />
          </ProjectSectionContent>
        </ProjectSection>

        <ProjectSection light>
          <ProjectSectionContent>
            <ProjectTextRow>
              <ProjectSectionHeading>From a process to serverless</ProjectSectionHeading>
              <ProjectSectionText>
                The first build was a long-running Node process holding sessions and
                auth state in five in-memory maps. On Vercel, any request can land on a
                fresh instance, so everything that has to outlive a request moved to
                Redis, each key with the lifetime it actually needs. Each request now
                gets a fresh MCP server and transport, with no session to route back
                to.
              </ProjectSectionText>
            </ProjectTextRow>
            {/* Focusable so keyboard users can scroll it sideways on a phone. */}
            <div
              className={styles.tableWrap}
              role="region"
              aria-label="Redis key layout"
              // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- scrollable region
              tabIndex={0}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeadCell>Key</TableHeadCell>
                    <TableHeadCell>Holds</TableHeadCell>
                    <TableHeadCell>Lifetime</TableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stateKeys.map(row => (
                    <TableRow key={row.key}>
                      <TableCell>
                        <code className={styles.key}>{row.key}</code>
                      </TableCell>
                      <TableCell>{row.holds}</TableCell>
                      <TableCell>{row.ttl}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <ProjectTextRow>
              <ProjectSectionText>
                Authorization codes are redeemed with <code>GETDEL</code>, so two
                concurrent redemptions of the same code cannot both succeed. The store
                had to be Redis rather than an edge config store: those propagate
                writes over seconds, and an authorization code must be readable the
                instant after it is written. The original process build still runs from
                the same code, so the port is not a one-way door.
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>

        <ProjectSection>
          <ProjectSectionContent>
            <ProjectTextRow>
              <ProjectSectionHeading>Fewer calls, correct dates</ProjectSectionHeading>
              <ProjectSectionText>
                Nearly every tool resolves a person&rsquo;s name to an id through the
                member list, so one conversation fetched the same list over and over,
                and a tool that took ten names awaited ten sequential fetches of it. A
                90-second per-caller cache and a resolver that matches all names against
                one fetch removed both. Keep-alive stopped each call paying a fresh TLS
                handshake, and reports now carry server-side totals with durations
                emitted once, roughly halving the payload the model has to read.
              </ProjectSectionText>
              <ProjectSectionText>
                Relative dates — <em>today</em>, <em>last week</em> — are resolved on
                the server in the organisation&rsquo;s timezone. That is a correctness
                fix, not a convenience: the API answers a wrong date range with an
                empty success, which is indistinguishable from &ldquo;this person did no
                work&rdquo;. Its timestamps also end in a literal <code>Z</code> that is
                not a UTC marker, so sending a genuine UTC instant shifts every report by
                the local offset. Twenty-six tests pin those rules down.
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>

        <ProjectSection light>
          <ProjectSectionContent>
            <ProjectTextRow>
              <ProjectSectionHeading>What serverless costs here</ProjectSectionHeading>
              <ProjectSectionText>
                Written down rather than discovered later: full-size screenshot batches
                are capped by the response limit; cold starts add latency to the first
                call after idle; access tokens for the product now live in a second
                third-party processor; and screenshots transit the host&rsquo;s
                infrastructure. The last two are compliance questions rather than
                engineering ones, and the documentation flags them for review against
                the product&rsquo;s SOC 2 and GDPR position instead of assuming them
                away.
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
      </ProjectContainer>
    </>
  );
};
