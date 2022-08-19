import { SuperTableColumn } from '../supertable/superTable';

export interface Player {
  _id: string;
  email: string;
  ratings: {
    single: number;
    double: number;
  };
  name: string;
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
