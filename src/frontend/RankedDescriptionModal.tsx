import React from 'react';

export const RankedDescriptionModal = () => {
  return (
    <div>
      <a className="nav-link text-white mt-1" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Ranked Description
      </a>

      <div
        className="modal fade"
        id="exampleModal"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Ranked Description
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="modal-body">
                Registering games affects your rating. Longer games results in higher wins and
                losses of rating. <br />
                Divisions are (lowest to highest): <br />
                Bronze (B), Silver (S), Gold (G), Platinum (P), Diamond (D). Tiers are 1 through 5.
                <br />
                Your rating affect how many points you need to win the game versus your opponent -
                consult to see your point cap versus different opponents. The more you play, the
                less uncertain the system is about your rank.
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" data-bs-dismiss="modal" className="btn btn-primary">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
