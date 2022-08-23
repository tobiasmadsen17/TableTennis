import './styles.css';

interface SpinnerProps {
  size?: number;
}

export function Spinner(props: SpinnerProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <svg
        className="supertable-spin"
        width={props.size?.toString() || '24'}
        height={props.size?.toString() || '24'}
        viewBox="0 0 48 48"
      >
        <g fill="none">
          <path
            id="track"
            fill="#C6CCD2"
            d="M24,48 C10.745166,48 0,37.254834 0,24 C0,10.745166 10.745166,0 24,0 C37.254834,0 48,10.745166 48,24 C48,37.254834 37.254834,48 24,48 Z M24,44 C35.045695,44 44,35.045695 44,24 C44,12.954305 35.045695,4 24,4 C12.954305,4 4,12.954305 4,24 C4,35.045695 12.954305,44 24,44 Z"
          />
          <path
            id="section"
            fill="#3F4850"
            d="M24,0 C37.254834,0 48,10.745166 48,24 L44,24 C44,12.954305 35.045695,4 24,4 L24,0 Z"
          />
        </g>
      </svg>
    </div>
  );
}

interface SyncSpinnerProps {
  loading: boolean;
  size?: number;
  onClick(): void;
}

export function SyncSpinner(props: SyncSpinnerProps) {
  return (
    <div
      onClick={() => {
        if (!props.loading) {
          props.onClick();
        }
      }}
      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
    >
      <svg
        className={props.loading ? 'supertable-spin' : ''}
        viewBox="64 64 896 896"
        focusable="false"
        data-icon="sync"
        width={props.size?.toString() || '24'}
        height={props.size?.toString() || '24'}
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M168 504.2c1-43.7 10-86.1 26.9-126 17.3-41 42.1-77.7 73.7-109.4S337 212.3 378 195c42.4-17.9 87.4-27 133.9-27s91.5 9.1 133.8 27A341.5 341.5 0 01755 268.8c9.9 9.9 19.2 20.4 27.8 31.4l-60.2 47a8 8 0 003 14.1l175.7 43c5 1.2 9.9-2.6 9.9-7.7l.8-180.9c0-6.7-7.7-10.5-12.9-6.3l-56.4 44.1C765.8 155.1 646.2 92 511.8 92 282.7 92 96.3 275.6 92 503.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8zm756 7.8h-60c-4.4 0-7.9 3.5-8 7.8-1 43.7-10 86.1-26.9 126-17.3 41-42.1 77.8-73.7 109.4A342.45 342.45 0 01512.1 856a342.24 342.24 0 01-243.2-100.8c-9.9-9.9-19.2-20.4-27.8-31.4l60.2-47a8 8 0 00-3-14.1l-175.7-43c-5-1.2-9.9 2.6-9.9 7.7l-.7 181c0 6.7 7.7 10.5 12.9 6.3l56.4-44.1C258.2 868.9 377.8 932 512.2 932c229.2 0 415.5-183.7 419.8-411.8a8 8 0 00-8-8.2z"></path>
      </svg>
    </div>
  );
}
