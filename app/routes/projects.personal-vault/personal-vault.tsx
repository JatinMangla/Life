import { Link } from '~/components/link';
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
import { Text } from '~/components/text';
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
import styles from './personal-vault.module.css';

const project = getProject('personal-vault');
const { title, description, roles, liveUrl, repoUrl, access, stack, hue } = project;

export const meta = () => projectMeta(project);

/** A subset of the repository's free-tier ledger: the lines that can bite. */
const ledger = [
  {
    service: 'Oracle compute',
    allowance: '2 OCPU / 12 GB ARM',
    usage: '2 / 12',
    guard: 'Never resize up — exceeding it terminates the VM',
  },
  {
    service: 'Oracle block storage',
    allowance: '200 GB',
    usage: '200 GB',
    guard: 'Keep the volume at 0 VPU; one tier up costs ~36× the annual budget',
  },
  {
    service: 'Oracle Object Storage',
    allowance: '~20 GB (Always Free)',
    usage: '< 8 GiB',
    guard: 'Backup refuses to run past 85% — over-limit objects get deleted',
  },
  {
    service: 'Supabase Postgres',
    allowance: '500 MB',
    usage: '~80 MB',
    guard: '30-day metric retention, pruned nightly by a workflow',
  },
  {
    service: 'Vercel Hobby',
    allowance: '1M function calls / month',
    usage: '~43k',
    guard: 'Signed URLs only — file bytes never pass through Vercel',
  },
] as const;

