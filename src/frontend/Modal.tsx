import { PlayerProps, Player } from './table/lib';
import { useState, ChangeEvent } from 'react';
import { Alert } from './Alert';
import axios from 'axios';
export const Modal = (props: PlayerProps) => {
  const listItems = props.players.map((value: Player) => (
    <option key={value._id} value={value.email}>
      {value.email}
    </option>
  ));
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
  const renderMailsA = matchState.participantsA.emails.map((item, index) => (
    <li className="list-group-item" key={index}>
      {item}
    </li>
  ));
  const renderMailsB = matchState.participantsB.emails.map((item, index) => (
    <li className="list-group-item" key={index}>
      {item}
    </li>
  ));
  const [alert, alertHidden] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');

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
              <input
                className="form-control"
                list="datalistOptions"
                id="DataListA"
                placeholder="Search player"
                onChange={(event: any) => {
                  setMails(event, 'A');
                }}
              ></input>
              <datalist id="datalistOptions">{listItems}</datalist>
              <ol className="mt-1 list-group list-group-numbered">{renderMailsA}</ol>
              <div className="form-floating mb-3">
                <input
                  type="number"
                  min="0"
                  className="form-control mt-3 mb-3"
                  placeholder="Won Sets"
                  required
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    setNumOfWonSet('A', event.target.value as unknown as number);
                  }}
                ></input>
                <label htmlFor="floatingInput">Amount of won sets</label>
              </div>
              <hr />
              <h5>Team B</h5>
              <input
                className="form-control"
                list="datalistOptions"
                id="DataListB"
                placeholder="Search player"
                onChange={(event: any) => {
                  setMails(event, 'B');
                }}
              ></input>
              <datalist id="datalistOptions">{listItems}</datalist>
              <ol className="mt-1 list-group list-group-numbered">{renderMailsB}</ol>

              <div className="form-floating mb-3">
                <input
                  type="number"
                  min="0"
                  className="form-control mt-3 mb-3"
                  placeholder="Won Sets"
                  required
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
