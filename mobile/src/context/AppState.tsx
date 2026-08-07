import React, { createContext, useContext, useMemo, useState, useCallback } from "react";
import { useCliBridge } from "./CliBridgeContext";
import { BRIDGE_METHODS } from "../lib/bridgeMethods";

export type LogLine = { id: string; level: string; text: string; at: number };

type Ctx = {
  credits: number;
  loggedIn: boolean;
  logs: LogLine[];
  activeAction: string | null;
  login: () => void;
  logout: () => void;
  pushLog: (level: string, text: string) => void;
  clearLogs: () => void;
  /** Run action: live bridge job if mapped + connected, else guidance. */
  runAction: (key: string, label: string, desktopOnly?: boolean) => void;
};

const AppStateContext = createContext<Ctx | null>(null);

let seq = 0;

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const bridge = useCliBridge();
  const [credits] = useState(100);
  const [loggedIn, setLoggedIn] = useState(true);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogLine[]>([
    {
      id: "0",
      level: "INFO",
      text: "Aether Mobile · set bridge host in Settings → enable · aether-cli serve --addr 0.0.0.0:8765",
      at: Date.now(),
    },
  ]);

  const pushLog = useCallback((level: string, text: string) => {
    seq += 1;
    setLogs((prev) =>
      [{ id: String(seq), level, text, at: Date.now() }, ...prev].slice(0, 300)
    );
  }, []);

  const clearLogs = useCallback(() => setLogs([]), []);

  const runAction = useCallback(
    (key: string, label: string, desktopOnly?: boolean) => {
      if (activeAction) return;

      const map = BRIDGE_METHODS[key];
      if (map && bridge.status === "connected") {
        setActiveAction(label);
        pushLog("INFO", `>>> EXECUTING (LIVE): ${label}`);
        pushLog("INFO", `aether-cli → ${map.method}`);
        bridge
          .runJob(map.method, { ...(map.params || {}) }, (ev) => {
            if (ev.stream === "stdout" && ev.line) pushLog("INFO", ev.line);
            else if (ev.stream === "stderr" && ev.line) pushLog("WARN", ev.line);
            else if (ev.stream === "done") {
              if (ev.exit_code === 0) {
                pushLog("SUCCESS", `${label} completed (exit 0).`);
              } else {
                pushLog("ERROR", `${label} failed (exit ${ev.exit_code}).`);
              }
              setActiveAction(null);
            }
          })
          .catch((e: any) => {
            pushLog("ERROR", `bridge error: ${e?.message || e}`);
            setActiveAction(null);
          });
        return;
      }

      pushLog("INFO", `>>> ${label}`);
      if (desktopOnly || map) {
        if (bridge.status !== "connected") {
          pushLog(
            "WARN",
            "Bridge offline. On PC: aether-cli serve --addr 0.0.0.0:8765"
          );
          pushLog(
            "INFO",
            `Settings → host = your PC LAN IP · enable bridge · URL ${bridge.url}`
          );
        } else if (!map) {
          pushLog("WARN", "No live RPC mapping for this action yet.");
        }
        return;
      }
      pushLog("SUCCESS", `${label} complete (mobile).`);
    },
    [activeAction, bridge, pushLog]
  );

  const value = useMemo(
    () => ({
      credits,
      loggedIn,
      logs,
      activeAction,
      login: () => setLoggedIn(true),
      logout: () => setLoggedIn(false),
      pushLog,
      clearLogs,
      runAction,
    }),
    [credits, loggedIn, logs, activeAction, pushLog, clearLogs, runAction]
  );

  return (
    <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState outside provider");
  return ctx;
}
