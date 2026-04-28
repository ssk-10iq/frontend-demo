import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getNonce, verify, refresh, signOut } from './auth';

vi.mock('./client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
  tokenStore: {
    set: vi.fn(),
    clear: vi.fn(),
    getAccess: vi.fn(() => null),
    getRefresh: vi.fn(() => null),
  },
}));

import { apiClient, tokenStore } from './client';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getNonce', () => {
  it('calls GET /auth/nonce with the wallet address as a query param', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: { nonce: 'nonce-abc', message: 'Sign this' },
    });

    const result = await getNonce('0x1234');

    expect(apiClient.get).toHaveBeenCalledWith('/auth/nonce', {
      params: { address: '0x1234' },
    });
    expect(result).toEqual({ nonce: 'nonce-abc', message: 'Sign this' });
  });
});

describe('verify', () => {
  it('calls POST /auth/verify with the request body', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      data: { access_token: 'at-1', refresh_token: 'rt-1' },
    });

    const body = { address: '0xabc', signature: '0xsig' };
    await verify(body);

    expect(apiClient.post).toHaveBeenCalledWith('/auth/verify', body);
  });

  it('stores the returned tokens in tokenStore', async () => {
    const tokens = { access_token: 'at-1', refresh_token: 'rt-1' };
    vi.mocked(apiClient.post).mockResolvedValue({ data: tokens });

    await verify({ address: '0xabc', signature: '0xsig' });

    expect(tokenStore.set).toHaveBeenCalledWith('at-1', 'rt-1');
  });

  it('returns the token payload', async () => {
    const tokens = { access_token: 'at-1', refresh_token: 'rt-1' };
    vi.mocked(apiClient.post).mockResolvedValue({ data: tokens });

    const result = await verify({ address: '0xabc', signature: '0xsig' });
    expect(result).toEqual(tokens);
  });
});

describe('refresh', () => {
  it('calls POST /auth/refresh with the refresh token body', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      data: { access_token: 'new-at', refresh_token: 'new-rt' },
    });

    await refresh({ refresh_token: 'old-rt' });

    expect(apiClient.post).toHaveBeenCalledWith('/auth/refresh', {
      refresh_token: 'old-rt',
    });
  });

  it('updates stored tokens with the new pair', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      data: { access_token: 'new-at', refresh_token: 'new-rt' },
    });

    await refresh({ refresh_token: 'old-rt' });

    expect(tokenStore.set).toHaveBeenCalledWith('new-at', 'new-rt');
  });
});

describe('signOut', () => {
  it('clears stored tokens', () => {
    signOut();
    expect(tokenStore.clear).toHaveBeenCalledOnce();
  });
});
