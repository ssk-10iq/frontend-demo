import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WsClient } from './ws';

// ── Mock WebSocket ────────────────────────────────────────────────────────────

class MockWebSocket {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;

  static instances: MockWebSocket[] = [];

  readyState = MockWebSocket.CONNECTING;
  readonly url: string;
  sentMessages: string[] = [];

  onopen: ((ev: Event) => void) | null = null;
  onmessage: ((ev: MessageEvent) => void) | null = null;
  onerror: ((ev: Event) => void) | null = null;
  onclose: ((ev: CloseEvent) => void) | null = null;

  constructor(url: string) {
    this.url = url;
    MockWebSocket.instances.push(this);
  }

  send(data: string): void {
    this.sentMessages.push(data);
  }

  close(code = 1000): void {
    this.readyState = MockWebSocket.CLOSED;
    this.onclose?.({ code, wasClean: code === 1000 } as CloseEvent);
  }

  // Simulate server-side events
  simulateOpen(): void {
    this.readyState = MockWebSocket.OPEN;
    this.onopen?.(new Event('open'));
  }

  simulateMessage(data: object): void {
    this.onmessage?.(new MessageEvent('message', { data: JSON.stringify(data) }));
  }

  simulateClose(code = 1001): void {
    this.readyState = MockWebSocket.CLOSED;
    this.onclose?.({ code, wasClean: code === 1000 } as CloseEvent);
  }
}

vi.stubGlobal('WebSocket', MockWebSocket);

// ── Mock tokenStore ───────────────────────────────────────────────────────────

vi.mock('./client', () => ({
  tokenStore: {
    getAccess: vi.fn(() => 'mock-access-token'),
    getRefresh: vi.fn(() => null),
    set: vi.fn(),
    clear: vi.fn(),
  },
}));

import { tokenStore } from './client';

// ── Helpers ───────────────────────────────────────────────────────────────────

