import { apiClient } from './client';
import type { User, UpdateUserRequest } from './types';

/**
 * GET /users/me 🔒
 * Returns the authenticated user's profile.
 */
export async function getMe(): Promise<User> {
  const { data } = await apiClient.get<User>('/users/me');
  return data;
}

/**
 * PATCH /users/me 🔒
 * Update the authenticated user's display name, avatar URL, or bio.
 */
export async function updateMe(body: UpdateUserRequest): Promise<User> {
  const { data } = await apiClient.patch<User>('/users/me', body);
  return data;
}

/**
 * GET /users/:address
 * Public profile lookup by wallet address.
 */
export async function getUserByAddress(address: string): Promise<User> {
  const { data } = await apiClient.get<User>(`/users/${address}`);
  return data;
}
