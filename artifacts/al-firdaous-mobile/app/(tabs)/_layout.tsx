import { BlurView } from "expo-blur";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { SymbolView } from "expo-symbols";
import React from "react";
import { Platform, StyleSheet, Text, View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppIcon } from "@/components/AppIcon";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { useColors } from "@/hooks/useColors";

function CartTabIcon({ color, focused }: { color: string; focused: boolean }) {
  const { itemCount } = useCart();
  return (
    <View style={{ position: "relative" }}>
      <AppIcon name={focused ? "cart" : "cart-outline"} size={24} color={color} />
      {itemCount > 0 && (
        <View style={badge.container}>
          <Text style={badge.text}>{itemCount > 9 ? "9+" : String(itemCount)}</Text>
        </View>
      )}
    </View>
  );
}

const badge = StyleSheet.create({
  container: {
    position: "absolute",
    top: -5,
    right: -8,
    backgroundColor: "#ef4444",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  text: { color: "#fff", fontSize: 9, fontFamily: "Inter_700Bold" },
});

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: "house", selected: "house.fill" }} />
        <Label>Accueil</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="catalog">
        <Icon sf={{ default: "square.grid.2x2", selected: "square.grid.2x2.fill" }} />
        <Label>Boutique</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="cart">
        <Icon sf={{ default: "cart", selected: "cart.fill" }} />
        <Label>Panier</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="wishlist">
        <Icon sf={{ default: "heart", selected: "heart.fill" }} />
        <Label>Favoris</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <Icon sf={{ default: "person", selected: "person.fill" }} />
        <Label>Profil</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const isDark = colorScheme === "dark";
  const isIOS = Platform.OS === "ios";
  const isAndroid = Platform.OS === "android";
  const isWeb = Platform.OS === "web";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: {
          ...(isIOS ? { position: "absolute" as const } : {}),
          backgroundColor: isIOS ? "transparent" : colors.tabBar,
          borderTopWidth: 1,
          borderTopColor: colors.tabBarBorder,
          elevation: 4,
          ...(isWeb ? { height: 84 } : {}),
          // On Android, add bottom padding so the bar clears the gesture nav bar
          ...(isAndroid && insets.bottom > 0 ? { paddingBottom: insets.bottom, height: 60 + insets.bottom } : {}),
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={100}
              tint={isDark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          ) : null,
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: "Inter_500Medium",
          marginBottom: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t.tabHome,
          tabBarIcon: ({ color, focused }) =>
            isIOS ? (
              <SymbolView name={focused ? "house.fill" : "house"} tintColor={color} size={24} />
            ) : (
              <AppIcon name={focused ? "home" : "home-outline"} size={24} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: t.tabCatalog,
          tabBarIcon: ({ color, focused }) =>
            isIOS ? (
              <SymbolView name={focused ? "square.grid.2x2.fill" : "square.grid.2x2"} tintColor={color} size={24} />
            ) : (
              <AppIcon name={focused ? "grid" : "grid-outline"} size={24} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: t.tabCart,
          tabBarIcon: ({ color, focused }) => <CartTabIcon color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: t.tabWishlist,
          tabBarIcon: ({ color, focused }) =>
            isIOS ? (
              <SymbolView name={focused ? "heart.fill" : "heart"} tintColor={color} size={24} />
            ) : (
              <AppIcon name={focused ? "heart" : "heart-outline"} size={24} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t.tabProfile,
          tabBarIcon: ({ color, focused }) =>
            isIOS ? (
              <SymbolView name={focused ? "person.fill" : "person"} tintColor={color} size={24} />
            ) : (
              <AppIcon name={focused ? "person" : "person-outline"} size={24} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  if (Platform.OS === "ios" && isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}
