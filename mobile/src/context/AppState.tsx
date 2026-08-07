import React, { createContext, useContext, useMemo, useState, useCallback } from "react";

export type LogLine = { id: string; level: string; text: string; at: number };

type Ctx = {
  credits: number;
  loggedIn: boolean;
  logs: LogLine[];
  login: () => void;
  logout: () => void;
  pushLog: (level: string, text: string) => void;
  clearLogs: () => void;
  runDemoAction: (label: string, desktopOnly?: boolean) => void;
};

const AppStateContext = createContext<Ctx | null>(null);

let seq = 0;

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [credits] = useState(100);
  const [loggedIn, setLoggedIn] = useState(true);
  const [logs, setLogs] = useState<LogLine[]>([
    {
      id: "0",
      level: "INFO",
      text: "Aether Mobile companion ready · USB ops use desktop CLI",
      at: Date.now(),
    },
  ]);

  const pushLog = useCallback((level: string, text: string) => {
    seq += 1;
    setLogs((prev) =>
      [{ id: String(seq), level, text, at: Date.now() }, ...prev].slice(0, 200)
    );
  }, []);

  const clearLogs = useCallback(() => setLogs([]), []);

  const runDemoAction = useCallback(
    (label: string, desktopOnly?: boolean) => {
      pushLog("INFO", `>>> ${label}`);
      if (desktopOnly) {
        pushLog(
          "WARN",
          "Live USB requires Aether desktop + aether-cli on the workstation."
        );
        pushLog(
          "INFO",
          "Open desktop-v0.1.0 release · run aether-cli serve for the bridge."
        );
        return;
      }
      pushLog("SUCCESS", `${label} complete (mobile demo).`);
    },
    [pushLog]
  );

  const value = useMemo(
    () => ({
      credits,
      loggedIn,
      logs,
      login: () => setLoggedIn(true),
      logout: () => setLoggedIn(false),
      pushLog,
      clearLogs,
      runDemoAction,
    }),
    [credits, loggedIn, logs, pushLog, clearLogs, runDemoAction]
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
