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
      numSetsWon: number;
    };
    participantsB: {
      emails: string[];
      numSetsWon: number;
    };
  }
  const [matchState, setMatchState] = useState<matchData>({
    totalPoints: 22,
    gameOfMultipleSets: true,
    participantsA: {
      emails: [],
      numSetsWon: 0,
    },
    participantsB: {
      emails: [],
      numSetsWon: 0,
    },
  });
  const [alert, alertHidden] = useState(true);
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
    await axios({
      method: 'POST',
      url: 'https://api.ckal.dk/table-tennis/session',
      data: matchForSubmit,
    })
      .then((response) => {
        console.log(response);
        props.reload(true);
        document.getElementById(`close${props.matchType}`)?.click();
      })
      .catch(() => {
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
            <div className="modal-header">
              <h5 className="modal-title">{props.matchType} Match Results</h5>
              <button
                className="btn-close"
                id={'close' + props.matchType}
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body needs-validation">
              <Alert alertMessage="Please fill out all values" hidden={alert} />
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
              <div className="form-text">Ctrl + Click to select multiple participants</div>
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
              <hr />
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
              <div className="form-text">Ctrl + Click to select multiple participants</div>
              <input
                type="number"
                min="0"
                required
                className="form-control mt-3 mb-3"
                placeholder="Won Sets"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setNumOfWonSet('B', event.target.value as unknown as number);
                }}
              ></input>
              <div className="modal-footer">
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
