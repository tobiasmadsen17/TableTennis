import { SuperTable } from './supertable/superTable';
import { BasicColumns } from './lib';
import { useEffect, useState } from 'react';
import { Modal } from '../Modal';
import axios from 'axios';
import { Collapse } from '../Collapse';
export const PaginationExample = () => {
  const [players, setPlayers] = useState([]);

  const fetchPlayers = async () => {
    await axios({
      method: 'GET',
      url: 'https://api.ckal.dk/table-tennis/players',
    })
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        setPlayers(data);
      });
  };
  useEffect(() => {
    fetchPlayers();
  });

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
      <Modal players={players} matchType="Single" />
      <Modal players={players} matchType="Double" />
      <Collapse />
    </div>
  );
};
