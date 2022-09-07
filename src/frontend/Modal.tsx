import { PlayerProps, Player } from './table/lib';
import { useState } from 'react';
import { Alert } from './Alert';
import axios from 'axios';
import { ListRender } from './ListRender';

export function Modal(props: PlayerProps) {
  const [emailsA, setEmailsA] = useState<string[]>([props.ownEmail]);
  const [emailsB, setEmailsB] = useState<string[]>([]);
  const [numSetsWonA, setNumSetsWonA] = useState('');
  const [numSetsWonB, setNumSetsWonB] = useState('');
  const [totalPoints, setTotalPoints] = useState(22);

  const listItems = props.players.map((value: Player) => (
    <option key={value.email} value={value.email}>
      {value.email}
    </option>
  ));
  const [alert, alertHidden] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');

  function submitMatch() {
    axios({
      method: 'POST',
      url: 'https://api.ckal.dk/table-tennis/session',
      headers: { 'x-api-key': window.location.host === 'tabletennis.ckal.dk' ? 'hej' : '' },
      data: {
        totalPoints: totalPoints,
        participantsA: {
          emails: emailsA,
          numSetsWon: Number(numSetsWonA),
        },
        participantsB: {
          emails: emailsB,
          numSetsWon: Number(numSetsWonB),
        },
      },
    })
      .then(() => {
        props.reload(true);
        document.getElementById(`close${props.matchType}`)?.click();
        setEmailsA([props.ownEmail]);
        setNumSetsWonA('');
        setNumSetsWonB('');
        setEmailsB([]);
        setTotalPoints(22);
      })
      .catch((response) => {
        setAlertMessage(response.response.data);
        props.reload(false);
        alertHidden(false);
      });
  }
  return (
    <div className="mt-1">
      <button
        className="btn btn-outline-primary"
        data-bs-toggle="modal"
        data-bs-target={'#' + props.matchType}
      >
        {props.matchType} Match
      </button>
      <div className="modal fade" id={props.matchType} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body needs-validation">
              <Alert alertMessage={alertMessage} hidden={alert} />
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
                  value=" "
                  onChange={(event) => setEmailsA(emailsA.concat(event.target.value))}
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
              <div className="form-floating mb-3">
                <input
                  type="number"
                  min="0"
                  className="form-control mt-3 mb-3"
                  required
                  placeholder="Amount of won sets"
                  onChange={(event) => setNumSetsWonA(event.target.value)}
                />
                <label htmlFor="floatingInput">Amount of won sets</label>
              </div>
              <hr />
              <h5>Team B</h5>
              <div className="form-floating mb-3">
                <input
                  className="form-control mt-3 mb-3"
                  list="datalistOptions"
                  id="DataListparticipantsB"
                  disabled={emailsB.length === 2}
                  placeholder="Search player"
                  value=" "
                  onChange={(event) => setEmailsB(emailsB.concat(event.target.value))}
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
              <div className="form-floating mb-3">
                <input
                  type="number"
                  min="0"
                  placeholder="Amount of won sets"
                  className="form-control mt-3 mb-3"
                  onChange={(event) => setNumSetsWonB(event.target.value)}
                />
                <label htmlFor="floatingInput">Amount of won sets</label>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  id={'close' + props.matchType}
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  className="btn btn-outline-primary"
                >
                  Close
                </button>
                <button onClick={submitMatch} className="btn btn-primary">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
