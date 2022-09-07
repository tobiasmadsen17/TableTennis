import { SuperTableColumn } from './supertable/superTable';

export interface Player {
  _id: string;
  email: string;
  name: string;
  ranks: {
    single: string;
    double: string;
  };
}

export interface PlayerProps {
  players: Player[];
  matchType: string;
  reload: Function;
  ownEmail: string;
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
    title: 'Single',
    dataIndex: 'ranks.single',
    sorted: 'descending',
    sorter: (a, b) => sortRank(a.ranks.single, b.ranks.single),
  },
  {
    title: 'Double',
    dataIndex: 'ranks.double',
    sorter: (a, b) => sortRank(a.ranks.double, b.ranks.double),
  },
];

function sortRank(a: string, b: string) {
  const [divisonA, tierA, uncertaintyA] = a.split(' ');
  const [divisonB, tierB, uncertaintyB] = b.split(' ');

  const divisionToInt: { [div in string]: number } = {
    Bronze: 0,
    Silver: 1,
    Gold: 2,
    Platinum: 3,
    Diamond: 4,
  };

  if (uncertaintyA !== uncertaintyB) {
    if (!uncertaintyA) {
      return -1;
    }
    if (!uncertaintyB) {
      return 1;
    }
    return uncertaintyB.length - uncertaintyA.length;
  }

  if (divisonA !== divisonB) {
    return (divisionToInt[divisonA] || 0) - (divisionToInt[divisonB] || 0);
  }

  return Number(tierA) - Number(tierB);
}
