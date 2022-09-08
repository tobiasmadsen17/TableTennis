import { SuperTableColumn } from './supertable/superTable';

export interface Player {
  _id: string;
  email: string;
  name: string;
  ranks: { [matchType in MatchType]: string };
  matchesPlayed: number;
}

export type MatchType = 'single' | 'double';

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
    title: 'Rank',
    dataIndex: '',
    render: (_, __, index) => index + 1,
  },

  {
    title: 'Player',
    dataIndex: 'name',
    render: (val: string | undefined, row) => val || row.email,
    width: 'auto',
  },
  {
    title: 'Single',
    dataIndex: 'ranks.single',
    sorted: 'descending',
    sorter: (a, b) => sortRank(a, b, 'single'),
  },
  {
    title: 'Double',
    dataIndex: 'ranks.double',
    sorter: (a, b) => sortRank(a, b, 'double'),
  },
  {
    title: 'Matches',
    dataIndex: 'matchesPlayed',
    align: 'center',
  },
];

function sortRank(a: Player, b: Player, matchType: MatchType) {
  const [divisonA, tierA, uncertaintyA] = a.ranks[matchType].split(' ');
  const [divisonB, tierB, uncertaintyB] = b.ranks[matchType].split(' ');

  const divisionToInt: { [div in string]: number } = {
    Bronze: 0,
    Silver: 1,
    Gold: 2,
    Platinum: 3,
    Diamond: 4,
  };

  if (uncertaintyA !== uncertaintyB) {
    if (!uncertaintyA) {
      return 1;
    }
    if (!uncertaintyB) {
      return -1;
    }
    return uncertaintyB.length - uncertaintyA.length;
  }

  if (divisonA !== divisonB) {
    return (divisionToInt[divisonA] || 0) - (divisionToInt[divisonB] || 0);
  }

  if (Number(tierA) !== Number(tierB)) {
    return Number(tierA) - Number(tierB);
  }

  return a.matchesPlayed - b.matchesPlayed;
}
