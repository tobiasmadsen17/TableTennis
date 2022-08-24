import React, { CSSProperties, useEffect, useMemo, useState } from 'react';
import { getProp, LIGHT_GRAY, setProp } from './lib';
import { CustomIcons, SuperTableColumn } from './superTable';
import { AiOutlineEnter, AiOutlineEdit } from 'react-icons/ai';
import { MdCheck, MdCancel } from 'react-icons/md';
import { Spinner } from './spinner';

interface RowProps<T> {
  row: T;
  columns: SuperTableColumn<T>[];
  hoveredrowkey?: string;
  index: number;
  isSelected?: boolean;
  multiSelection?: {
    selected: T[];
    setSelected: React.Dispatch<React.SetStateAction<T[]>>;
  };
  hasError?: boolean;
  insertEditIconIntoColumnTitle?: string;
  customIcons?: CustomIcons;
  dontShrinkInput?: boolean;
  renderBottomLine: boolean;
  getRowKey(r: T): string;
  sethoveredrowkey?(key: string): void;
  onRowClick?: (() => React.ReactNode | void) | (() => Promise<React.ReactNode | void>);
  onRowEditSave?: ((row: T) => void) | ((row: T) => Promise<void>);
  canSave?(editedRow: T): boolean;
}

export function Row<T>(props: RowProps<T>) {
  const [expandContent, setExpandContent] = useState<React.ReactNode>();
  const [isWorking, setIsWorking] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editedRow, setEditedRow] = useState<T>();
  const [contents, setContents] = useState<{ content: React.ReactNode; loading: boolean }[]>([]);

  const { multiSelection, getRowKey, row } = props;

  const isSelected = useMemo(
    () => multiSelection && !!multiSelection.selected.find((r) => getRowKey(r) === getRowKey(row)),
    [row, getRowKey, multiSelection]
  );

  const getCellStyle: (col?: SuperTableColumn<T>) => CSSProperties = (
    col?: SuperTableColumn<T>
  ) => ({
    textAlign: col?.align,
    padding: '4px 12px',
    display: 'flex',
    alignItems: col?.alignVertically || 'center',
    justifyContent: col?.align,
    height: '100%',
    WebkitBoxSizing: 'border-box',
    MozBoxSizing: 'border-box',
    boxSizing: 'border-box',
    minWidth: '0px',
    background: props.isSelected
      ? '#abd7fd'
      : props.onRowClick && props.hoveredrowkey === props.getRowKey(props.row)
      ? '#dbedfd'
      : props.hasError
      ? '#fb8080'
      : props.index % 2 === 1
      ? '#f3f3f3'
      : undefined,
    cursor: props.onRowClick && !col?.ignoreRowClick ? 'pointer' : undefined,
  });

  async function handleRowClick() {
    const hadContent = expandContent;
    setExpandContent(undefined);
    if (props.onRowClick) {
      setIsWorking(!hadContent);
      const content = await props.onRowClick();
      setIsWorking(false);
      if (!content) {
        setExpandContent(undefined);
      } else if (!hadContent) {
        setExpandContent(content);
      }
    }
  }

  function safeToString(value: unknown): string {
    if ((typeof value === 'object' && value !== null) || typeof value === 'boolean') {
      return JSON.stringify(value);
    }

    return value + '';
  }

  useEffect(() => {
    setContents(
      props.columns.map(() => ({
        loading: true,
        content: '',
      }))
    );

    props.columns.forEach(async (col, i) => {
      let newContent: React.ReactNode = '';

      if (col.render) {
        try {
          newContent = await col.render(getProp(props.row, col.dataIndex), props.row, props.index);
        } catch {}
      } else {
        newContent = safeToString(getProp(props.row, col.dataIndex));
      }

      setContents((contents) => {
        const newContents = [...contents];
        newContents[i] = { loading: false, content: newContent };
        return newContents;
      });
    });
  }, [props.columns, props.row, props.index]);

  function EditCell() {
    const disable = isEditing && editedRow && props.canSave && !props.canSave(editedRow);

    return (
      <>
        {isUpdating ? (
          <Spinner size={16} />
        ) : isEditing ? (
          <>
            <div
              style={{
                cursor: disable ? 'not-allowed' : 'pointer',
                color: disable ? 'rgba(0,0,0,0.25)' : undefined,
              }}
              onClick={async () => {
                if (disable) {
                  return;
                }
                setIsUpdating(true);
                props.columns
                  .filter((col) => col.editingType)
                  .forEach((col) => {
                    if (col.editingType === 'number') {
                      setProp(editedRow, col.dataIndex, Number(getProp(editedRow, col.dataIndex)));
                    } else if (col.editingType === 'boolean') {
                      setProp(
                        editedRow,
                        col.dataIndex,
                        getProp(editedRow, col.dataIndex) === 'true'
                      );
                    } else if (col.editingType === 'string') {
                      // do nothing, already a string
                    }
                  });
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                await props.onRowEditSave!(editedRow as T);
                setIsUpdating(false);
                setIsEditing(false);
              }}
            >
              {props.customIcons?.confirm || <MdCheck style={{ fontSize: 18 }} />}
            </div>
            <div
              style={{ cursor: 'pointer', marginLeft: 4 }}
              onClick={() => {
                setIsEditing(false);
                setEditedRow(undefined);
              }}
            >
              {props.customIcons?.cancel || <MdCancel style={{ marginLeft: 4, fontSize: 18 }} />}
            </div>
          </>
        ) : (
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setIsEditing(true);
              setEditedRow(JSON.parse(JSON.stringify(props.row)));
            }}
          >
            {props.customIcons?.edit || <AiOutlineEdit style={{ fontSize: 18 }} />}
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {props.multiSelection && (
        <div
          style={{
            ...getCellStyle(),
            display: 'flex',
            alignItems: 'center',
            paddingRight: '2px',
          }}
          className="supertable-cell-checkbox"
        >
          <input
            type="checkbox"
            onChange={() => {
              if (isSelected) {
                props.multiSelection?.setSelected((selected) =>
                  selected.filter((r) => props.getRowKey(r) !== props.getRowKey(props.row))
                );
              } else {
                props.multiSelection?.setSelected((selected) => selected.concat(props.row));
              }
            }}
            checked={isSelected}
          />
        </div>
      )}
      {props.columns.map((col, i) =>
        isEditing && col.editingType ? (
          <div key={col.title} style={getCellStyle(col)} className="supertable-cell-editing">
            {col.editingType === 'boolean' || Array.isArray(col.editingType) ? (
              <select
                className="supertable-edit-input"
                value={safeToString(getProp(editedRow, col.dataIndex))}
                onChange={(e) => {
                  setProp(editedRow, col.dataIndex, e.target.value);
                  setEditedRow(JSON.parse(JSON.stringify(editedRow)));
                }}
                style={{
                  width: props.dontShrinkInput ? undefined : '100%',
                  textAlign: col.align,
                }}
              >
                {col.editingType === 'boolean' ? (
                  <>
                    <option value="true">true</option>
                    <option value="false">false</option>
                  </>
                ) : (
                  col.editingType.map((so) => (
                    <option key={JSON.stringify(so.value)} value={so.value}>
                      {so.label}
                    </option>
                  ))
                )}
              </select>
            ) : (
              <input
                className="supertable-edit-input"
                value={getProp(editedRow, col.dataIndex)}
                type={col.editingType === 'number' ? 'number' : undefined}
                style={{
                  width: props.dontShrinkInput ? undefined : '100%',
                  textAlign: col.align,
                }}
                onChange={(e) => {
                  if (e.target.value.length > 1 && e.target.value[0] === '0') {
                    e.target.value = e.target.value.slice(1);
                  }
                  setProp(editedRow, col.dataIndex, e.target.value || '0');
                  setEditedRow(JSON.parse(JSON.stringify(editedRow)));
                }}
              />
            )}
          </div>
        ) : (
          <div
            key={col.title}
            style={getCellStyle(col)}
            className="supertable-cell"
            onClick={col.ignoreRowClick ? undefined : handleRowClick}
            title={
              col.cellTitle
                ? col.cellTitle(getProp(props.row, col.dataIndex), props.row, props.index)
                : safeToString(getProp(props.row, col.dataIndex))
            }
            onMouseEnter={() =>
              props.sethoveredrowkey && props.sethoveredrowkey(props.getRowKey(props.row))
            }
            onMouseLeave={() => props.sethoveredrowkey && props.sethoveredrowkey('')}
          >
            <div
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {contents[i] ? contents[i].loading ? <Spinner /> : contents[i].content : ''}
              {col.title === props.insertEditIconIntoColumnTitle && <EditCell />}
            </div>
          </div>
        )
      )}
      {props.onRowEditSave && !props.insertEditIconIntoColumnTitle && (
        <div
          style={{
            ...getCellStyle({
              title: '',
              dataIndex: '',
              align: 'end',
              alignVertically: 'center',
            }),

            width: !props.insertEditIconIntoColumnTitle && !props.customIcons ? 40 : undefined,
          }}
        >
          <EditCell />
        </div>
      )}
      {props.renderBottomLine && (
        <div
          style={{
            gridColumn: `span ${
              props.columns.length +
              (props.multiSelection ? 1 : 0) +
              (props.onRowEditSave && !props.insertEditIconIntoColumnTitle ? 1 : 0)
            }`,
            borderBottom: `1px solid ${LIGHT_GRAY}`,
          }}
        />
      )}
      {(expandContent || isWorking) && (
        <div
          style={{
            gridColumn: `span ${
              props.columns.length +
              (props.multiSelection ? 1 : 0) +
              (props.onRowEditSave && !props.insertEditIconIntoColumnTitle ? 1 : 0)
            }`,
            display: 'flex',
            borderBottom: `1px solid ${LIGHT_GRAY}`,
          }}
        >
          {isWorking ? (
            <div
              style={{
                display: 'flex',
                margin: '8px',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <Spinner />
            </div>
          ) : (
            <>
              <AiOutlineEnter
                style={{
                  transform: 'scale(-1,1)',
                  color: '2c2c2c',
                  fontSize: '20px',
                  margin: '4px 4px 0 8px',
                }}
              />
              <div style={{ width: '100%' }} className="supertable-expandcontainer">
                {expandContent}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
