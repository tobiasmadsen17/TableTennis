/* eslint-disable jsx-a11y/anchor-is-valid */
import { SuperTable } from './supertable/superTable';
import { CSSProperties, useEffect, useState } from 'react';
import { Modal } from '../Modal';
import axios from 'axios';
import { getPlayerColumnsSingle, PlayerColumnsDouble, Session, UserInfo } from './lib';
import { clearCredentials, getAccessToken } from '../../credentialsHandler';
import { HistoryList } from '../HistoryList';
import { MatchInfoModal } from '../MatchInfoModal';
import { RankedDescriptionModal } from '../RankedDescriptionModal';
import 'bootstrap-icons/font/bootstrap-icons.css';

const buttonStyle: CSSProperties = {
  padding: '4px 8px',
  border: '1px solid rgb(13,110,253)',
  borderRadius: 4,
  color: 'rgb(13,110,253)',
};

const selectedStyle: CSSProperties = {
  color: 'white',
  background: 'rgb(13,110,253)',
};

interface PaginationExampleProps {
  userInfo: UserInfo;
  clearUserInfo(): void;
}

export const PaginationExample = (props: PaginationExampleProps) => {
  const [players, setPlayers] = useState([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedMode, setSelectedMode] = useState<'single' | 'double'>('single');

  useEffect(() => {
    fetchSessions(true);
  }, []);

  const updateTable = (reload: boolean) => {
    if (reload === true) fetchPlayers();
  };

  function fetchSessions(reload: boolean) {
    if (!reload) return;
    axios({
      method: 'GET',
      url: 'https://api.ckal.dk/table-tennis/sessions',
      headers: { 'x-api-key': window.location.host === 'tabletennis.ckal.dk' ? 'hej' : '' },
    }).then((res) => setSessions(res.data.reverse()));
  }

  function refresh(reload: boolean) {
    updateTable(reload);
    fetchSessions(reload);
  }

  const fetchPlayers = async () => {
    await axios({
      method: 'GET',
      url: 'https://api.ckal.dk/table-tennis/players',
      headers: {
        'x-api-key': window.location.host === 'tabletennis.ckal.dk' ? 'hej' : '',
        authorization: await getAccessToken(),
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
    <div>
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
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDarkDropdown">
            <ul className="navbar-nav">
              <li>
                <Modal
                  players={players}
                  matchType="Register"
                  reload={(reload: boolean) => refresh(reload)}
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 8, margin: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div
                style={{ ...buttonStyle, ...(selectedMode === 'single' ? selectedStyle : {}) }}
                onClick={() => setSelectedMode('single')}
              >
                Single
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div
                style={{ ...buttonStyle, ...(selectedMode === 'double' ? selectedStyle : {}) }}
                onClick={() => setSelectedMode('double')}
              >
                Double
              </div>
            </div>
          </div>
          <SuperTable
            rows={players}
            columns={
              selectedMode === 'single'
                ? getPlayerColumnsSingle(props.userInfo.email)
                : PlayerColumnsDouble
            }
            rowKey="email"
            removeInfoText
            removeSearch
          />
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-lg-12 col-md-auto mb-3" style={{ marginTop: 8 }}>
          <div
            style={{
              background: '#eae9e9',
              borderTop: '1px solid lightgray',
              borderBottom: '1px solid lightgray',
            }}
          >
            <HistoryList players={players} sessions={sessions} />
          </div>
        </div>
      </div>
    </div>
  );
};
