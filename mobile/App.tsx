import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { CliBridgeProvider } from "./src/context/CliBridgeContext";
import { AppStateProvider } from "./src/context/AppState";
import { colors } from "./src/theme";
import { HomeScreen } from "./src/screens/HomeScreen";
import { ServiceScreen } from "./src/screens/ServiceScreen";
import { AegisScreen } from "./src/screens/AegisScreen";
import { LogsScreen } from "./src/screens/LogsScreen";
import { DocsScreen, DocArticleScreen } from "./src/screens/DocsScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.panel,
    primary: colors.green,
    text: colors.text,
    border: colors.border,
  },
};

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.panel },
        headerTintColor: colors.green,
        headerTitleStyle: { fontSize: 14, letterSpacing: 1 },
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ title: "AETHER" }}
      />
      <Stack.Screen
        name="Service"
        component={ServiceScreen}
        options={({ route }: any) => ({
          title: (route.params?.platformId || "service").toUpperCase(),
        })}
      />
      <Stack.Screen
        name="Aegis"
        component={AegisScreen}
        options={{ title: "AEGIS UNLOCK" }}
      />
    </Stack.Navigator>
  );
}

function DocsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.panel },
        headerTintColor: colors.green,
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen name="DocsList" component={DocsScreen} options={{ title: "DOCS" }} />
      <Stack.Screen
        name="DocArticle"
        component={DocArticleScreen}
        options={{ title: "GUIDE" }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <CliBridgeProvider>
      <AppStateProvider>
        <NavigationContainer theme={navTheme}>
          <StatusBar style="light" />
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarStyle: {
                backgroundColor: colors.panel,
                borderTopColor: colors.border,
              },
              tabBarActiveTintColor: colors.green,
              tabBarInactiveTintColor: colors.muted,
              tabBarLabelStyle: {
                fontSize: 10,
                letterSpacing: 1,
                fontFamily: "monospace",
              },
              tabBarIcon: ({ color, size }) => {
                const map: Record<string, keyof typeof Ionicons.glyphMap> = {
                  Home: "grid-outline",
                  Aegis: "shield-outline",
                  Console: "terminal-outline",
                  Docs: "book-outline",
                  Settings: "settings-outline",
                };
                return (
                  <Ionicons
                    name={map[route.name] || "ellipse-outline"}
                    size={size}
                    color={color}
                  />
                );
              },
            })}
          >
            <Tab.Screen name="Home" component={HomeStack} />
            <Tab.Screen
              name="Aegis"
              component={AegisScreen}
              options={{ headerShown: true, title: "AEGIS" }}
            />
            <Tab.Screen
              name="Console"
              component={LogsScreen}
              options={{ headerShown: true, title: "CONSOLE" }}
            />
            <Tab.Screen name="Docs" component={DocsStack} />
            <Tab.Screen
              name="Settings"
              component={SettingsScreen}
              options={{ headerShown: true, title: "SETTINGS" }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </AppStateProvider>
    </CliBridgeProvider>
  );
}
