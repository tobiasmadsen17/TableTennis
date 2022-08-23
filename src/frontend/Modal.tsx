import { PlayerProps, Player } from './table/lib';
import { useState, ChangeEvent } from 'react';
import axios from 'axios';
export const Modal = (props: PlayerProps) => {
  const listItems = props.players.map((value: Player) => (
    <option key={value._id} value={value.email}>
      {value.email}
    </option>
  ));
  interface matchData {
    numPointsToWin: number;
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
    numPointsToWin: 11,
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

  const setEmails = (target: string, event: string) => {
    target === 'A'
      ? setMatchState((current) => ({
          ...current,
          participantsA: {
            ...current.participantsA,
            emails: [event],
          },
        }))
      : setMatchState((current) => ({
          ...current,
          participantsB: {
            ...current.participantsB,
            emails: [event],
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
    });
    document.getElementById(`close${props.matchType}`)?.click();
  };

  return (
    <div className="mt-3">
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
              <h5 className="modal-title">Add {props.matchType} Match Results</h5>
              <button
                className="btn-close"
                id={'close' + props.matchType}
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <select
                className="form-select mt-3"
                aria-label="Default select example"
                onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                  setEmails('A', event.target.value);
                }}
              >
                <option selected disabled>
                  Select Player One
                </option>
                {listItems}
              </select>
              <input
                type="number"
                min="0"
                className="form-control mt-3 mb-3"
                placeholder="Player One Won Sets"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setNumOfWonSet('A', event.target.value as unknown as number);
                }}
              ></input>
              <select
                className="form-select mt-3"
                aria-label="Default select example"
                onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                  setEmails('B', event.target.value);
                }}
              >
                <option selected disabled>
                  Select Player Two
                </option>
                {listItems}
              </select>
              <input
                type="number"
                min="0"
                className="form-control mt-3 mb-3"
                placeholder="Player Two won Sets"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setNumOfWonSet('B', event.target.value as unknown as number);
                }}
              ></input>
            </div>
            <div className="modal-footer">
              <button onClick={() => submitMatch(matchState)} className="btn btn-primary">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
