interface collapseProps {
  header: string;
  message: string;
  subheader: string;
  submessage: string;
  id: string;
  linkHref?: string;
  modal?: any;
}
export const Collapse = ({
  header,
  message,
  subheader,
  submessage,
  id,
  linkHref,
  modal,
}: collapseProps) => {
  return (
    <div>
      <div id={header}>
        <div className="card card-body mt-3">
          <div className="accordion accordion-flush" id={id}>
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={'#flush-collapseOne' + id}
                  aria-expanded="false"
                  aria-controls="flush-collapseOne"
                >
                  {header}
                </button>
              </h2>
              <div
                id={'flush-collapseOne' + id}
                className="accordion-collapse collapse"
                data-bs-parent={'#' + id}
              >
                <div className="accordion-body">
                  <h5 className="mb-3">
                    <small>{message}</small>
                  </h5>
                  {modal}
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="flush-headingTwo">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={'#flush-collapseTwo' + id}
                  aria-expanded="false"
                  aria-controls="flush-collapseTwo"
                >
                  {subheader}
                </button>
              </h2>
              <div
                id={'flush-collapseTwo' + id}
                className="accordion-collapse collapse"
                aria-labelledby="flush-headingTwo"
                data-bs-parent={'#' + id}
              >
                <div className="accordion-body">
                  <h5 className="mb-3">
                    <small>
                      {subheader}
                      <br />
                    </small>
                  </h5>
                  {linkHref !== undefined && (
                    <a
                      className="btn btn-outline-primary"
                      href={linkHref}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Sign up
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
