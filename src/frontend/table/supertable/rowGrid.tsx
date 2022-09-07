import React, { MutableRefObject, useState } from 'react';
import { SuperTableColumn } from './superTable';

interface RowGridProps<T> {
  children: React.ReactNode;
  multiSelection?: {
    selected: T[];
    setSelected: React.Dispatch<React.SetStateAction<T[]>>;
  };
  insertEditIconIntoOtherColumn: boolean;
  onRowEditSave: boolean;
  columns: SuperTableColumn<T>[];
  stickyHeaderContainerHeight?: number;
  innerRef: MutableRefObject<HTMLDivElement | null>;
}

export function RowGrid<T>(props: RowGridProps<T>) {
  const [hoveredRowKey, setHoveredRowKey] = useState('');

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns:
          (props.multiSelection ? 'min-content ' : '') +
          props.columns.map((col) => col.width || 'min-content').join(' ') +
          (props.onRowEditSave && !props.insertEditIconIntoOtherColumn
            ? ' min-content'
            : ''),
        fontSize: '14px',
        overflow: 'auto',
        alignItems: 'center',
        maxHeight: props.stickyHeaderContainerHeight,
      }}
      ref={props.innerRef}
    >
      {React.Children.map(props.children, (child) => {
        if (React.isValidElement(child) && typeof child.type !== 'string') {
          return React.cloneElement(child, {
            hoveredrowkey: hoveredRowKey,
            sethoveredrowkey: setHoveredRowKey,
          });
        }

        return child;
      })}
    </div>
  );
}
