import { classes } from '~/utils/style';
import styles from './architecture-diagram.module.css';

export interface DiagramNode {
  id: string;
  label: string;
  /** Small type label rendered under the name, e.g. "React" or "REST". */
  detail?: string;
}

export interface DiagramLayer {
  /** Layer name shown down the left-hand side. */
  name: string;
  nodes: DiagramNode[];
}

export interface ArchitectureDiagramProps {
  /** Describes the diagram for screen readers; the SVG itself is decorative. */
  caption: string;
  layers: DiagramLayer[];
  className?: string;
}

/**
 * A layered block diagram, drawn as inline SVG so it inherits theme tokens and
 * needs no runtime dependency.
 *
 * The visual is `aria-hidden`; the same information is rendered as a nested
 * list for assistive tech, because a box-and-arrow picture communicates
 * nothing to a screen reader.
 */
export const ArchitectureDiagram = ({
  caption,
  layers,
  className,
}: ArchitectureDiagramProps) => (
  <figure className={classes(styles.figure, className)}>
    <div className={styles.diagram} aria-hidden>
      {layers.map(layer => (
        <div className={styles.layer} key={layer.name}>
          <span className={styles.layerName}>{layer.name}</span>
          <div className={styles.nodes}>
            {layer.nodes.map(node => (
              <div className={styles.node} key={node.id}>
                <span className={styles.nodeLabel}>{node.label}</span>
                {!!node.detail && <span className={styles.nodeDetail}>{node.detail}</span>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>

    <figcaption className={styles.caption}>{caption}</figcaption>

    <div className={styles.textAlternative}>
      <ol>
        {layers.map(layer => (
          <li key={layer.name}>
            {layer.name}:{' '}
            {layer.nodes
              .map(node => (node.detail ? `${node.label} (${node.detail})` : node.label))
              .join(', ')}
          </li>
        ))}
      </ol>
    </div>
  </figure>
);
