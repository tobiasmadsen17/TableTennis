interface collapseProps {
  header?: string;
  subheader?: string;
  linkHref?: string;
  linkMessage?: string;
  modal?: any;
}
export const Collapse = ({ header, subheader, linkHref, linkMessage, modal }: collapseProps) => {
  return (
    <div>
      <div id="collapseExample">
        <div className="card card-body mt-3">
          <h5>
            {header} <br />{' '}
            <small>
              {subheader}{' '}
              <a href={linkHref} target="_blank" rel="noreferrer">
                {linkMessage}
              </a>
              {modal}
            </small>
          </h5>
        </div>
      </div>
    </div>
  );
};
