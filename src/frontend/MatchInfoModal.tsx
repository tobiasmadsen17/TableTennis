import { Player } from './table/lib';
import { useState } from 'react';
import { Alert } from './Alert';
import axios from 'axios';
import { ListRender } from './ListRender';

interface MatchInfoModalProps {
  players: any[];
  ownEmail: string;
}

export function MatchInfoModal(props: MatchInfoModalProps) {
  const [emailsA, setEmailsA] = useState<string[]>([props.ownEmail]);
  const [emailsB, setEmailsB] = useState<string[]>([]);
  const [totalPoints, setTotalPoints] = useState(22);
  const [searchValueA, setSearchValueA] = useState('');
  const [searchValueB, setSearchValueB] = useState('');

  const listItems = props.players.map((value: Player) => (
    <option key={value.email} value={value.email}>
      {value.email}
    </option>
  ));
  const [alertState, alertHiddenState] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');

  function getMatchInfo() {
    axios({
      method: 'POST',
      url: 'https://api.ckal.dk/table-tennis/match-info',
      headers: { 'x-api-key': window.location.host === 'tabletennis.ckal.dk' ? 'hej' : '' },
      data: {
        totalPoints: totalPoints,
        participantEmailsA: emailsA,
        participantEmailsB: emailsB,
      },
    })
      .then((res) => {
        alert(
          res.data.participantsA.emails.join(', ') +
            ':' +
            res.data.participantsA.pointCap +
            '. ' +
            res.data.participantsB.emails.join(', ') +
            ':' +
            res.data.participantsB.pointCap
        );
        setEmailsA([props.ownEmail]);
        setEmailsB([]);
        setTotalPoints(22);
      })
      .catch((response) => {
        setAlertMessage(response.response.data);
        alertHiddenState(false);
      });
  }
  return (
    <div className="mt-1">
      <button
        className="btn btn-outline-primary"
        data-bs-toggle="modal"
        data-bs-target="#match-info-modal"
      >
        Calculate point targets
      </button>
      <div className="modal fade" id="match-info-modal" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body needs-validation">
              <Alert alertMessage={alertMessage} hidden={alertState} />
              <h5>Team A</h5>
              <div
                className="form-floating mb-3"
                style={{ display: 'flex', justifyContent: 'space-around' }}
              >
                <div
                  style={{ display: 'flex', alignItems: 'center' }}
                  onClick={() => setTotalPoints(10)}
                >
                  <input
                    type="checkbox"
                    style={{ marginRight: 8 }}
                    checked={totalPoints === 10}
                    onChange={() => setTotalPoints(10)}
                  />
                  To 5
                </div>
                <div
                  style={{ display: 'flex', alignItems: 'center' }}
                  onClick={() => setTotalPoints(22)}
                >
                  <input
                    type="checkbox"
                    style={{ marginRight: 8 }}
                    checked={totalPoints === 22}
                    onChange={() => setTotalPoints(22)}
                  />
                  To 11
                </div>
              </div>
              <div className="form-floating mb-3">
                <input
                  id="DataListparticipantsA"
                  list="datalistOptions"
                  placeholder="Search player"
                  className="form-control mt-3 mb-3"
                  required
                  disabled={emailsA.length === 2}
                  value={searchValueA}
                  onChange={(event) => {
                    setSearchValueA(event.target.value);
                    if (props.players.find((p) => p.email === event.target.value)) {
                      setEmailsA(emailsA.concat(event.target.value));
                      setSearchValueA('');
                    }
                  }}
                />
                <label htmlFor="floatingInput">Search Player</label>
              </div>
              <datalist id="datalistOptions">{listItems}</datalist>
              <ListRender
                parsedArray={emailsA}
                uniqueIndex="A"
                clickRemove={(playerFromChild: string) =>
                  setEmailsA(emailsA.filter((e) => e !== playerFromChild))
                }
              />
              <hr />
              <h5>Team B</h5>
              <div className="form-floating mb-3">
                <input
                  className="form-control mt-3 mb-3"
                  list="datalistOptions"
                  id="DataListparticipantsB"
                  disabled={emailsB.length === 2}
                  placeholder="Search player"
                  value={searchValueB}
                  onChange={(event) => {
                    setSearchValueB(event.target.value);
                    if (props.players.find((p) => p.email === event.target.value)) {
                      setEmailsB(emailsB.concat(event.target.value));
                      setSearchValueB('');
                    }
                  }}
                />
                <label htmlFor="floatingInput">Search Player</label>
              </div>
              <datalist id="datalistOptions">{listItems}</datalist>
              <ListRender
                parsedArray={emailsB}
                uniqueIndex="B"
                clickRemove={(playerFromChild: string) =>
                  setEmailsB(emailsB.filter((e) => e !== playerFromChild))
                }
              />
              <div className="modal-footer">
                <button
                  type="button"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  className="btn btn-outline-primary"
                >
                  Close
                </button>
                <button onClick={getMatchInfo} className="btn btn-primary">
                  Check
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
