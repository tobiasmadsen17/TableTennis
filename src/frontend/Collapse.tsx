interface collapseProps {
  header: string;
  subheader: string;
  linkHref?: string;
  linkMessage?: string;
  modal?: any;
}
export const Collapse = ({ header, subheader, linkHref, linkMessage, modal }: collapseProps) => {
  return (
    <div>
      <div id="collapseExample">
        <div className="card card-body mt-3">
          <div className="accordion accordion-flush" id="accordionFlushExample">
            <div className="accordion-item">
              <h2 className="accordion-header" id="flush-headingOne">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#flush-collapseOne"
                  aria-expanded="false"
                  aria-controls="flush-collapseOne"
                >
                  {header}
                </button>
              </h2>
              <div
                id="flush-collapseOne"
                className="accordion-collapse collapse"
                aria-labelledby="flush-headingOne"
                data-bs-parent="#accordionFlushExample"
              >
                <div className="accordion-body">
                  <h5 className="mb-3">
                    <small>Register the results here and climb the ladder</small>
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
                  data-bs-target="#flush-collapseTwo"
                  aria-expanded="false"
                  aria-controls="flush-collapseTwo"
                >
                  {subheader}
                </button>
              </h2>
              <div
                id="flush-collapseTwo"
                className="accordion-collapse collapse"
                aria-labelledby="flush-headingTwo"
                data-bs-parent="#accordionFlushExample"
              >
                <div className="accordion-body">
                  <h5 className="mb-3">
                    <small>
                      Head over and create a user!
                      <br />
                    </small>
                  </h5>
                  <a
                    className="btn btn-outline-primary"
                    href={linkHref}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Sign up here
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