function lastSocket(): MockWebSocket {
  return MockWebSocket.instances[MockWebSocket.instances.length - 1];
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('WsClient', () => {
  let client: WsClient;

  beforeEach(() => {
    MockWebSocket.instances = [];
    vi.useFakeTimers();
    client = new WsClient();
  });

  afterEach(() => {
    client.disconnect();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  // ── connect ─────────────────────────────────────────────────────────────────

  describe('connect()', () => {
    it('creates a WebSocket', () => {
      client.connect();
      expect(MockWebSocket.instances).toHaveLength(1);
    });

    it('uses the WS base URL', () => {
      client.connect();
      expect(lastSocket().url).toContain('ws://');
    });

    it('is idempotent — a second call does not open another socket', () => {
      client.connect();
      client.connect();
      expect(MockWebSocket.instances).toHaveLength(1);
    });
  });

  // ── subscriptions ────────────────────────────────────────────────────────────

  describe('subscribeOrderBook()', () => {
    it('sends the correct subscribe message', () => {
      client.connect();
      lastSocket().simulateOpen();

      client.subscribeOrderBook('0xmarket', '0xoutcome');

      expect(JSON.parse(lastSocket().sentMessages[0])).toEqual({
        type: 'subscribe',
        channel: 'order_book',
        market_id: '0xmarket',
        outcome_id: '0xoutcome',
      });
    });
  });

  describe('subscribeTrades()', () => {
    it('sends the correct subscribe message', () => {
      client.connect();
      lastSocket().simulateOpen();

      client.subscribeTrades('0xmarket');

      expect(JSON.parse(lastSocket().sentMessages[0])).toEqual({
        type: 'subscribe',
        channel: 'trades',
        market_id: '0xmarket',
      });
    });
  });

  describe('subscribeMarket()', () => {
    it('sends the correct subscribe message', () => {
      client.connect();
      lastSocket().simulateOpen();

      client.subscribeMarket('0xmarket');

      expect(JSON.parse(lastSocket().sentMessages[0])).toEqual({
        type: 'subscribe',
        channel: 'market',
        market_id: '0xmarket',
      });
    });
  });

  describe('subscribeUser()', () => {
    it('sends a subscribe user message with the stored access token', () => {
      client.connect();
      lastSocket().simulateOpen();

      client.subscribeUser();

      expect(JSON.parse(lastSocket().sentMessages[0])).toEqual({
        type: 'subscribe',
        channel: 'user',
        token: 'mock-access-token',
      });
    });

    it('logs a warning and sends nothing when no token is stored', () => {
      vi.mocked(tokenStore.getAccess).mockReturnValueOnce(null);
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

      client.connect();
      lastSocket().simulateOpen();
      client.subscribeUser();

      expect(lastSocket().sentMessages).toHaveLength(0);
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('no access token'));
      warn.mockRestore();
    });
  });

  describe('unsubscribeOrderBook()', () => {
    it('sends the correct unsubscribe message', () => {
      client.connect();
      lastSocket().simulateOpen();
      client.subscribeOrderBook('0xmarket', '0xoutcome');

      client.unsubscribeOrderBook('0xmarket', '0xoutcome');

      const lastMsg = JSON.parse(
        lastSocket().sentMessages[lastSocket().sentMessages.length - 1],
      );
      expect(lastMsg).toEqual({
        type: 'unsubscribe',
        channel: 'order_book',
        market_id: '0xmarket',
        outcome_id: '0xoutcome',
      });
    });
  });

  // ── onMessage ────────────────────────────────────────────────────────────────

  describe('onMessage()', () => {
    it('calls the registered handler with the parsed server message', () => {
      const handler = vi.fn();
      client.onMessage(handler);
      client.connect();
      lastSocket().simulateOpen();

      lastSocket().simulateMessage({ type: 'pong' });

      expect(handler).toHaveBeenCalledWith({ type: 'pong' });
    });

    it('returns an unsubscribe function that removes the handler', () => {
      const handler = vi.fn();
      const unsub = client.onMessage(handler);
      unsub();

      client.connect();
      lastSocket().simulateOpen();
      lastSocket().simulateMessage({ type: 'pong' });

      expect(handler).not.toHaveBeenCalled();
    });

    it('silently ignores non-JSON server messages', () => {
      const handler = vi.fn();
      client.onMessage(handler);
      client.connect();
      lastSocket().simulateOpen();

      const ws = lastSocket();
      ws.onmessage?.(new MessageEvent('message', { data: 'not-json' }));

      expect(handler).not.toHaveBeenCalled();
    });
  });

  // ── disconnect ───────────────────────────────────────────────────────────────

  describe('disconnect()', () => {
    it('closes the WebSocket', () => {
      client.connect();
      lastSocket().simulateOpen();

      client.disconnect();

      expect(lastSocket().readyState).toBe(MockWebSocket.CLOSED);
    });

    it('does not reconnect after an explicit disconnect', () => {
      client.connect();
      lastSocket().simulateOpen();

      client.disconnect();
      vi.advanceTimersByTime(10_000);

      // No new socket created
      expect(MockWebSocket.instances).toHaveLength(1);
    });
  });

  // ── reconnect ────────────────────────────────────────────────────────────────

  describe('reconnect on unexpected close', () => {
    it('creates a new socket after a non-1000 close', () => {
      client.connect();
      lastSocket().simulateOpen();
      lastSocket().simulateClose(1006);

      // First attempt: 1000ms * 2^0 = 1s
      vi.advanceTimersByTime(1_001);

      expect(MockWebSocket.instances).toHaveLength(2);
    });

    it('replays active subscriptions on the new socket', () => {
      client.connect();
      const ws1 = lastSocket();
      ws1.simulateOpen();

      client.subscribeTrades('0xmkt');
      ws1.simulateClose(1006);

      vi.advanceTimersByTime(1_001);

      const ws2 = lastSocket();
      ws2.simulateOpen();

      const replayed = ws2.sentMessages.some((m) => {
        const parsed = JSON.parse(m);
        return parsed.type === 'subscribe' && parsed.channel === 'trades' && parsed.market_id === '0xmkt';
      });
      expect(replayed).toBe(true);
    });

    it('does not reconnect after a clean close (code 1000)', () => {
      client.connect();
      lastSocket().simulateOpen();
      lastSocket().simulateClose(1000);

      vi.advanceTimersByTime(5_000);

      expect(MockWebSocket.instances).toHaveLength(1);
    });
  });
});
