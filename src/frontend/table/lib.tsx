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

function rankRender(val: string) {
  const [rank, tier, uncertainty] = val.split(' ');

  return (
    <div>
      <div
        style={{
          textAlign: 'center',
          fontWeight: 'bold',
          color:
            rank[0] === 'B'
              ? '#d86800'
              : rank[0] === 'S'
              ? '#727272'
              : rank[0] === 'G'
              ? '#ffc200'
              : rank[0] === 'P'
              ? '#a4d2d6'
              : '#60ddff',
        }}
      >
        {rank[0] + tier}
      </div>
      {uncertainty && (
        <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <div
            style={{
              height: 4,
              width: 4,
              background: uncertainty.length > 0 ? '#60d0ff' : '#e9e9e9',
            }}
          />
          <div
            style={{
              height: 4,
              width: 4,
              background: uncertainty.length > 1 ? '#60d0ff' : '#e9e9e9',
            }}
          />
          <div
            style={{
              height: 4,
              width: 4,
              background: uncertainty.length > 2 ? '#60d0ff' : '#e9e9e9',
            }}
          />
          <div
            style={{
              fontSize: 10,
              fontWeight: 'bold',
              marginLeft: 2,
              lineHeight: 0,
              color: 'gray',
              marginTop: -1,
            }}
          >
            ?
          </div>
        </div>
      )}
    </div>
  );
}

export const BasicColumns: SuperTableColumn<Player>[] = [
  {
    title: 'Player',
    dataIndex: 'name',
    render: (val: string | undefined, row) => val || row.email,
    width: 'auto',
  },
  {
    title: '1v1',
    dataIndex: 'ranks.single',
    sorted: 'descending',
    sorter: (a, b) => sortRank(a, b, 'single'),
    render: rankRender,
  },
  {
    title: '2v2',
    dataIndex: 'ranks.double',
    sorter: (a, b) => sortRank(a, b, 'double'),
    render: rankRender,
  },
  {
    title: '#',
    dataIndex: 'matchesPlayed',
    align: 'center',
    titleAlign: 'center',
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

export function prettifyTimestamp(timestamp: number) {
  const date = new Date(timestamp);

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear().toString().slice(2);

  return `${hours}:${minutes}:${seconds} ${day}/${month}-${year}`;
}

export interface Session {
  _id: string;
  matchType: 'single' | 'double';
  totalPoints: 10 | 22;
  gameOfMultipleSets: boolean;
  participantsA: Participants;
  participantsB: Participants;
  ratingResults: RatingResult[];
  timestamp: number;
  prettyDate: string;
}

export interface Participants {
  emails: string[];
  numSetsWon: number;
}

export interface RatingResult {
  email: string;
  delta: number;
  newRating: number;
}
