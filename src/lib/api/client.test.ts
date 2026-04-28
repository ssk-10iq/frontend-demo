import { describe, it, expect, beforeEach } from 'vitest';
import { tokenStore } from './client';

describe('tokenStore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('getAccess returns null when nothing is stored', () => {
    expect(tokenStore.getAccess()).toBeNull();
  });

  it('getRefresh returns null when nothing is stored', () => {
    expect(tokenStore.getRefresh()).toBeNull();
  });

  it('set stores both access and refresh tokens', () => {
    tokenStore.set('access-abc', 'refresh-xyz');
    expect(tokenStore.getAccess()).toBe('access-abc');
    expect(tokenStore.getRefresh()).toBe('refresh-xyz');
  });

  it('clear removes both tokens', () => {
    tokenStore.set('access-abc', 'refresh-xyz');
    tokenStore.clear();
    expect(tokenStore.getAccess()).toBeNull();
    expect(tokenStore.getRefresh()).toBeNull();
  });

  it('set overwrites previously stored tokens', () => {
    tokenStore.set('old-access', 'old-refresh');
    tokenStore.set('new-access', 'new-refresh');
    expect(tokenStore.getAccess()).toBe('new-access');
    expect(tokenStore.getRefresh()).toBe('new-refresh');
  });

  it('stores tokens under the expected localStorage keys', () => {
    tokenStore.set('a', 'r');
    expect(localStorage.getItem('pm_access_token')).toBe('a');
    expect(localStorage.getItem('pm_refresh_token')).toBe('r');
  });
});
