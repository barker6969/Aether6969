import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
} from "react-native";
import { colors } from "../theme";
import { useAppState } from "../context/AppState";
import { DESKTOP_RELEASE, PLATFORMS } from "../data/services";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export function HomeScreen({ navigation }: Props) {
  const { credits, pushLog } = useAppState();

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.kicker}>AETHER REPAIR · MOBILE</Text>
      <Text style={styles.title}>Technician companion</Text>
      <Text style={styles.sub}>
        Credits, docs, and service catalog on the go. Live USB (BROM / EDL / DFU)
        runs on the desktop suite + aether-cli.
      </Text>

      <View style={styles.row}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>WALLET</Text>
          <Text style={styles.statValue}>{credits} Credits</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>DESKTOP</Text>
          <Text style={[styles.statValue, { fontSize: 14 }]}>v0.1.0</Text>
        </View>
      </View>

      <Pressable
        style={styles.primaryBtn}
        onPress={() => {
          pushLog("INFO", "Opening desktop release page…");
          Linking.openURL(DESKTOP_RELEASE);
        }}
      >
        <Text style={styles.primaryBtnText}>DOWNLOAD DESKTOP (MSI / DMG)</Text>
      </Pressable>

      <Text style={styles.section}>SERVICE MODULES</Text>
      {PLATFORMS.map((p) => (
        <Pressable
          key={p.id}
          style={styles.card}
          onPress={() => navigation.navigate("Service", { platformId: p.id })}
        >
          <Text style={styles.cardTitle}>{p.title}</Text>
          <Text style={styles.cardSub}>{p.subtitle}</Text>
          <Text style={styles.cardMeta}>{p.actions.length} operations</Text>
        </Pressable>
      ))}

      <Pressable
        style={styles.card}
        onPress={() => navigation.navigate("Aegis")}
      >
        <Text style={[styles.cardTitle, { color: colors.green }]}>Aegis Unlock</Text>
        <Text style={styles.cardSub}>
          Android post-reset Google guard · MTK free · Samsung credits
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 40 },
  kicker: {
    color: colors.muted,
    fontSize: 10,
    letterSpacing: 3,
    fontFamily: "monospace",
    marginBottom: 6,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  sub: { color: colors.muted, fontSize: 13, lineHeight: 20, marginBottom: 16 },
  row: { flexDirection: "row", gap: 10, marginBottom: 12 },
  stat: {
    flex: 1,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
  },
  statLabel: {
    color: colors.muted2,
    fontSize: 10,
    letterSpacing: 2,
    fontFamily: "monospace",
  },
  statValue: { color: colors.green, fontSize: 18, fontWeight: "600", marginTop: 4 },
  primaryBtn: {
    backgroundColor: colors.greenDim,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 20,
  },
  primaryBtnText: {
    color: colors.green,
    fontSize: 11,
    letterSpacing: 2,
    fontFamily: "monospace",
    fontWeight: "600",
  },
  section: {
    color: colors.muted,
    fontSize: 10,
    letterSpacing: 3,
    fontFamily: "monospace",
    marginBottom: 10,
  },
  card: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 10,
  },
  cardTitle: { color: colors.text, fontSize: 16, fontWeight: "600" },
  cardSub: { color: colors.muted, fontSize: 12, marginTop: 4 },
  cardMeta: {
    color: colors.green,
    fontSize: 10,
    fontFamily: "monospace",
    marginTop: 8,
    letterSpacing: 1,
  },
});
