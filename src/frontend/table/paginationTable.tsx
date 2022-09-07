import { SuperTable } from './supertable/superTable';
import { useEffect, useState } from 'react';
import { Modal } from '../Modal';
import axios from 'axios';
import { Collapse } from '../Collapse';
import { BasicColumns, UserInfo } from './lib';
import { clearCredentials } from '../../credentialsHandler';

interface PaginationExampleProps {
  userInfo: UserInfo;
  clearUserInfo(): void;
}

export const PaginationExample = (props: PaginationExampleProps) => {
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
            rowKey={'email'}
            removeInfoText
            removeSearch
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
            modal={
              <Modal
                players={players}
                matchType="Register"
                reload={updateTable}
                ownEmail={props.userInfo.email}
              />
            }
          />
        </div>
        <div className="col-lg-6 col-md-auto">
          <Collapse
            header="Ranking Description"
            message="Registering games affects your rating. Longer games results in higher wins and losses of rating. Divisions are (lowest to highest): Bronze, Silver, Gold, Platinum, Diamon. Tiers are 1 through 5. Your rating affect how many points you need to win the game versus your opponent - consult <this> to see your point cap versus different opponents. The more you play, the less uncertain the system is about your rank."
            subheader="GitHub Repo"
            submessage="GitHub Repo"
            id="right"
          />
        </div>
      </div>
      <div className="row">
        <div>
          <button
            className="btn btn-outline-primary mt-5 mb-3"
            onClick={async () => {
              await clearCredentials();
              props.clearUserInfo();
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
