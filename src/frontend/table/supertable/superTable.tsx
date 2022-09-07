import React from 'react';
import { useMemo } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { ColumnHeader } from './columnHeader';
import { Row } from './row';
import { RowGrid } from './rowGrid';
import { getPropString, getSorter, LIGHT_GRAY } from './lib';
import { SearchInput } from './searchInput';
import { Paginator } from './paginator';
import { Spinner, SyncSpinner } from './spinner';

export interface SuperTableProps<T> {
  rows: T[];
  columns: SuperTableColumn<T>[];
  rowKey: string | ((row: T) => string);
  isRefreshing?: boolean;
  selectedRow?: T;
  multiSelection?: {
    selected: T[];
    setSelected: React.Dispatch<React.SetStateAction<T[]>>;
  };
  searchProps?: {
    searchValue: string;
    setSearchValue(searchValue: string): void;
  };
  className?: string;
  itemsPerPage?: number;
  removePaginationTop?: boolean;
  removePaginationBottom?: boolean;
  removeSearch?: boolean;
  removeInfoText?: boolean;
  headerContent?: React.ReactNode;
  insertEditIconIntoColumnTitle?: string;
  customIcons?: CustomIcons;
  stickyHeaderContainerHeight?: number;
  disableAutoScrollOnBottomPageChange?: boolean;
  removeLastRowBottomBorder?: boolean;
  onRowClick?:
    | ((clickedRow: T) => React.ReactNode | void)
    | ((clickedRow: T) => Promise<React.ReactNode | void>);
  onRowEditSave?: ((row: T) => void) | ((row: T) => Promise<void>);
  canSave?(editedRow: T): boolean;
  onRefresh?(): void;
  rowHasError?(row: T): boolean;
  rowIsDisabled?(row: T): boolean;
}

export interface SelectOption {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
}

export interface CustomIcons {
  edit?: React.ReactNode;
  cancel?: React.ReactNode;
  confirm?: React.ReactNode;
}

export interface SuperTableEditComponent {
  value: any;
  setValue(newValue: any): void;
}

export interface SuperTableColumn<T> {
  title: string;
  dataIndex: string;
  width?: 'min-content' | 'auto' | string;
  align?: 'start' | 'center' | 'end';
  titleAlign?: 'start' | 'center' | 'end';
  alignVertically?: 'start' | 'center' | 'end';
  sorted?: SortDirection;
  editingType?:
    | 'string'
    | 'number'
    | 'boolean'
    | SelectOption[]
    | ((props: SuperTableEditComponent) => any);
  ignoreRowClick?: boolean;
  dontShrinkInput?: boolean;
  disableSorting?: boolean;
  cellTitle?(value: unknown, row?: T, index?: number): string;
  sorter?(a: T, b: T): number;
  render?(value: unknown, row: T, index: number): React.ReactNode | Promise<React.ReactNode>;
}

export type SortDirection = 'ascending' | 'descending';

export interface SortInfo {
  col: string;
  direction: SortDirection;
}

const DefaultPageSize = Number.MAX_SAFE_INTEGER;

