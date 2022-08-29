import { PlayerProps, Player } from './table/lib';
import { useState, ChangeEvent } from 'react';
import { Alert } from './Alert';
import axios from 'axios';
import { ListRender } from './ListRender';
export const Modal = (props: PlayerProps) => {
  interface matchData {
    totalPoints: number;
    gameOfMultipleSets: boolean;
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
    gameOfMultipleSets: true,
    participantsA: {
      emails: [],
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

  const removeParticipant = (player: string, team: string) => {
    const arrayA = [...matchState.participantsA.emails];
    const arrayB = [...matchState.participantsB.emails];

    if (team === 'A') {
      const index = arrayA.indexOf(player);
      if (index !== -1) {
        arrayA.splice(index, 1);
        setMatchState((current) => ({
          ...current,
          participantsA: {
            ...current.participantsA,
            emails: arrayA,
          },
        }));
      }
    } else if (team === 'B') {
      const index = arrayB.indexOf(player);
      if (index !== -1) {
        arrayB.splice(index, 1);
        setMatchState((current) => ({
          ...current,
          participantsB: {
            ...current.participantsB,
            emails: arrayB,
          },
        }));
      }
    }
  };

  const setMails = (event: any, target: string) => {
    let value = event.target.value;
    let players: string[] = [];
    props.players.forEach((player) => {
      players.push(player.email);
    });

    let includes = players.includes(value);
    if (includes === true && target === 'A') {
      setMatchState((current) => ({
        ...current,
        participantsA: {
          ...current.participantsA,
          emails: [...current.participantsA.emails, value],
        },
      }));
      const inputForm = document.getElementById('DataListA') as HTMLInputElement;
      inputForm.value = '';
    } else if (includes === true && target === 'B') {
      setMatchState((current) => ({
        ...current,
        participantsB: {
          ...current.participantsB,
          emails: [...current.participantsB.emails, value],
        },
      }));
      const inputForm = document.getElementById('DataListB') as HTMLInputElement;
      inputForm.value = '';
    }
  };
  const setNumOfWonSet = (target: string, event: number) => {
    target === 'A'
      ? setMatchState((current) => ({
          ...current,
          participantsA: {
            ...current.participantsA,
            numSetsWon: event,
          },
        }))
      : setMatchState((current) => ({
          ...current,
          participantsB: {
            ...current.participantsB,
            numSetsWon: event,
          },
        }));
  };
  const submitMatch = async (matchForSubmit: matchData) => {
    await axios({
      method: 'POST',
      url: 'https://api.ckal.dk/table-tennis/session',
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
              <div className="form-floating mb-3">
                <input
                  id="DataListA"
                  list="datalistOptions"
                  placeholder="Search player"
                  className="form-control mt-3 mb-3"
                  required
                  onChange={(event: any) => {
                    setMails(event, 'A');
                  }}
                ></input>
                <label htmlFor="floatingInput">Search Player</label>
              </div>
              <datalist id="datalistOptions">{listItems}</datalist>
              <ListRender
                parsedArray={matchState.participantsA.emails}
                uniqueIndex="A"
                clickRemove={(playerFromChild: string) => removeParticipant(playerFromChild, 'A')}
              />
              <div className="form-floating mb-3">
                <input
                  type="number"
                  min="0"
                  className="form-control mt-3 mb-3"
                  required
                  placeholder="Amount of won sets"
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    setNumOfWonSet('A', event.target.value as unknown as number);
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
                  id="DataListB"
                  placeholder="Search player"
                  onChange={(event: any) => {
                    setMails(event, 'B');
                  }}
                ></input>
                <label htmlFor="floatingInput">Search Player</label>
              </div>
              <datalist id="datalistOptions">{listItems}</datalist>
              <ListRender
                parsedArray={matchState.participantsB.emails}
                uniqueIndex="B"
                clickRemove={(playerFromChild: string) => removeParticipant(playerFromChild, 'B')}
              />
              <div className="form-floating mb-3">
                <input
                  type="number"
                  min="0"
                  placeholder="Amount of won sets"
                  className="form-control mt-3 mb-3"
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    setNumOfWonSet('B', event.target.value as unknown as number);
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
