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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1 style={{ marginTop: 128 }}>Table Tennis</h1>
      <input
        placeholder="CKAL email..."
        style={{ marginTop: 24 }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Password..."
        style={{ marginTop: 12 }}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
      />
      <button
        style={{ marginTop: 24 }}
        onClick={async () => {
          props.setIsWorking(true);
          await tryLogin();
          props.setIsWorking(false);
        }}
      >
        {props.loading ? '...' : 'Login'}
      </button>
    </div>
  );
}
