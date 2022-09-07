import { PlayerProps, Player } from './table/lib';
import { useState, ChangeEvent } from 'react';
import { Alert } from './Alert';
import axios from 'axios';
import { ListRender } from './ListRender';
export const Modal = (props: PlayerProps) => {
  interface matchData {
    totalPoints: number;
    participantsA: {
      emails: string[];
      numSetsWon: number | string;
    };
    participantsB: {
      emails: string[];
      numSetsWon: number | string;
    };
  }
  const [matchState, setMatchState] = useState<matchData>({
    totalPoints: 22,
    participantsA: {
      emails: [props.ownEmail],
      numSetsWon: '',
    },
    participantsB: {
      emails: [],
      numSetsWon: '',
    },
  });
  const listItems = props.players.map((value: Player) => (
    <option key={value.email} value={value.email}>
      {value.email}
    </option>
  ));
  const [alert, alertHidden] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');

  const removeParticipant = <
    directKey extends keyof objectParam,
    nestedKey extends keyof objectParam[directKey],
    objectParam extends Record<directKey, Record<nestedKey, string[]>>
  >(
    matchState: objectParam,
    participants: directKey,
    playerValue: nestedKey,
    value: string
  ) => {
    const array = [matchState[participants][playerValue]][0];
    const index = array.indexOf(value);
    if (index !== -1) {
      array.splice(index, 1);
      setMatchState((current) => ({
        ...current,
        [participants]: {
          ...current,
          emails: array,
        },
      }));
    }
  };
  const setPlayerValue = <
    directKey extends keyof objectParam,
    nestedKey extends keyof objectParam[directKey],
    objectParam extends Record<directKey, Record<nestedKey, any>>
  >(
    matchState: objectParam,
    participants: directKey,
    playerValue: nestedKey,
    event: any
  ) => {
    const value = event.target.value;
    let players: string[] = [];
    props.players.forEach((player) => {
      players.push(player.email);
    });
    if (players.includes(value)) {
      setMatchState((current) => ({
        ...current,
        [participants]: {
          ...matchState[participants],
          [playerValue]: [...matchState[participants][playerValue], value],
        },
      }));
      const inputForm = document.getElementById(
        `DataList${participants as string}`
      ) as HTMLInputElement;
      inputForm.value = '';
    } else if (playerValue === 'numSetsWon') {
      setMatchState((current) => ({
        ...current,
        [participants]: {
          ...matchState[participants],
          [playerValue]: value,
        },
      }));
    }
  };
  const submitMatch = async (matchForSubmit: matchData) => {
    await axios({
      method: 'POST',
      url: 'https://api.ckal.dk/table-tennis/session',
      headers: { 'x-api-key': window.location.host === 'tabletennis.ckal.dk' ? 'hej' : '' },
      data: matchForSubmit,
    })
      .then(() => {
        props.reload(true);
        document.getElementById(`close${props.matchType}`)?.click();
      })
      .catch((response) => {
        setAlertMessage(response.response.data);
        props.reload(false);
        alertHidden(false);
      });
  };
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
                  onClick={() => setMatchState({ ...matchState, totalPoints: 10 })}
                >
                  <input
                    type="checkbox"
                    style={{ marginRight: 8 }}
                    checked={matchState.totalPoints === 10}
                  />
                  To 5
                </div>
                <div
                  style={{ display: 'flex', alignItems: 'center' }}
                  onClick={() => setMatchState({ ...matchState, totalPoints: 22 })}
                >
                  <input
                    type="checkbox"
                    style={{ marginRight: 8 }}
                    checked={matchState.totalPoints === 22}
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
                  disabled={matchState.participantsA.emails.length === 2}
                  onChange={(event: any) => {
                    setPlayerValue(matchState, 'participantsA', 'emails', event);
                  }}
                ></input>
                <label htmlFor="floatingInput">Search Player</label>
              </div>
              <datalist id="datalistOptions">{listItems}</datalist>
              <ListRender
                parsedArray={matchState.participantsA.emails}
                uniqueIndex="A"
                clickRemove={(playerFromChild: string) =>
                  removeParticipant(matchState, 'participantsA', 'emails', playerFromChild)
                }
              />
              <div className="form-floating mb-3">
                <input
                  type="number"
                  min="0"
                  className="form-control mt-3 mb-3"
                  required
                  placeholder="Amount of won sets"
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    setPlayerValue(matchState, 'participantsA', 'numSetsWon', event);
                  }}
                ></input>
                <label htmlFor="floatingInput">Amount of won sets</label>
              </div>
              <hr />
              <h5>Team B</h5>
              <div className="form-floating mb-3">
                <input
                  className="form-control mt-3 mb-3"
                  list="datalistOptions"
                  id="DataListparticipantsB"
                  disabled={matchState.participantsB.emails.length === 2}
                  placeholder="Search player"
                  onChange={(event: any) => {
                    setPlayerValue(matchState, 'participantsB', 'emails', event);
                  }}
                ></input>
                <label htmlFor="floatingInput">Search Player</label>
              </div>
              <datalist id="datalistOptions">{listItems}</datalist>
              <ListRender
                parsedArray={matchState.participantsB.emails}
                uniqueIndex="B"
                clickRemove={(playerFromChild: string) =>
                  removeParticipant(matchState, 'participantsB', 'emails', playerFromChild)
                }
              />
              <div className="form-floating mb-3">
                <input
                  type="number"
                  min="0"
                  placeholder="Amount of won sets"
                  className="form-control mt-3 mb-3"
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    setPlayerValue(matchState, 'participantsB', 'numSetsWon', event);
                  }}
                ></input>
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
                <button onClick={() => submitMatch(matchState)} className="btn btn-primary">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
