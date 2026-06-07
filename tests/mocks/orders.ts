import type { TNewOrder } from '../../src/utils/burger-api';
import { mockUser } from './user';

export const mockOrder: TNewOrder = {
  _id: 'test-order-123',
  status: 'done',
  name: 'Space burger',
  owner: {
    name: mockUser.name,
    email: mockUser.email,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z'
  },
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
  number: 54321,
  price: 2000
};

export const mockOrderResponse = {
  success: true,
  order: mockOrder,
  name: 'Space burger'
};