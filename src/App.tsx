import { useEffect, useState } from 'react';
import { getUserInfo } from './credentialsHandler';
import { LoginPage } from './frontend/LoginPage';
import { UserInfo } from './frontend/table/lib';
import { PaginationExample } from './frontend/table/paginationTable';
function App() {
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [isWorking, setIsWorking] = useState(false);

  useEffect(() => {
    tryGetUserInfo();
  }, []);

  async function tryGetUserInfo() {
    setIsWorking(true);
    try {
      setUserInfo(await getUserInfo());
    } catch {}
    setIsWorking(false);
  }

  return !userInfo ? (
    <LoginPage loading={isWorking} setIsWorking={setIsWorking} onLogin={tryGetUserInfo} />
  ) : (
    <PaginationExample userInfo={userInfo} clearUserInfo={() => setUserInfo(undefined)} />
  );
}

export default App;
