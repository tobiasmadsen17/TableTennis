import { AiOutlineCaretDown, AiOutlineCaretUp } from 'react-icons/ai';
import { LIGHT_GRAY } from './lib';
import { SortInfo, SuperTableColumn } from './superTable';

interface ColumnHeaderProps<T> {
  column: SuperTableColumn<T>;
  sortInfo?: SortInfo;
  setSortInfo?(sortInfo: SortInfo): void;
  sticky?: boolean;
}

export function ColumnHeader<T>(props: ColumnHeaderProps<T>) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px 12px',
        height: '100%',
        WebkitBoxSizing: 'border-box',
        MozBoxSizing: 'border-box',
        boxSizing: 'border-box',
        cursor: props.setSortInfo ? 'pointer' : undefined,
        borderTop: props.sticky ? `1px solid ${LIGHT_GRAY}` : undefined,
        borderBottom: `2px solid ${LIGHT_GRAY}`,
        ...(props.sticky ? { position: 'sticky', background: 'white', top: '0px', zIndex: 1 } : {}),
      }}
      className="supertable-columnheader"
      onClick={
        !props.setSortInfo
          ? undefined
          : () => {
              if (props.sortInfo?.col !== props.column.title) {
                props.setSortInfo!({
                  col: props.column.title,
                  direction: 'ascending',
                });
              } else {
                props.setSortInfo!({
                  col: props.column.title,
                  direction: props.sortInfo.direction === 'ascending' ? 'descending' : 'ascending',
                });
              }
            }
      }
    >
      <div
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          marginRight: '6px',
          userSelect: 'none',
          textAlign: props.column.titleAlign,
          width: '100%',
          marginTop: 1,
        }}
        title={props.column.title}
      >
        {props.column.title !== '__actions__' ? props.column.title : ''}
      </div>
      {props.setSortInfo && (
        <div
          style={{
            cursor: 'pointer',
            marginBottom: '-5px',
          }}
        >
          {props.sortInfo?.col !== props.column.title ? null : props.sortInfo.direction ===
            'ascending' ? (
            <AiOutlineCaretUp />
          ) : (
            <AiOutlineCaretDown />
          )}
        </div>
      )}
    </div>
  );
}
