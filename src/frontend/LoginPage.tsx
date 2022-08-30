import { useState } from 'react';
import { login } from '../credentialsHandler';

interface LoginPageProps {
  loading: boolean;
  onLogin(): Promise<void>;
  setIsWorking(isWorking: boolean): void;
}

export function LoginPage(props: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function tryLogin() {
    try {
      await login(email, password);
      await props.onLogin();
    } catch (error) {
      alert((error as Error).message);
    }
  }

  return (
    <div>
      <div className="container">
        <div className="row justify-content-md-center">
          <div className="col-md-auto">
            <h1 style={{ marginTop: 128, marginBottom: 30 }}>Table Tennis Application</h1>
          </div>
        </div>
        <div className="row justify-content-md-center">
          <div className="col-md-auto">
            <div className="form-floating mb-3">
              <input
                className="form-control"
                type="text"
                id="floatingInput"
                placeholder="CKAL email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="default input example"
              ></input>
              <label htmlFor="floatingInput">Email address</label>
            </div>
            <div className="form-floating mb-3">
              <input
                placeholder="Password..."
                style={{ marginTop: 12 }}
                value={password}
                className="form-control"
                type="password"
                id="floatingInput"
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="floatingInput">Password</label>
            </div>
          </div>
        </div>
        <div className="row justify-content-md-center">
          <div className="col-md-auto">
            <button
              type="button"
              className="btn btn-primary mt-3"
              onClick={async () => {
                props.setIsWorking(true);
                await tryLogin();
                props.setIsWorking(false);
              }}
            >
              {' '}
              {props.loading ? '...' : 'Login'}
            </button>
          </div>
        </div>
        <div className="row justify-content-md-center">
          <div className="col-md-auto">
            <a
              href={`https://ckal.dk/sign-up?redirect=${window.location.origin}`}
              target="_blank"
              rel="noreferrer"
              style={{ marginTop: 24 }}
            >
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
