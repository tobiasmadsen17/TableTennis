import { PlayerProps, Player } from './table/lib';
import { useState, ChangeEvent } from 'react';
import { Alert } from './Alert';
import axios from 'axios';
export const Modal = (props: PlayerProps, test: boolean) => {
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
  const [alert, alertHidden] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');

  const setEmails = (target: string, event: any) => {
    target === 'A'
      ? setMatchState((current) => ({
          ...current,
          participantsA: {
            ...current.participantsA,
            emails: Array.from(event.target.selectedOptions, (option: any) => option.value),
          },
        }))
      : setMatchState((current) => ({
          ...current,
          participantsB: {
            ...current.participantsB,
            emails: Array.from(event.target.selectedOptions, (option: any) => option.value),
          },
        }));
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
    console.log(matchForSubmit.participantsA.numSetsWon);
    await axios({
      method: 'POST',
      url: 'https://api.ckal.dk/table-tennis/session',
      data: matchForSubmit,
      headers: {
        'x-api-key': window.location.host === 'tabletennis.ckal.dk' ? 'hej' : '',
      },
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
              <select
                className="form-select mt-3"
                multiple
                required
                aria-label="multiple select example"
                onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                  setEmails('A', event);
                }}
              >
                {listItems}
              </select>
              <div className="form-text">
                <p>
                  <em>Ctrl + Click to select multiple</em>
                </p>
              </div>
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
              <h5>Team B</h5>
              <select
                className="form-select mt-3"
                multiple
                required
                aria-label="Default select example"
                onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                  setEmails('B', event);
                }}
              >
                {listItems}
              </select>
              <div className="form-text">
                <p>
                  <em>Ctrl + Click to select multiple</em>
                </p>
              </div>
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
