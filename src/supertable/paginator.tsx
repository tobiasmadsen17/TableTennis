import { useMemo } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { calculatePageNumbers, LIGHT_GRAY } from './lib';

interface PaginatorProps {
  id?: string;
  pageCount: number;
  currentPage: number;
  onPageChange(newPageNumber: number): void;
}

export function Paginator(props: PaginatorProps) {
  const leftDisabled = useMemo(
    () => props.pageCount === 0 || props.currentPage === 1,
    [props.currentPage, props.pageCount]
  );
  const rightDisabled = useMemo(
    () => props.pageCount === 0 || props.currentPage === props.pageCount,
    [props.currentPage, props.pageCount]
  );

  const pages = useMemo(
    () => calculatePageNumbers(props.currentPage, props.pageCount),
    [props.currentPage, props.pageCount]
  );

  return (
    <div
      id={props.id}
      style={{
        display: 'flex',
        alignItems: 'center',
        userSelect: 'none',
      }}
    >
      <MdChevronLeft
        style={{
          fontSize: 20,
          color: leftDisabled ? LIGHT_GRAY : undefined,
          cursor: leftDisabled ? undefined : 'pointer',
          marginRight: 8,
        }}
        onClick={() => {
          if (leftDisabled) {
            return;
          }
          props.onPageChange(props.currentPage - 1);
        }}
      />
      {pages.map((n, i) => (
        <div
          key={i}
          style={{
            height: 32,
            width: 32,
            background: props.currentPage === Number(n) ? 'rgba(0,0,0,0.08)' : undefined,
            borderRadius: 4,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: props.currentPage !== Number(n) && n !== '...' ? 'pointer' : undefined,
            userSelect: 'none',
          }}
          onClick={() => {
            if (n !== '...') {
              props.onPageChange(Number(n));
            }
          }}
        >
          {n}
        </div>
      ))}
      <MdChevronRight
        style={{
          marginLeft: 8,
          fontSize: 20,
          color: rightDisabled ? LIGHT_GRAY : undefined,
          cursor: rightDisabled ? undefined : 'pointer',
        }}
        onClick={() => {
          if (rightDisabled) {
            return;
          }
          props.onPageChange(props.currentPage + 1);
        }}
      />
    </div>
  );
}
