import { ArchitectureDiagram } from '~/components/architecture-diagram';
import { StoryContainer } from '../../../.storybook/story-container';

export default {
  title: 'ArchitectureDiagram',
};

export const Default = () => (
  <StoryContainer>
    <ArchitectureDiagram
      caption="Frontend architecture: interface, state, transport and identity layers."
      layers={[
        {
          name: 'Interface',
          nodes: [
            { id: 'react', label: 'React.js', detail: 'views' },
            { id: 'charts', label: 'ApexCharts', detail: 'metrics' },
          ],
        },
        {
          name: 'State',
          nodes: [
            { id: 'redux', label: 'Redux', detail: 'Thunk + Saga' },
            { id: 'query', label: 'React Query', detail: 'server cache' },
          ],
        },
        {
          name: 'Transport',
          nodes: [
            { id: 'rest', label: 'REST', detail: 'reads and writes' },
            { id: 'signalr', label: 'SignalR', detail: 'live activity' },
          ],
        },
      ]}
    />
  </StoryContainer>
);