export function SuperTable<T>(props: SuperTableProps<T>) {
  const [searchValue, setSearchValue] = useState('');
  const [sortInfo, setSortInfo] = useState<SortInfo>();

  const [currentPage, setCurrentPage] = useState(1);

  const earlierRowsAsString = useRef('');
  const [earlierRowsLength, setEarlierRowsLength] = useState(0);

  const stickyHeaderScrollContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (JSON.stringify(props.rows) === earlierRowsAsString.current) {
      return;
    }

    if (props.multiSelection && props.multiSelection.selected.length !== 0) {
      props.multiSelection.setSelected([]);
    }

    earlierRowsAsString.current = JSON.stringify(props.rows);
  }, [props.rows, props.multiSelection]);

  useEffect(() => {
    let atLeastOneAutoWidth = false;
    let preSortInfo: SortInfo | undefined;

    props.columns.forEach((col) => {
      if (col.width === 'auto') {
        atLeastOneAutoWidth = true;
      }
      if (col.sorted) {
        if (preSortInfo) {
          throw new Error(
            "SuperTable error: Exactly one column must have its 'sorted' prop specified"
          );
        }
        preSortInfo = { col: col.title, direction: col.sorted };
      }
      if (col.editingType && col.dataIndex === props.rowKey) {
        throw new Error(`SuperTable error: key property '${props.rowKey}' must not be editable`);
      }
    });

    if (!preSortInfo) {
      throw new Error("SuperTable error: Exactly one column must have its 'sorted' prop specified");
    }

    if (!atLeastOneAutoWidth) {
      throw new Error(
        "SuperTable error: At least one of the provided columns must have its width prop specified as 'auto'"
      );
    }

    setSortInfo(preSortInfo);
  }, [props.columns, props.rowKey]);

  const tableId = useMemo(() => Math.round(Math.random() * 1000000).toString(), []);

  const columns = useMemo(
    () =>
      props.columns.map((column) => ({
        ...column,
        sorter: column.sorter ? column.sorter : getSorter(column.dataIndex),
      })),
    [props.columns]
  );

  const sortedFilteredRows = useMemo(() => {
    if (!sortInfo) {
      return [];
    }

    const filteredRows = props.rows.filter((row) => {
      for (const col of columns) {
        const searchVal = props.searchProps
          ? props.searchProps.searchValue.toLowerCase()
          : searchValue.toLowerCase();
        const dataIndexVal = getPropString(row, col.dataIndex).toLowerCase();

        if (dataIndexVal.includes(searchVal)) {
          return true;
        }
      }
      return false;
    });

    const sortFunction = columns.find((col) => sortInfo.col === col.title)?.sorter;

    filteredRows.sort(sortFunction);

    if (sortInfo.direction === 'descending') {
      filteredRows.reverse();
    }

    if (filteredRows.length !== earlierRowsLength) {
      setCurrentPage(1);
    }

    setEarlierRowsLength(filteredRows.length);

    return filteredRows;
  }, [props.rows, searchValue, columns, sortInfo, props.searchProps, earlierRowsLength]);

  const shownRows = useMemo(
    () =>
      sortedFilteredRows.slice(
        (currentPage - 1) * (props.itemsPerPage || DefaultPageSize),
        currentPage * (props.itemsPerPage || DefaultPageSize)
      ),
    [sortedFilteredRows, currentPage, props.itemsPerPage]
  );

  function getRowKey(r: T): string {
    return typeof props.rowKey === 'string' ? getPropString(r, props.rowKey) : props.rowKey(r);
  }

  const numberOfPages = useMemo(
    () => Math.ceil(sortedFilteredRows.length / (props.itemsPerPage || DefaultPageSize)),
    [sortedFilteredRows, props.itemsPerPage]
  );

  const infoText = useMemo(() => {
    const itemsCount =
      sortedFilteredRows.length + ' item' + (sortedFilteredRows.length !== 1 ? 's' : '');

    const endIndex = currentPage * (props.itemsPerPage || DefaultPageSize);

    const shownCount =
      sortedFilteredRows.length === 0
        ? ''
        : numberOfPages === 1
        ? props.removeSearch
          ? ''
          : 'showing all'
        : `showing ${(currentPage - 1) * (props.itemsPerPage || DefaultPageSize) + 1}-${
            endIndex > sortedFilteredRows.length ? sortedFilteredRows.length : endIndex
          }`;

    const selectedCount =
      (props.multiSelection?.selected.length || 0) > 0
        ? `${props.multiSelection?.selected.length} selected`
        : '';

    return [itemsCount, shownCount, selectedCount].filter((s) => !!s).join(', ');
  }, [
    props.itemsPerPage,
    props.multiSelection,
    currentPage,
    numberOfPages,
    sortedFilteredRows,
    props.removeSearch,
  ]);

  return (
    <div style={{ width: '100%' }} className="supertable-container">
      {(props.onRefresh ||
        !props.removeInfoText ||
        (props.itemsPerPage && props.removePaginationTop) ||
        !props.removeSearch ||
        props.headerContent) && (
        <div
          style={{
            padding: '16px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: props.itemsPerPage && !props.removePaginationTop ? -4 : undefined,
            ...(props.stickyHeaderContainerHeight
              ? {
                  position: 'sticky',
                  background: 'white',
                  top: '0px',
                  zIndex: 1,
                }
              : {}),
          }}
          className="supertable-header"
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {!props.removeSearch && (
              <SearchInput
                value={props.searchProps ? props.searchProps.searchValue : searchValue}
                onChange={(v) =>
                  props.searchProps ? props.searchProps.setSearchValue(v) : setSearchValue(v)
                }
              />
            )}
            {!props.removeInfoText && (
              <div
                style={{ marginLeft: props.removeSearch ? undefined : 24 }}
                className="supertable-infotext"
              >
                {infoText}
              </div>
            )}
            {props.headerContent && (
              <div
                style={{
                  marginLeft: !props.removeInfoText || !props.removeSearch ? 24 : undefined,
                }}
                className="supertable-header-customcontent-container"
              >
                {props.headerContent}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: 24 }}>
            {props.onRefresh && (
              <SyncSpinner loading={!!props.isRefreshing} onClick={props.onRefresh} />
            )}
            {props.itemsPerPage && !props.removePaginationTop && (
              <Paginator
                id={tableId}
                pageCount={numberOfPages}
                currentPage={currentPage}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  stickyHeaderScrollContainer.current?.scrollTo(0, 0);
                }}
              />
            )}
          </div>
        </div>
      )}
      <div
        style={{ position: 'relative', borderTop: `1px solid ${LIGHT_GRAY}` }}
        className="supertable-row-container"
      >
        {props.isRefreshing && (
          <div
            style={{
              position: 'absolute',
              background: 'rgba(255,255,255,0.6)',
              height: '100%',
              width: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '92px',
              }}
            >
              <Spinner />
            </div>
          </div>
        )}
        <RowGrid
          columns={columns}
          multiSelection={props.multiSelection}
          onRowEditSave={!!props.onRowEditSave}
          insertEditIconIntoOtherColumn={!!props.insertEditIconIntoColumnTitle}
          stickyHeaderContainerHeight={props.stickyHeaderContainerHeight}
          innerRef={stickyHeaderScrollContainer}
        >
          {props.multiSelection && (
            <div
              style={{
                paddingLeft: '10px',
                display: 'flex',
                justifyContent: 'center',
                ...(!!props.stickyHeaderContainerHeight
                  ? {
                      position: 'sticky',
                      background: 'white',
                      top: '0px',
                      zIndex: 1,
                    }
                  : {}),
                WebkitBoxSizing: 'border-box',
                MozBoxSizing: 'border-box',
                boxSizing: 'border-box',
                height: '100%',
                borderBottom: `2px solid ${LIGHT_GRAY}`,
              }}
            >
              <input
                type="checkbox"
                checked={
                  props.rows.length !== 0 &&
                  props.multiSelection?.selected.length === props.rows.length
                }
                onChange={() => {
                  if (props.multiSelection?.selected.length === props.rows.length) {
                    props.multiSelection.setSelected([]);
                  } else {
                    props.multiSelection?.setSelected(props.rows);
                  }
                }}
              />
            </div>
          )}
          {columns.map((col) => (
            <ColumnHeader
              key={col.title}
              column={col}
              sortInfo={sortInfo}
              setSortInfo={col.disableSorting ? undefined : setSortInfo}
              sticky={!!props.stickyHeaderContainerHeight}
            />
          ))}
          {props.onRowEditSave && !props.insertEditIconIntoColumnTitle && (
            <ColumnHeader
              key="__actions__"
              column={{ title: '__actions__', dataIndex: '' }}
              sticky={!!props.stickyHeaderContainerHeight}
            />
          )}
          {shownRows.length === 0 ? (
            props.isRefreshing ? (
              <div />
            ) : (
              <div
                style={{
                  gridColumn: `span ${
                    columns.length +
                    (props.multiSelection ? 1 : 0) +
                    (props.onRowEditSave && !props.insertEditIconIntoColumnTitle ? 1 : 0)
                  }`,
                  textAlign: 'center',
                  fontSize: '18px',
                  margin: '24px',
                }}
                className="supertable-nodataplaceholder"
              >
                No data to show...
              </div>
            )
          ) : (
            shownRows.map((row, i) => (
              <Row
                row={row}
                columns={props.columns}
                onRowEditSave={props.onRowEditSave}
                key={getRowKey(row)}
                isSelected={props.selectedRow && getRowKey(props.selectedRow) === getRowKey(row)}
                onRowClick={
                  props.onRowClick &&
                  (!props.rowIsDisabled || !props.rowIsDisabled(row)) &&
                  (window.getSelection()?.toString().length || 0) === 0
                    ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                      async () => await props.onRowClick!(row)
                    : undefined
                }
                renderBottomLine={i < shownRows.length - 1 || !props.removeLastRowBottomBorder}
                getRowKey={getRowKey}
                multiSelection={props.multiSelection}
                insertEditIconsIntoColumnTitle={props.insertEditIconIntoColumnTitle}
                hasError={props.rowHasError && props.rowHasError(row)}
                index={i}
                customIcons={props.customIcons}
                canSave={props.canSave}
              />
            ))
          )}
        </RowGrid>
        {props.itemsPerPage && !props.removePaginationBottom && (
          <div
            style={{
              marginTop: '16px',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Paginator
              pageCount={numberOfPages}
              currentPage={currentPage}
              onPageChange={(v) => {
                setCurrentPage(v);
                if (!props.disableAutoScrollOnBottomPageChange) {
                  document
                    .getElementById(tableId)
                    ?.scrollIntoView({ behavior: 'smooth', inline: 'nearest' });
                }
                stickyHeaderScrollContainer.current?.scrollTo(0, 0);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
