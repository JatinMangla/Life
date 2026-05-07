import usesBackgroundPlaceholder from '~/assets/uses-background-placeholder.jpg';
import usesBackground from '~/assets/uses-background.mp4';
import { Footer } from '~/components/footer';
import { Link } from '~/components/link';
import { List, ListItem } from '~/components/list';
import { Table, TableBody, TableCell, TableHeadCell, TableRow } from '~/components/table';
import {
  ProjectBackground,
  ProjectContainer,
  ProjectHeader,
  ProjectSection,
  ProjectSectionContent,
  ProjectSectionHeading,
  ProjectSectionText,
  ProjectTextRow,
} from '~/layouts/project';
import { baseMeta } from '~/utils/meta';
import styles from './uses.module.css';

export const meta = () => {
  return baseMeta({
    title: 'Uses',
    description: 'A list of tools, frameworks, and technologies I use to build modern web applications',
  });
};

export const Uses = () => {
  return (
    <>
      <ProjectContainer className={styles.uses}>
        <ProjectBackground
          src={usesBackground}
          placeholder={usesBackgroundPlaceholder}
          opacity={0.7}
        />
        <ProjectHeader
          title="Uses"
          description="A comprehensive list of tools, frameworks, and technologies I use daily to build high-performance web applications. From React.js to Node.js, here's my full tech stack."
        />
        <ProjectSection padding="none" className={styles.section}>
          <ProjectSectionContent>
            <ProjectTextRow width="m">
              <ProjectSectionHeading>Frontend</ProjectSectionHeading>
              <ProjectSectionText as="div">
                <List>
                  <ListItem>
                    <Link href="https://reactjs.org/">React.js</Link> is my primary
                    framework for building interactive UIs. Combined with{' '}
                    <Link href="https://www.typescriptlang.org/">TypeScript</Link> for
                    type safety and better developer experience.
                  </ListItem>
                  <ListItem>
                    For state management, I use{' '}
                    <Link href="https://redux.js.org/">Redux</Link> with Thunk and Saga
                    middleware, along with{' '}
                    <Link href="https://tanstack.com/query">React Query</Link> for
                    server-state management.
                  </ListItem>
                  <ListItem>
                    Styling is done with SCSS modules, Tailwind CSS, and Bootstrap/Material
                    UI for rapid prototyping. I focus on responsive, cross-browser
                    compatible designs.
                  </ListItem>
                  <ListItem>
                    For data-heavy UIs, I leverage React Table for grids, ApexCharts for
                    data visualization, Formik for forms, and virtualization for
                    large lists.
                  </ListItem>
                  <ListItem>
                    For 3D effects and interactive experiences I use{' '}
                    <Link href="https://threejs.org/">Three.js</Link> with WebGL shaders
                    &mdash; like what you see on this very portfolio site.
                  </ListItem>
                </List>
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection padding="none" className={styles.section}>
          <ProjectSectionContent>
            <ProjectTextRow width="m">
              <ProjectSectionHeading>Backend & APIs</ProjectSectionHeading>
              <ProjectSectionText as="div">
                <List>
                  <ListItem>
                    <Link href="https://nodejs.org/">Node.js</Link> with{' '}
                    <Link href="https://expressjs.com/">Express.js</Link> for building
                    RESTful APIs and server-side logic.
                  </ListItem>
                  <ListItem>
                    <Link href="https://www.mongodb.com/">MongoDB</Link> with Mongoose ORM
                    for NoSQL data storage, PostgreSQL for relational data, and Firebase
                    for real-time features.
                  </ListItem>
                  <ListItem>
                    Real-time communication using SignalR, WebSockets, and GraphQL for
                    efficient data fetching. JWT Authentication for secure API access.
                  </ListItem>
                  <ListItem>
                    Implemented Microsoft MSAL and Google OAuth for enterprise SSO
                    authentication in production applications.
                  </ListItem>
                </List>
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection padding="none" className={styles.section}>
          <ProjectSectionContent>
            <ProjectTextRow width="m">
              <ProjectSectionHeading>Development Tools</ProjectSectionHeading>
              <ProjectSectionText as="div">
                <List>
                  <ListItem>
                    <Link href="https://code.visualstudio.com/">VS Code</Link> is my
                    editor of choice with ESLint, Prettier, and SonarQube for code quality.
                  </ListItem>
                  <ListItem>
                    Build tools include{' '}
                    <Link href="https://vitejs.dev/">Vite</Link>, Webpack, and Babel for
                    module bundling and transpilation. PM2 and Nodemon for server
                    management.
                  </ListItem>
                  <ListItem>
                    Version control with Git, GitHub, and GitLab. API testing with Postman.
                    Deployment via Vercel and FTP with FileZilla.
                  </ListItem>
                  <ListItem>
                    <Link href="https://jestjs.io/">Jest</Link> for unit testing, and
                    Storybook for building and testing UI components in isolation.
                  </ListItem>
                </List>
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection padding="none" className={styles.section}>
          <ProjectSectionContent>
            <ProjectTextRow stretch width="m">
              <ProjectSectionHeading>Tech Stack Summary</ProjectSectionHeading>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableHeadCell>Languages</TableHeadCell>
                    <TableCell>JavaScript, TypeScript, HTML5, CSS3, SCSS</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeadCell>Frameworks</TableHeadCell>
                    <TableCell>React.js, Redux, React Router, Express.js, Three.js</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeadCell>Databases</TableHeadCell>
                    <TableCell>MongoDB, PostgreSQL, Firebase</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeadCell>Build Tools</TableHeadCell>
                    <TableCell>Vite, Webpack, Babel, ESLint, Prettier</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeadCell>APIs</TableHeadCell>
                    <TableCell>GraphQL, REST, SignalR, WebSockets</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeadCell>Auth</TableHeadCell>
                    <TableCell>Microsoft MSAL, Google OAuth, JWT</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeadCell>Testing</TableHeadCell>
                    <TableCell>Jest, Storybook, SonarQube</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeadCell>Methodology</TableHeadCell>
                    <TableCell>Agile/Scrum, Lean</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
      </ProjectContainer>
      <Footer />
    </>
  );
};
