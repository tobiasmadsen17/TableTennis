import { SuperTable } from './supertable/superTable';
import { useEffect, useState } from 'react';
import { Modal } from '../Modal';
import axios from 'axios';
import { Collapse } from '../Collapse';
import { BasicColumns, Player } from './lib';
export const PaginationExample = () => {
  const [players, setPlayers] = useState([]);

  const updateTable = (reload: boolean) => {
    if (reload === true) fetchPlayers();
  };

  const fetchPlayers = async () => {
    await axios({
      method: 'GET',
      url: 'https://api.ckal.dk/table-tennis/players',
    })
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        data.forEach((player: Player) => {
          player.ratings.single = Math.round(player.ratings.single);
          player.ratings.double = Math.round(player.ratings.double);
        });
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
      <Modal players={players} matchType="Register" reload={updateTable} />
      <Collapse
        header="Wanna join the league?"
        message="Head over and create a new"
        externalLink="https://www.CKAL.dk"
      />
    </div>
  );
};
