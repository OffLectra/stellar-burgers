import { TOrder } from '@utils-types';

export type FeedInfoUIProps = {
  total: number;
  totalToday: number;
  orders: TOrder[];
  readyOrders: number[];
  pendingOrders: number[];
};

export type HalfColumnProps = {
  orders: number[];
  title: string;
  textColor?: string;
};

export type TColumnProps = {
  title: string;
  content: number;
};
