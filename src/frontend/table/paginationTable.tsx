/* eslint-disable jsx-a11y/anchor-is-valid */
import { SuperTable } from './supertable/superTable';
import { useEffect, useState } from 'react';
import { Modal } from '../Modal';
import axios from 'axios';
import { BasicColumns, UserInfo } from './lib';
import { clearCredentials } from '../../credentialsHandler';
import { HistoryList } from '../HistoryList';
import { MatchInfoModal } from '../MatchInfoModal';
import { RankedDescriptionModal } from '../RankedDescriptionModal';
import 'bootstrap-icons/font/bootstrap-icons.css';
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
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDarkDropdown"
            aria-controls="navbarNavDarkDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDarkDropdown">
            <ul className="navbar-nav">
              <li>
                <Modal
                  players={players}
                  matchType="Register"
                  reload={updateTable}
                  ownEmail={props.userInfo.email}
                />
              </li>
              <li>
                <MatchInfoModal players={players} ownEmail={props.userInfo.email} />
              </li>
              <li>
                <RankedDescriptionModal />
              </li>
              <li>
                <a
                  className="nav-link mt-1 text-white"
                  onClick={async () => {
                    await clearCredentials();
                    props.clearUserInfo();
                  }}
                >
                  Sign out <i className="bi bi-door-open-fill"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="row">
        <div className="col-lg-12 col-md-auto" style={{ marginTop: 8 }}>
          <SuperTable
            rows={players}
            columns={BasicColumns}
            rowKey="email"
            removeInfoText
            removeSearch
          />
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-lg-12 col-md-auto" style={{ marginTop: 8 }}>
          <div
            style={{
              background: '#eae9e9',
              borderTop: '1px solid lightgray',
              borderBottom: '1px solid lightgray',
            }}
          >
            <HistoryList players={players} />
          </div>
        </div>
      </div>
    </div>
  );
};
