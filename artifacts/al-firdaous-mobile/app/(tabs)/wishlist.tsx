import { AppIcon } from '@/components/AppIcon';
import { ProductCard } from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { useColors } from '@/hooks/useColors';
import { useWishlist } from '@/context/WishlistContext';
import { Product } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function WishlistScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { items } = useWishlist();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const isDark = colors.background === '#0f172a';
  const bg = isDark ? '#0a0a14' : '#f8f7f4';
  const textCol = isDark ? '#f9fafb' : '#111827';
  const mutedCol = isDark ? '#64748b' : '#6b7280';

  const renderItem = ({ item }: { item: Product }) => (
    <View style={{ flex: 1 }}>
      <ProductCard product={item} variant="grid" />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <LinearGradient
        colors={isDark ? ['#0a0a14', '#0d1a2e'] : ['#0d1a2e', '#0d2244']}
        style={[styles.header, { paddingTop: topPad + 10 }]}
      >
        <View>
          <Text style={styles.headerEyebrow}>AL-FIRDAOUS STORE</Text>
          <Text style={styles.headerTitle}>Mes Favoris</Text>
        </View>
        {items.length > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{items.length}</Text>
          </View>
        )}
      </LinearGradient>

      <FlatList
        data={items}
        keyExtractor={item => item.id}
        numColumns={2}
        renderItem={renderItem}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.gridRow}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <View style={styles.emptyHeartRing}>
              <View style={styles.emptyHeartInner}>
                <AppIcon name="heart-outline" size={38} color="#C9A84C" />
              </View>
            </View>
            <Text style={[styles.emptyTitle, { color: textCol }]}>Aucun favori</Text>
            <Text style={[styles.emptySub, { color: mutedCol }]}>
              Appuyez sur le cœur pour sauvegarder vos produits préférés.
            </Text>
            <Pressable style={styles.shopBtn} onPress={() => router.push('/(tabs)/catalog' as any)}>
              <Text style={styles.shopBtnText}>Explorer la boutique</Text>
              <AppIcon name="arrow-forward" size={16} color="#0d1a2e" />
            </Pressable>
          </View>
        }
        ListFooterComponent={items.length > 0
          ? <View style={{ height: Platform.OS === 'web' ? 34 : insets.bottom + 90 }} />
          : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between',
    paddingBottom: 18, paddingHorizontal: 18,
  },
  headerEyebrow: { color: '#C9A84C', fontSize: 9, fontFamily: 'Inter_700Bold', letterSpacing: 2, marginBottom: 3 },
  headerTitle: { color: '#fff', fontSize: 26, fontFamily: 'Inter_700Bold' },
  countBadge: {
    backgroundColor: '#C9A84C', borderRadius: 20, minWidth: 32, height: 32,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10,
  },
  countBadgeText: { color: '#0d1a2e', fontSize: 14, fontFamily: 'Inter_700Bold' },

  grid: { padding: 14, paddingTop: 18 },
  gridRow: { gap: 12, marginBottom: 12 },

  emptyWrap: { flex: 1, alignItems: 'center', paddingTop: 80, gap: 16, paddingHorizontal: 36 },
  emptyHeartRing: {
    width: 110, height: 110, borderRadius: 55,
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  emptyHeartInner: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(201,168,76,0.1)', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: 'rgba(201,168,76,0.35)',
  },
  emptyTitle: { fontSize: 22, fontFamily: 'Inter_700Bold' },
  emptySub: { fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'center', lineHeight: 21 },
  shopBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#C9A84C', borderRadius: 25, paddingHorizontal: 26, paddingVertical: 14,
  },
  shopBtnText: { color: '#0d1a2e', fontSize: 15, fontFamily: 'Inter_700Bold' },
});
