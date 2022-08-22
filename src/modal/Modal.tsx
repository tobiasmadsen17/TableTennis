import { PlayerProps } from '../table/lib';
import { Player } from '../table/lib';
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

  const [state, setState] = useState<matchData>({
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

  const setEmails = (target: string, event: any) => {
    if (target === 'A') {
      setState((current) => ({
        ...current,
        participantsA: {
          ...current.participantsA,
          emails: [event],
        },
      }));
    } else {
      setState((current) => ({
        ...current,
        participantsB: {
          ...current.participantsB,
          emails: [event],
        },
      }));
    }
  };
  const setNumOfWonSet = (target: string, event: any) => {
    if (target === 'A') {
      setState((current) => ({
        ...current,
        participantsA: {
          ...current.participantsA,
          numSetsWon: event,
        },
      }));
    } else {
      setState((current) => ({
        ...current,
        participantsB: {
          ...current.participantsB,
          numSetsWon: event,
        },
      }));
    }
  };
  const submit = async (matchForSubmit: matchData) => {
    await axios({
      method: 'post',
      url: 'https://api.ckal.dk/table-tennis/session',
      data: matchForSubmit,
    });
    document.getElementById('close')?.click();
  };

  return (
    <div className="mt-3">
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#addMatch"
      >
        Add match results
      </button>
      <h5>
        Wanna join the league? Create a new{' '}
        <a href="https://www.ckal.dk" target="_blank" rel="noreferrer">
          user
        </a>
      </h5>
      <div className="modal fade" id="addMatch" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Add Match Results
              </h5>
              <button
                type="button"
                id="close"
                className="btn-close"
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
                placeholder="Player One won Sets"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setNumOfWonSet('A', event.target.value);
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
                  setNumOfWonSet('B', event.target.value);
                }}
              ></input>
            </div>
            <div className="modal-footer">
              <button onClick={() => submit(state)} type="button" className="btn btn-primary">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
