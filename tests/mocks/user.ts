import type { TUser } from '../../src/utils/types';

export const mockUser: TUser = {
  email: 'test@test.com',
  name: 'Test'
};

export const mockAuthenticatedResponse = {
  success: true,
  user: mockUser
};

export const mockUnauthenticatedResponse = {
  success: false,
  message: 'Not authenticated'
};