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
      headers: {
        'x-api-key': window.location.host === 'tabletennis.ckal.dk' ? 'hej' : '',
      },
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
    <div className="container">
      <div className="row mt-5">
        <div className="col-lg-12 col-md-auto">
          <h6 className="display-6">Super Table Tennis Ranking</h6>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12 col-md-auto">
          <SuperTable
            rows={players}
            columns={BasicColumns}
            rowKey={'_id'}
            itemsPerPage={10}
            removePaginationBottom
            removeInfoText
            removePaginationTop
          />
          <hr />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6 col-md-auto">
          <Collapse
            header="Played a match?"
            message="Register the results here and climb the ladder"
            subheader="Wanna join the league?"
            submessage="Head over and create a user!"
            id="left"
            linkHref="https://www.CKAL.dk"
            modal={<Modal players={players} matchType="Register" reload={updateTable} />}
          />
        </div>
        <div className="col-lg-6 col-md-auto">
          <Collapse
            header="Elo Rating Description"
            message="This is a description"
            subheader="GitHub Repo"
            submessage="GitHub Repo"
            id="right"
          />
        </div>
      </div>
    </div>
  );
};
