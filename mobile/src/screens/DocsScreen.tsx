import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { colors } from "../theme";
import { DOCS } from "../data/services";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

export function DocsScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) {
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.kicker}>AETHER ACADEMY</Text>
      <Text style={styles.title}>Guides</Text>
      {DOCS.map((d) => (
        <Pressable
          key={d.slug}
          style={styles.card}
          onPress={() => navigation.navigate("DocArticle", { slug: d.slug })}
        >
          <Text style={styles.platform}>{d.platform}</Text>
          <Text style={styles.cardTitle}>{d.title}</Text>
          <Text style={styles.summary}>{d.summary}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

export function DocArticleScreen({
  route,
}: {
  route: { params: { slug: string } };
}) {
  const doc = DOCS.find((d) => d.slug === route.params.slug) ?? DOCS[0];
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.platform}>{doc.platform}</Text>
      <Text style={styles.title}>{doc.title}</Text>
      <Text style={styles.body}>{doc.body}</Text>
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
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "700",
    marginVertical: 8,
  },
  card: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 10,
  },
  platform: {
    color: colors.green,
    fontSize: 10,
    fontFamily: "monospace",
    letterSpacing: 2,
  },
  cardTitle: { color: colors.text, fontSize: 16, fontWeight: "600", marginTop: 4 },
  summary: { color: colors.muted, fontSize: 12, marginTop: 6 },
  body: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 8,
  },
});
