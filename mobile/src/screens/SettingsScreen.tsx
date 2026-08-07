import React from "react";
import { View, Text, StyleSheet, Pressable, Linking } from "react-native";
import { colors } from "../theme";
import { useAppState } from "../context/AppState";
import { DESKTOP_RELEASE } from "../data/services";

export function SettingsScreen() {
  const { credits, loggedIn, login, logout } = useAppState();

  return (
    <View style={styles.root}>
      <Text style={styles.kicker}>SETTINGS</Text>
      <Text style={styles.row}>
        Account: {loggedIn ? "demo@aether.dev" : "Signed out"}
      </Text>
      <Text style={styles.row}>Credits: {credits}</Text>
      <Text style={styles.row}>App: Aether Mobile 0.1.0</Text>
      <Text style={styles.row}>Canonical: barker6969/Aether6969</Text>

      <Pressable
        style={styles.btn}
        onPress={() => (loggedIn ? logout() : login())}
      >
        <Text style={styles.btnText}>{loggedIn ? "SIGN OUT" : "SIGN IN"}</Text>
      </Pressable>

      <Pressable style={styles.btn} onPress={() => Linking.openURL(DESKTOP_RELEASE)}>
        <Text style={styles.btnText}>DESKTOP RELEASES</Text>
      </Pressable>

      <Pressable
        style={styles.btn}
        onPress={() =>
          Linking.openURL("https://github.com/barker6969/Aether6969")
        }
      >
        <Text style={styles.btnText}>GITHUB MONOREPO</Text>
      </Pressable>

      <Text style={styles.note}>
        Mobile does not talk to USB. Pair with desktop + aether-cli serve for live
        bench work.
      </Text>
    </View>
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
  row: { color: colors.text, fontSize: 14, marginBottom: 10 },
  btn: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.greenDim,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },
  btnText: {
    color: colors.green,
    fontSize: 11,
    letterSpacing: 2,
    fontFamily: "monospace",
  },
  note: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 24,
  },
});
