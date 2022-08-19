import { Values } from './Values';
export const Modal = ({ players }: any) => {
  const listItems = players.map((value: any) => (
    <option key={value._id} value={value.email}>
      {value.email}
    </option>
  ));

  return (
    <div className="mt-5">
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Add new match results
      </button>
      <h4>
        Wanna join the league? Create a new{' '}
        <a href="https://www.ckal.dk" target="_blank" rel="noreferrer">
          user
        </a>
      </h4>
      <div
        className="modal fade"
        id="exampleModal"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Add Match Results
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <Values
                placeholderForPlayerSelection="Select Player One"
                optionValues={listItems}
                sets="playerOneSets"
                placeholderForSets="Player One Won Sets"
              />
              <Values
                placeholderForPlayerSelection="Select Player Two"
                optionValues={listItems}
                sets="playerTwoSets"
                placeholderForSets="Player Two Won Sets"
              />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
