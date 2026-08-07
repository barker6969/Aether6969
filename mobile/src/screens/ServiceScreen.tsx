import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { colors } from "../theme";
import { PLATFORMS, type PlatformId } from "../data/services";
import { useAppState } from "../context/AppState";
import { useCliBridge } from "../context/CliBridgeContext";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<
  { Service: { platformId: PlatformId } },
  "Service"
>;

export function ServiceScreen({ route }: Props) {
  const { platformId } = route.params;
  const platform = useMemo(
    () => PLATFORMS.find((p) => p.id === platformId) ?? PLATFORMS[0],
    [platformId]
  );
  const { runAction, activeAction } = useAppState();
  const bridge = useCliBridge();

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.kicker}>{platform.title.toUpperCase()} MODULE</Text>
      <Text style={styles.sub}>{platform.subtitle}</Text>

      <View
        style={[
          styles.banner,
          bridge.status === "connected" && styles.bannerLive,
        ]}
      >
        <Text style={styles.bannerText}>
          Bridge: {bridge.status.toUpperCase()}
          {bridge.status === "connected"
            ? " · taps run live aether-cli jobs"
            : " · enable in Settings (PC LAN IP + serve --addr 0.0.0.0:8765)"}
        </Text>
      </View>

      {platform.actions.map((a) => (
        <Pressable
          key={a.key}
          style={[
            styles.card,
            a.danger && styles.dangerCard,
            activeAction === a.label && styles.activeCard,
          ]}
          disabled={!!activeAction}
          onPress={() => runAction(a.key, a.label, a.desktopOnly)}
        >
          <View style={styles.cardTop}>
            <Text style={styles.cardTitle}>{a.label}</Text>
            <Text
              style={[
                styles.cost,
                a.cost === "Free" && { color: colors.green },
              ]}
            >
              {a.cost}
            </Text>
          </View>
          <Text style={styles.desc}>{a.desc}</Text>
          {activeAction === a.label ? (
            <Text style={styles.deskTag}>RUNNING…</Text>
          ) : (
            a.desktopOnly && (
              <Text style={styles.deskTag}>
                {bridge.status === "connected" ? "LIVE VIA BRIDGE" : "NEEDS BRIDGE"}
              </Text>
            )
          )}
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 40 },
  kicker: {
    color: colors.green,
    fontSize: 11,
    letterSpacing: 2,
    fontFamily: "monospace",
    marginBottom: 6,
  },
  sub: { color: colors.muted, fontSize: 13, marginBottom: 14 },
  banner: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    padding: 12,
    marginBottom: 14,
  },
  bannerLive: {
    borderColor: colors.borderStrong,
    backgroundColor: colors.greenDim,
  },
  bannerText: { color: colors.muted, fontSize: 12, lineHeight: 18 },
  card: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 10,
  },
  dangerCard: { borderColor: "rgba(248,113,113,0.35)" },
  activeCard: { borderColor: colors.borderStrong },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: { color: colors.text, fontSize: 15, fontWeight: "600", flex: 1 },
  cost: {
    color: colors.muted,
    fontSize: 10,
    fontFamily: "monospace",
    letterSpacing: 1,
  },
  desc: { color: colors.muted, fontSize: 12, marginTop: 6, lineHeight: 17 },
  deskTag: {
    marginTop: 10,
    color: colors.yellow,
    fontSize: 9,
    fontFamily: "monospace",
    letterSpacing: 2,
  },
});
