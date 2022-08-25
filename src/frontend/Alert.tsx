interface alertProps {
  alertMessage: string;
  hidden: boolean;
}

export const Alert = ({ alertMessage, hidden }: alertProps) => {
  return (
    <div>
      {!hidden && (
        <div className="alert alert-danger" role="alert">
          {alertMessage}
        </div>
      )}
    </div>
  );
};
