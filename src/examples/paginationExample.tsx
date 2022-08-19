import { SuperTable } from '../supertable/superTable';
import { BasicColumns } from './lib';
import { useEffect, useState } from 'react';
import { Modal } from '../modal/Modal';
export const PaginationExample = () => {
  const [players, setPlayers] = useState([]);

  const fetchPlayers = () => {
    fetch('https://api.ckal.dk/table-tennis/players')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setPlayers(data);
      });
  };
  useEffect(() => {
    fetchPlayers();
  }, []);

  return (
    <div>
      <h1>Super Table Tennis Ranking</h1>
      <SuperTable
        rows={players}
        columns={BasicColumns}
        rowKey={'_id'}
        itemsPerPage={10}
        removePaginationBottom
      />
      <Modal players={players} />
    </div>
  );
};