export const PersonalVault = () => {
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
              <ProjectSectionHeading>The brief</ProjectSectionHeading>
              <ProjectSectionText>
                Every photo, video and important document in one place, every original
                kept in at least two, for no more than a dollar a year. Those
                constraints fight each other, and most of the work was deciding which
                one gives way where — then writing the decision down.
              </ProjectSectionText>
              <ProjectSectionText>
                It is four components in one monorepo. Only one of them is a web app,
                and the most important engineering decision was not to write the
                biggest one at all.
              </ProjectSectionText>
            </ProjectTextRow>
            <ArchitectureDiagram
              caption="Four components: a deployed photo engine, an encrypted document vault, backup and operations, and a health dashboard."
              layers={[
                {
                  name: 'Media',
                  nodes: [
                    { id: 'immich', label: 'Immich', detail: 'deployed, not rebuilt' },
                    { id: 'oracle', label: 'Oracle ARM VM', detail: 'Always Free' },
                    { id: 'tailscale', label: 'Tailscale', detail: 'no open TCP ports' },
                  ],
                },
                {
                  name: 'Documents',
                  nodes: [
                    { id: 'next', label: 'Next.js PWA', detail: 'encrypts in browser' },
                    { id: 'supabase', label: 'Supabase', detail: 'auth, RLS, storage' },
                  ],
                },
                {
                  name: 'Backup',
                  nodes: [
                    { id: 'restic', label: 'restic', detail: 'nightly, verified' },
                    { id: 'drill', label: 'Restore drill', detail: 'the real gate' },
                  ],
                },
                {
                  name: 'Health',
                  nodes: [
                    { id: 'collector', label: 'Collector', detail: 'pushes every minute' },
                    { id: 'status', label: '/status', detail: 'live dashboard' },
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
                Don&rsquo;t rebuild what already exists
              </ProjectSectionHeading>
              <ProjectSectionText>
                The original plan was to deploy everything on Vercel. For photos that is
                a category mismatch rather than a tuning problem: a photo library needs
                Postgres with pgvector, a job queue, a persistent filesystem and
                long-running ML workers, and a serverless function has a 60-second
                ceiling and no disk. Immich already does semantic search, face
                recognition, albums and — crucially — background camera-roll backup,
                which iOS only allows a native app to do. So the media half is Immich,
                deployed and hardened on an Oracle Always Free ARM VM with Ansible, and
                the repository contains no photo-management code at all.
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>

        <ProjectSection>
          <ProjectSectionContent>
            <ProjectTextRow>
              <ProjectSectionHeading>
                Encryption the server can&rsquo;t undo
              </ProjectSectionHeading>
              <ProjectSectionText>
                Documents are the half I did build. Nobody but the owner — not Supabase,
                not Vercel, not me as the operator — can read a stored file, which is a
                property the design has to earn rather than claim.
              </ProjectSectionText>
            </ProjectTextRow>
            <FeatureGrid
              hue={hue}
              items={[
                {
                  title: 'Encrypted before upload',
                  detail:
                    'AES-256-GCM in 4 MB chunks with a fresh random IV per chunk, using the browser’s Web Crypto API. Storage only ever holds ciphertext.',
                },
                {
                  title: 'Keys that never leave memory',
                  detail:
                    'Derived with PBKDF2-SHA256 at 600,000 iterations and marked non-extractable, so code in the page can use a key but never read it out.',
                },
                {
                  title: 'Bytes bypass the server',
                  detail:
                    'A function authenticates the request and mints a 60-second signed URL; the browser talks to storage directly.',
                },
                {
                  title: 'Row Level Security',
                  detail:
                    'Every Supabase table has policies scoped to the signed-in user, verified with a real file round trip.',
                },
                {
                  title: 'No secrets in the repo',
                  detail:
                    'A pre-write hook blocks credential-shaped content, gitleaks scans the full history weekly, and CI scans the built client bundle for server-only variables.',
                },
                {
                  title: 'Search without plaintext',
                  detail:
                    'Full-text search over contents is impossible by design. Search runs client-side over a decrypted index of names, tags and notes.',
                },
              ]}
            />
          </ProjectSectionContent>
        </ProjectSection>

        <ProjectSection light>
          <ProjectSectionContent>
            <ProjectTextRow>
              <ProjectSectionHeading>A budget of $0.00, audited</ProjectSectionHeading>
              <ProjectSectionText>
                Free tiers are generous and unforgiving: several of them respond to an
                overage by deleting data rather than sending a bill. So the repository
                keeps a ledger of every allowance against projected usage, and each line
                that can bite has a guard in code rather than a warning in a README.
              </ProjectSectionText>
            </ProjectTextRow>
            {/* Focusable so keyboard users can scroll it sideways on a phone. */}
            <div
              className={styles.tableWrap}
              role="region"
              aria-label="Free-tier ledger"
              // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- scrollable region
              tabIndex={0}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeadCell>Service</TableHeadCell>
                    <TableHeadCell>Free allowance</TableHeadCell>
                    <TableHeadCell>Usage</TableHeadCell>
                    <TableHeadCell>Guard</TableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ledger.map(row => (
                    <TableRow key={row.service}>
                      <TableCell>{row.service}</TableCell>
                      <TableCell>{row.allowance}</TableCell>
                      <TableCell>{row.usage}</TableCell>
                      <TableCell>{row.guard}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <ProjectTextRow>
              <ProjectSectionText>
                Moving the health collector from every 15 minutes to every minute cost
                nothing in money but moved two lines of the ledger: 4.3% of
                Vercel&rsquo;s monthly function calls, and 78 MB of the 500 MB database
                for 30 days of samples. Until a nightly workflow started pruning them,
                retention was unbounded — exactly the kind of drift the ledger exists to
                catch.
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>

        <ProjectSection>
          <ProjectSectionContent>
            <ProjectTextRow>
              <ProjectSectionHeading>Settled by measuring, not by arguing</ProjectSectionHeading>
              <ProjectSectionText>
                The video archive is verified by downloading every archived file again
                and hashing it against a manifest. Measured on the real archive, that
                check was 85% of the whole run — 6.2 GB in 162 minutes, seven times
                slower than uploading the same bytes — and its log was full of one
                stalled connection timing out while nothing else moved.
              </ProjectSectionText>
              <ProjectSectionText>
                I had recommended against parallelising it, reasoning that upload
                dominated. The measurement said otherwise, so I built a fetcher that
                downloads several files at once — whole files per task, so there is no
                offset arithmetic to get wrong — behind three fallbacks, the last of
                which still hashes every byte before anything is cleared.
              </ProjectSectionText>
            </ProjectTextRow>
            <ul className={styles.numbers}>
              <li className={styles.number}>
                <Text as="span" className={styles.numberValue}>
                  162 → 12.5 min
                </Text>
                <Text as="span" size="s" className={styles.numberLabel}>
                  to verify ~6.5 GB
                </Text>
              </li>
              <li className={styles.number}>
                <Text as="span" className={styles.numberValue}>
                  ~14×
                </Text>
                <Text as="span" size="s" className={styles.numberLabel}>
                  against a hoped-for 2–4×
                </Text>
              </li>
              <li className={styles.number}>
                <Text as="span" className={styles.numberValue}>
                  1 timeout
                </Text>
                <Text as="span" size="s" className={styles.numberLabel}>
                  down from dozens per run
                </Text>
              </li>
            </ul>
          </ProjectSectionContent>
        </ProjectSection>

        <ProjectSection light>
          <ProjectSectionContent>
            <ProjectTextRow>
              <ProjectSectionHeading>Gates, and where each one stands</ProjectSectionHeading>
              <ProjectSectionText>
                Each phase had a gate that had to pass on evidence. Stating them
                exactly, including the one that has only partly passed, is the point: an
                archive you can&rsquo;t restore isn&rsquo;t a backup.
              </ProjectSectionText>
            </ProjectTextRow>
            <FeatureGrid
              hue={hue}
              items={[
                {
                  title: 'Crypto core — passed',
                  detail: '46 of 46 unit tests, blocking in CI.',
                },
                {
                  title: 'Responsive UI and PWA — passed',
                  detail:
                    '140 of 140 Playwright tests across viewports and hydration; installable.',
                },
                {
                  title: 'Network — passed',
                  detail:
                    'Zero open TCP ports, verified. One UDP port opened on purpose so Tailscale gets a direct path instead of a 1.3 MB/s relay.',
                },
                {
                  title: 'Restore drill — partly passed',
                  detail:
                    'An 18 MB database dump restored into a clean Postgres and served over the API. Restoring original media is still to be proven.',
                },
              ]}
            />
          </ProjectSectionContent>
        </ProjectSection>

        <ProjectSection>
          <ProjectSectionContent>
            <ProjectTextRow>
              <ProjectSectionHeading>Limits, stated rather than hidden</ProjectSectionHeading>
              <ProjectSectionText>
                No card-free provider offers enough free storage in this region for a
                second copy of a whole photo library, so the one-dollar ceiling and the
                two-copies rule are in direct conflict. The nightly backup protects the
                database — the part that turns a pile of files back into a library — and
                whatever recent originals fit; videos are copied to a drive at home by
                hand. The fix is about $6 a year of object storage, and the README says
                so on its first screen. Losing both the passphrase and the recovery code
                means losing the documents, which is the correct behaviour of an
                encrypted system rather than a bug.
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>

        <ProjectSection>
          <ProjectSectionContent>
            <ProjectTextRow center centerMobile noMargin>
              <ProjectSectionHeading>Where it stands</ProjectSectionHeading>
              <ProjectSectionText>
                All four components are deployed and running. The live link is
                private by design; the <Link href={repoUrl}>source is on GitHub</Link>,
                including the ledger, the security notes and the build log.
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
      </ProjectContainer>
    </>
  );
};
