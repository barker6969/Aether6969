import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  buildBridgeUrl,
  DEFAULT_BRIDGE_HOST,
  DEFAULT_BRIDGE_PORT,
} from "../lib/bridgeMethods";

type BridgeStatus = "offline" | "connecting" | "connected";

type HelloInfo = {
  name?: string;
  version?: string;
  bridge?: string;
  mtkclient?: string | null;
  heimdall?: string | null;
  capabilities?: string[];
};

type EventParams = {
  job_id?: string;
  stream?: string;
  line?: string;
  exit_code?: number;
};

type Ctx = {
  status: BridgeStatus;
  info: HelloInfo | null;
  host: string;
  port: string;
  enabled: boolean;
  url: string;
  setHost: (h: string) => void;
  setPort: (p: string) => void;
  setEnabled: (e: boolean) => void;
  saveSettings: () => Promise<void>;
  connectNow: () => void;
  call: (method: string, params?: Record<string, unknown>) => Promise<any>;
  runJob: (
    method: string,
    params: Record<string, unknown>,
    onEvent?: (ev: EventParams) => void
  ) => Promise<number>;
  listDevices: () => Promise<any>;
};

const CliBridgeContext = createContext<Ctx | null>(null);

const KEYS = {
  host: "aether.bridge.host",
  port: "aether.bridge.port",
  enabled: "aether.bridge.enabled",
};

let rpcId = 0;

export function CliBridgeProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<BridgeStatus>("offline");
  const [info, setInfo] = useState<HelloInfo | null>(null);
  const [host, setHost] = useState(DEFAULT_BRIDGE_HOST);
  const [port, setPort] = useState(DEFAULT_BRIDGE_PORT);
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const pendingRef = useRef(new Map<number, (v: any) => void>());
  const jobSubsRef = useRef(new Map<string, (ev: EventParams) => void>());
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hostRef = useRef(host);
  const portRef = useRef(port);
  const enabledRef = useRef(enabled);
  hostRef.current = host;
  portRef.current = port;
  enabledRef.current = enabled;

  const url = buildBridgeUrl(host, port);

  useEffect(() => {
    (async () => {
      try {
        const [h, p, e] = await Promise.all([
          AsyncStorage.getItem(KEYS.host),
          AsyncStorage.getItem(KEYS.port),
          AsyncStorage.getItem(KEYS.enabled),
        ]);
        if (h) setHost(h);
        if (p) setPort(p);
        if (e === "1") setEnabled(true);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const saveSettings = useCallback(async () => {
    await AsyncStorage.multiSet([
      [KEYS.host, host],
      [KEYS.port, port],
      [KEYS.enabled, enabled ? "1" : "0"],
    ]);
  }, [host, port, enabled]);

  const cleanup = useCallback(() => {
    if (reconnectRef.current) {
      clearTimeout(reconnectRef.current);
      reconnectRef.current = null;
    }
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch {
        /* ignore */
      }
      wsRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    if (!enabledRef.current) return;
    cleanup();
    setStatus("connecting");
    const u = buildBridgeUrl(hostRef.current, portRef.current);
    let ws: WebSocket;
    try {
      ws = new WebSocket(u);
    } catch {
      setStatus("offline");
      reconnectRef.current = setTimeout(connect, 5000);
      return;
    }
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("connected");
      const id = ++rpcId;
      ws.send(JSON.stringify({ jsonrpc: "2.0", id, method: "hello", params: {} }));
      pendingRef.current.set(id, (res) => setInfo(res));
    };

    ws.onmessage = (msg) => {
      let payload: any;
      try {
        payload = JSON.parse(String(msg.data));
      } catch {
        return;
      }

      if (payload.id != null && pendingRef.current.has(payload.id)) {
        const cb = pendingRef.current.get(payload.id)!;
        pendingRef.current.delete(payload.id);
        cb(payload.result ?? payload.error);
        return;
      }

      if (payload.method === "event" && payload.params?.job_id) {
        const sub = jobSubsRef.current.get(payload.params.job_id);
        if (sub) {
          sub(payload.params);
          if (payload.params.stream === "done") {
            jobSubsRef.current.delete(payload.params.job_id);
          }
        }
      }
    };

    ws.onerror = () => {
      /* onclose handles reconnect */
    };

    ws.onclose = () => {
      setStatus("offline");
      setInfo(null);
      wsRef.current = null;
      for (const cb of pendingRef.current.values()) cb({ error: "CLI offline" });
      pendingRef.current.clear();
      for (const sub of jobSubsRef.current.values()) {
        sub({ stream: "done", exit_code: -1, line: "bridge disconnected" });
      }
      jobSubsRef.current.clear();
      if (enabledRef.current) {
        reconnectRef.current = setTimeout(connect, 5000);
      }
    };
  }, [cleanup]);

  const connectNow = useCallback(() => {
    if (!enabled) return;
    connect();
  }, [enabled, connect]);

  useEffect(() => {
    if (!ready) return;
    if (!enabled) {
      cleanup();
      setStatus("offline");
      setInfo(null);
      return;
    }
    connect();
    return cleanup;
  }, [ready, enabled, host, port, connect, cleanup]);

  const call = useCallback((method: string, params: Record<string, unknown> = {}) => {
    return new Promise((resolve, reject) => {
      const ws = wsRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        reject(new Error("CLI offline"));
        return;
      }
      const id = ++rpcId;
      pendingRef.current.set(id, resolve);
      ws.send(JSON.stringify({ jsonrpc: "2.0", id, method, params }));
      setTimeout(() => {
        if (pendingRef.current.has(id)) {
          pendingRef.current.delete(id);
          reject(new Error("CLI timeout"));
        }
      }, 12000);
    });
  }, []);

  const runJob = useCallback(
    (
      method: string,
      params: Record<string, unknown>,
      onEvent?: (ev: EventParams) => void
    ) => {
      return new Promise<number>((resolve, reject) => {
        (async () => {
          try {
            const res: any = await call(method, params);
            if (!res?.job_id) {
              reject(new Error(res?.message || "job did not start"));
              return;
            }
            const jobId = res.job_id as string;
            jobSubsRef.current.set(jobId, (ev) => {
              try {
                onEvent?.(ev);
              } catch {
                /* ignore */
              }
              if (ev.stream === "done") {
                resolve(typeof ev.exit_code === "number" ? ev.exit_code : -1);
              }
            });
          } catch (e) {
            reject(e);
          }
        })();
      });
    },
    [call]
  );

  const listDevices = useCallback(() => call("devices", {}), [call]);

  const value = useMemo(
    () => ({
      status,
      info,
      host,
      port,
      enabled,
      url,
      setHost,
      setPort,
      setEnabled,
      saveSettings,
      connectNow,
      call,
      runJob,
      listDevices,
    }),
    [
      status,
      info,
      host,
      port,
      enabled,
      url,
      saveSettings,
      connectNow,
      call,
      runJob,
      listDevices,
    ]
  );

  return (
    <CliBridgeContext.Provider value={value}>{children}</CliBridgeContext.Provider>
  );
}

export function useCliBridge() {
  const ctx = useContext(CliBridgeContext);
  if (!ctx) throw new Error("useCliBridge outside provider");
  return ctx;
}
