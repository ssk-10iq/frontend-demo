import type { WsClientMessage, WsServerMessage } from './types';
import { tokenStore } from './client';

const WS_BASE_URL = import.meta.env.VITE_WS_URL ?? 'ws://localhost:3000/api/v1/ws';

type MessageHandler = (msg: WsServerMessage) => void;

/**
 * Typed WebSocket client for the prediction market real-time feed.
 *
 * Usage:
 *   const ws = new WsClient();
 *   ws.onMessage((msg) => { ... });
 *   ws.connect();
 *   ws.subscribeOrderBook(marketId, outcomeId);
 *   ws.subscribeUser();        // requires stored access token
 *   ws.disconnect();
 */
export class WsClient {
  private socket: WebSocket | null = null;
  private handlers: Set<MessageHandler> = new Set();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private readonly reconnectBaseDelayMs = 1_000;
  /** Subscriptions to re-send after reconnect. */
  private pendingSubscriptions: WsClientMessage[] = [];
  private pingTimer: ReturnType<typeof setInterval> | null = null;
  private closed = false;

  /** Register a handler for all incoming server messages. */
  onMessage(handler: MessageHandler): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  /** Open the WebSocket connection. Idempotent — no-op if already open. */
  connect(): void {
    if (this.socket && this.socket.readyState <= WebSocket.OPEN) return;
    this.closed = false;
    this.openSocket();
  }

  /** Close the connection permanently (no reconnect). */
  disconnect(): void {
    this.closed = true;
    this.clearTimers();
    this.socket?.close(1000, 'client disconnect');
    this.socket = null;
  }

  // ---------------------------------------------------------------------------
  // Subscriptions
  // ---------------------------------------------------------------------------

  subscribeOrderBook(marketId: string, outcomeId: string): void {
    this.sendAndRemember({
      type: 'subscribe',
      channel: 'order_book',
      market_id: marketId,
      outcome_id: outcomeId,
    });
  }

  unsubscribeOrderBook(marketId: string, outcomeId: string): void {
    this.forget({ type: 'subscribe', channel: 'order_book', market_id: marketId, outcome_id: outcomeId });
    this.send({ type: 'unsubscribe', channel: 'order_book', market_id: marketId, outcome_id: outcomeId });
  }

  subscribeTrades(marketId: string): void {
    this.sendAndRemember({ type: 'subscribe', channel: 'trades', market_id: marketId });
  }

  unsubscribeTrades(marketId: string): void {
    this.forget({ type: 'subscribe', channel: 'trades', market_id: marketId });
    this.send({ type: 'unsubscribe', channel: 'trades', market_id: marketId });
  }

  subscribeMarket(marketId: string): void {
    this.sendAndRemember({ type: 'subscribe', channel: 'market', market_id: marketId });
  }

  unsubscribeMarket(marketId: string): void {
    this.forget({ type: 'subscribe', channel: 'market', market_id: marketId });
    this.send({ type: 'unsubscribe', channel: 'market', market_id: marketId });
  }

  /**
   * Subscribe to private user events (position_update, balance_update).
   * Reads the current access token from tokenStore automatically.
   */
  subscribeUser(): void {
    const token = tokenStore.getAccess();
    if (!token) {
      console.warn('[WsClient] subscribeUser called but no access token is stored');
      return;
    }
    this.sendAndRemember({ type: 'subscribe', channel: 'user', token });
  }

  unsubscribeUser(): void {
    this.pendingSubscriptions = this.pendingSubscriptions.filter(
      (s) => !(s.type === 'subscribe' && s.channel === 'user'),
    );
    this.send({ type: 'unsubscribe', channel: 'user' });
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private openSocket(): void {
    const socket = new WebSocket(WS_BASE_URL);
    this.socket = socket;

    socket.onopen = () => {
      this.reconnectAttempts = 0;
      this.startPing();
      // Re-subscribe to all active channels (replacing stale user token if needed).
      for (const sub of this.pendingSubscriptions) {
        const msg =
          sub.type === 'subscribe' && sub.channel === 'user'
            ? { ...sub, token: tokenStore.getAccess() ?? '' }
            : sub;
        this.send(msg);
      }
    };

    socket.onmessage = (event: MessageEvent<string>) => {
      let msg: WsServerMessage;
      try {
        msg = JSON.parse(event.data) as WsServerMessage;
      } catch {
        return;
      }
      this.handlers.forEach((h) => h(msg));
    };

    socket.onerror = () => {
      // onerror is always followed by onclose; handle reconnect there.
    };

    socket.onclose = (event) => {
      this.clearPing();
      if (this.closed || event.code === 1000) return;
      this.scheduleReconnect();
    };
  }

  private send(msg: WsClientMessage): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(msg));
    }
  }

  /** Send and remember for reconnect replay. */
  private sendAndRemember(msg: WsClientMessage): void {
    // Deduplicate by channel key before storing.
    const key = this.subKey(msg);
    this.pendingSubscriptions = this.pendingSubscriptions.filter(
      (s) => this.subKey(s) !== key,
    );
    this.pendingSubscriptions.push(msg);
    this.send(msg);
  }

  /** Remove a subscription from the replay list. */
  private forget(msg: WsClientMessage): void {
    const key = this.subKey(msg);
    this.pendingSubscriptions = this.pendingSubscriptions.filter(
      (s) => this.subKey(s) !== key,
    );
  }

  private subKey(msg: WsClientMessage): string {
    if (msg.type !== 'subscribe' && msg.type !== 'unsubscribe') return '';
    const parts: string[] = [msg.channel as string];
    if ('market_id' in msg && msg.market_id) parts.push(msg.market_id as string);
    if ('outcome_id' in msg && msg.outcome_id) parts.push(msg.outcome_id as string);
    return parts.join(':');
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[WsClient] max reconnect attempts reached');
      return;
    }
    const delay = this.reconnectBaseDelayMs * 2 ** this.reconnectAttempts;
    this.reconnectAttempts += 1;
    this.reconnectTimer = setTimeout(() => {
      if (!this.closed) this.openSocket();
    }, delay);
  }

  private startPing(): void {
    this.pingTimer = setInterval(() => {
      this.send({ type: 'ping' });
    }, 30_000);
  }

  private clearPing(): void {
    if (this.pingTimer !== null) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
  }

  private clearTimers(): void {
    this.clearPing();
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
}
