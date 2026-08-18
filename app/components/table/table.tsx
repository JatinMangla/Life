import type { ReactNode } from 'react';
import styles from './table.module.css';

interface TablePartProps {
  children?: ReactNode;
}

export const Table = ({ children }: TablePartProps) => (
  <table className={styles.table}>{children}</table>
);

export const TableRow = ({ children }: TablePartProps) => (
  <tr className={styles.row}>{children}</tr>
);

export const TableHead = ({ children }: TablePartProps) => (
  <thead className={styles.head}>{children}</thead>
);

export const TableBody = ({ children }: TablePartProps) => (
  <tbody className={styles.body}>{children}</tbody>
);

export const TableHeadCell = ({ children }: TablePartProps) => (
  <th className={styles.headCell}>{children}</th>
);

export const TableCell = ({ children }: TablePartProps) => (
  <td className={styles.cell}>{children}</td>
);
