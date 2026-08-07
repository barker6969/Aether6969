import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
  TextInput,
  Switch,
  ScrollView,
} from "react-native";
import { colors } from "../theme";
import { useAppState } from "../context/AppState";
import { useCliBridge } from "../context/CliBridgeContext";
import { DESKTOP_RELEASE } from "../data/services";

export function SettingsScreen() {
  const { credits, loggedIn, login, logout, pushLog } = useAppState();
  const bridge = useCliBridge();
  const [busy, setBusy] = useState(false);

  const onSave = async () => {
    await bridge.saveSettings();
    pushLog("INFO", `Bridge settings saved · ${bridge.url} · enabled=${bridge.enabled}`);
    if (bridge.enabled) bridge.connectNow();
  };

  const onScanDevices = async () => {
    setBusy(true);
    try {
      const res = await bridge.listDevices();
      const list = res?.devices || [];
      pushLog("SUCCESS", `devices: ${list.length} USB entries`);
      list.slice(0, 12).forEach((d: any) => {
        pushLog(
          d.repair_mode ? "SUCCESS" : "INFO",
          `${d.vid}:${d.pid}${d.repair_mode ? " ← " + d.repair_mode : ""}`
        );
      });
    } catch (e: any) {
      pushLog("ERROR", e?.message || String(e));
    } finally {
      setBusy(false);
    }
  };

  const statusColor =
    bridge.status === "connected"
      ? colors.green
      : bridge.status === "connecting"
        ? colors.yellow
        : colors.muted;

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.kicker}>SETTINGS</Text>

      <Text style={styles.section}>CLI BRIDGE (LAN)</Text>
      <Text style={styles.hint}>
        On the PC: aether-cli serve --addr 0.0.0.0:8765 — then set host to the PC’s
        Wi‑Fi IP (same network as the phone).
      </Text>

      <Text style={styles.label}>HOST</Text>
      <TextInput
        style={styles.input}
        value={bridge.host}
        onChangeText={bridge.setHost}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="192.168.1.20"
        placeholderTextColor={colors.muted2}
      />

      <Text style={styles.label}>PORT</Text>
      <TextInput
        style={styles.input}
        value={bridge.port}
        onChangeText={bridge.setPort}
        keyboardType="number-pad"
        placeholder="8765"
        placeholderTextColor={colors.muted2}
      />

      <View style={styles.switchRow}>
        <Text style={styles.row}>Enable bridge</Text>
        <Switch
          value={bridge.enabled}
          onValueChange={bridge.setEnabled}
          trackColor={{ true: colors.green, false: colors.border }}
          thumbColor={colors.text}
        />
      </View>

      <Text style={[styles.row, { color: statusColor }]}>
        Status: {bridge.status.toUpperCase()}
      </Text>
      <Text style={styles.muted}>URL: {bridge.url}</Text>
      {bridge.info && (
        <Text style={styles.muted}>
          CLI {bridge.info.version} · bridge v{bridge.info.bridge}
          {bridge.info.mtkclient ? ` · mtk ${bridge.info.mtkclient}` : ""}
          {bridge.info.heimdall ? ` · ${bridge.info.heimdall}` : ""}
        </Text>
      )}

      <Pressable style={styles.btn} onPress={onSave}>
        <Text style={styles.btnText}>SAVE & CONNECT</Text>
      </Pressable>

      <Pressable
        style={[styles.btn, bridge.status !== "connected" && styles.btnDisabled]}
        disabled={bridge.status !== "connected" || busy}
        onPress={onScanDevices}
      >
        <Text style={styles.btnText}>{busy ? "SCANNING…" : "PROBE USB DEVICES"}</Text>
      </Pressable>

      <Text style={styles.section}>ACCOUNT</Text>
      <Text style={styles.row}>
        {loggedIn ? "demo@aether.dev" : "Signed out"} · {credits} credits
      </Text>
      <Pressable style={styles.btn} onPress={() => (loggedIn ? logout() : login())}>
        <Text style={styles.btnText}>{loggedIn ? "SIGN OUT" : "SIGN IN"}</Text>
      </Pressable>

      <Pressable style={styles.btn} onPress={() => Linking.openURL(DESKTOP_RELEASE)}>
        <Text style={styles.btnText}>DESKTOP RELEASES</Text>
      </Pressable>

      <Pressable
        style={styles.btn}
        onPress={() => Linking.openURL("https://github.com/barker6969/Aether6969")}
      >
        <Text style={styles.btnText}>GITHUB MONOREPO</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, padding: 16 },
  kicker: {
    color: colors.muted,
    fontSize: 10,
    letterSpacing: 3,
    fontFamily: "monospace",
    marginBottom: 16,
  },
  section: {
    color: colors.green,
    fontSize: 10,
    letterSpacing: 2,
    fontFamily: "monospace",
    marginTop: 16,
    marginBottom: 8,
  },
  hint: { color: colors.muted, fontSize: 12, lineHeight: 18, marginBottom: 12 },
  label: {
    color: colors.muted2,
    fontSize: 10,
    letterSpacing: 2,
    fontFamily: "monospace",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    color: colors.text,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontFamily: "monospace",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  row: { color: colors.text, fontSize: 14, marginBottom: 6 },
  muted: { color: colors.muted, fontSize: 12, marginBottom: 4, fontFamily: "monospace" },
  btn: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.greenDim,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },
  btnDisabled: { opacity: 0.4 },
  btnText: {
    color: colors.green,
    fontSize: 11,
    letterSpacing: 2,
    fontFamily: "monospace",
  },
});
