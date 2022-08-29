import { SuperTableColumn } from './supertable/superTable';

export interface Player {
  _id: string;
  email: string;
  ratings: {
    single: number;
    double: number;
  };
  name: string;
}

export interface PlayerProps {
  players: Player[];
  matchType: string;
  reload: Function;
}

export interface UserInfo {
  email: string;
  firstname: string;
  lastname: string;
}

export interface Credentials extends AWS.CognitoIdentityServiceProvider.AuthenticationResultType {
  ExpirationTimestamp: number;
}

export const BasicColumns: SuperTableColumn<Player>[] = [
  {
    title: 'Player',
    dataIndex: 'name',
    width: 'auto',
  },
  {
    title: 'Single Rating',
    dataIndex: 'ratings.single',
    width: 'auto',
    sorted: 'descending',
  },
  {
    title: 'Double Rating',
    dataIndex: 'ratings.double',
    width: 'auto',
  },
];
