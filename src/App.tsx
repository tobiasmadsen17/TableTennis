import { PaginationExample } from './table/paginationTable';
function App() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
      }}
    >
      <div />
      <div
        style={{
          display: 'grid',
          rowGap: 72,
          marginTop: 72,
          marginBottom: 400,
          width: 800,
        }}
      >
        <PaginationExample />
      </div>
    </div>
  );
}

export default App;
