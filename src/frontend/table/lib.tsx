import { SuperTableColumn } from './supertable/superTable';

export interface Player {
  _id: string;
  email: string;
  ratings: {
    single: number;
    double: number;
  };
  name: string;
  masterRating: number;
}

export interface PlayerProps {
  players: Player[];
  matchType: string;
  reload: Function;
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
  },
  {
    title: 'Double Rating',
    dataIndex: 'ratings.double',
    width: 'auto',
  },
  {
    title: 'Master Rating',
    dataIndex: 'masterRating',
    width: 'auto',
    sorted: 'descending',
  },
];
