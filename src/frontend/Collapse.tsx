interface collapseProps {
  header: string;
  message: string;
  externalLink?: string;
}
export const Collapse = ({ header, message, externalLink }: collapseProps) => {
  return (
    <div>
      <div id="collapseExample">
        <div className="card card-body mt-3">
          <h5>
            {header} <br />{' '}
            <small>
              {message}{' '}
              <a href={externalLink} target="_blank" rel="noreferrer">
                user
              </a>
            </small>
          </h5>
        </div>
      </div>
    </div>
  );
};
