import React from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { colors } from "../theme";
import { useAppState } from "../context/AppState";

export function LogsScreen() {
  const { logs, clearLogs } = useAppState();

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.kicker}>SESSION CONSOLE</Text>
        <Pressable onPress={clearLogs}>
          <Text style={styles.clear}>CLEAR</Text>
        </Pressable>
      </View>
      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <Text
            style={[
              styles.line,
              item.level === "ERROR" && { color: colors.red },
              item.level === "WARN" && { color: colors.yellow },
              item.level === "SUCCESS" && { color: colors.green },
            ]}
          >
            <Text style={styles.level}>[{item.level}] </Text>
            {item.text}
          </Text>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No log lines yet.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  kicker: {
    color: colors.muted,
    fontSize: 10,
    letterSpacing: 3,
    fontFamily: "monospace",
  },
  clear: {
    color: colors.green,
    fontSize: 10,
    letterSpacing: 2,
    fontFamily: "monospace",
  },
  line: {
    color: colors.muted,
    fontSize: 12,
    fontFamily: "monospace",
    marginBottom: 8,
    lineHeight: 18,
  },
  level: { color: colors.muted2 },
  empty: { color: colors.muted2, fontFamily: "monospace", marginTop: 24 },
});
