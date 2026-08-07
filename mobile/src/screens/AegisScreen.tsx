import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from "react-native";
import { colors } from "../theme";
import { useAppState } from "../context/AppState";
import { DESKTOP_RELEASE } from "../data/services";

export function AegisScreen() {
  const { runDemoAction } = useAppState();

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.kicker}>AEGIS UNLOCK</Text>
      <Text style={styles.title}>Android account guard</Text>
      <Text style={styles.body}>
        Aegis is Aether’s brand for clearing the post-reset Google account prompt
        on Android (often called FRP in the trade). It is not iPhone passcode
        recovery and not permanent Knox Guard removal.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>MediaTek · Standard (Free)</Text>
        <Text style={styles.cardBody}>
          BROM mode · DA payload · patch guard flag · no full reflash.
        </Text>
        <Pressable
          style={styles.btn}
          onPress={() => runDemoAction("Aegis Unlock (MTK)", true)}
        >
          <Text style={styles.btnText}>RUN ON DESKTOP · MTK</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Samsung · 20 Credits</Text>
        <Text style={styles.cardBody}>
          Download Mode + Heimdall. Best on S9 / Note 9 / older A-series. Knox
          3.x may reject writes.
        </Text>
        <Pressable
          style={styles.btn}
          onPress={() => runDemoAction("Aegis Unlock (Samsung)", true)}
        >
          <Text style={styles.btnText}>RUN ON DESKTOP · SAMSUNG</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Qualcomm · Free</Text>
        <Text style={styles.cardBody}>EDL 9008 path when device is in Sahara.</Text>
        <Pressable
          style={styles.btn}
          onPress={() => runDemoAction("Aegis Unlock (Qualcomm)", true)}
        >
          <Text style={styles.btnText}>RUN ON DESKTOP · QC</Text>
        </Pressable>
      </View>

      <Pressable style={styles.linkBtn} onPress={() => Linking.openURL(DESKTOP_RELEASE)}>
        <Text style={styles.linkText}>Open desktop release</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 40 },
  kicker: {
    color: colors.green,
    fontSize: 11,
    letterSpacing: 3,
    fontFamily: "monospace",
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "700",
    marginTop: 6,
    marginBottom: 10,
  },
  body: { color: colors.muted, fontSize: 13, lineHeight: 20, marginBottom: 16 },
  card: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 12,
  },
  cardTitle: { color: colors.green, fontSize: 15, fontWeight: "600" },
  cardBody: { color: colors.muted, fontSize: 12, marginTop: 6, lineHeight: 18 },
  btn: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.greenDim,
    paddingVertical: 10,
    alignItems: "center",
  },
  btnText: {
    color: colors.green,
    fontSize: 10,
    letterSpacing: 2,
    fontFamily: "monospace",
  },
  linkBtn: { paddingVertical: 14, alignItems: "center" },
  linkText: {
    color: colors.blue,
    fontSize: 13,
    textDecorationLine: "underline",
  },
});
