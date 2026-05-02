import { AppIcon } from '@/components/AppIcon';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProductCard } from '@/components/ProductCard';
import { SkeletonCard } from '@/components/SkeletonCard';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useColors } from '@/hooks/useColors';
import { useProducts } from '@/hooks/useProducts';
import { CATEGORIES } from '@/constants/data';
import { Product } from '@/types';

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { itemCount } = useCart();
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Single fetch — all filtering is done client-side so every section
  // (Nouveautés, En Promotion, grid) reacts to the category pill together.
  const { data: allProducts = [], isLoading } = useProducts();

  const catLabels: Record<string, string> = {
    all: t.catAll,
    Shoe: t.catShoe,
    Sandal: t.catSandal,
    Shirt: t.catShirt,
    Pant: t.catPant,
  };

  const filtered = useMemo(() => {
    if (selectedCategory === 'all') return allProducts;
    return allProducts.filter(p => p.product_type === selectedCategory);
  }, [allProducts, selectedCategory]);

  const newArrivals = useMemo(() => filtered.filter(p => p.isNew), [filtered]);
  const onSale = useMemo(() => filtered.filter(p => p.promo > 0), [filtered]);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const styles = makeStyles(colors, topPad);

  const CARD_WIDTH = 172;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.headerBg} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.logoWrap}>
          <Image
            source={{ uri: 'https://www.alfirdaousstore.com/assets/WHITE%20FIRDAOUS%20STORE-DgnBjEdy.png' }}
            style={styles.logoImage}
            resizeMode="contain"
            onError={() => {}}
          />
        </View>
        <View style={styles.headerActions}>
          <Pressable style={styles.headerIcon} onPress={() => router.push('/(tabs)/catalog' as any)}>
            <AppIcon name="search-outline" size={22} color="#fff" />
          </Pressable>
          <Pressable style={styles.headerIcon} onPress={() => router.push('/(tabs)/cart' as any)}>
            <AppIcon name="cart-outline" size={22} color="#fff" />
            {itemCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{itemCount > 9 ? '9+' : itemCount}</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Hero Banner ── */}
        <View style={styles.heroBanner}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80' }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroLabel}>{t.newCollection}</Text>
            <Text style={styles.heroTitle}>{t.heroCta}</Text>
            <Text style={styles.heroSub}>{t.heroSub}</Text>
            <Pressable style={styles.heroBtn} onPress={() => setSelectedCategory('Shoe')}>
              <Text style={styles.heroBtnText}>{t.discover}</Text>
              <AppIcon name="arrow-forward" size={14} color="#fff" />
            </Pressable>
          </View>
        </View>

        {/* ── Category Pills ── */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>{t.categories}</Text>
          {isLoading && <ActivityIndicator size="small" color={colors.primary} />}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {CATEGORIES.map(cat => {
            const active = selectedCategory === cat.key;
            return (
              <Pressable
                key={cat.key}
                style={[styles.categoryPill, active && styles.categoryPillActive]}
                onPress={() => setSelectedCategory(cat.key)}
              >
                <Text style={[styles.categoryPillText, active && styles.categoryPillTextActive]}>
                  {catLabels[cat.key] ?? cat.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* ── New Arrivals ── */}
        {newArrivals.length > 0 && (
          <>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>{t.newArrivals}</Text>
              <Pressable onPress={() => router.push('/(tabs)/catalog' as any)}>
                <Text style={styles.seeAll}>{t.seeAll}</Text>
              </Pressable>
            </View>
            {isLoading ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
                {[1, 2, 3].map(i => <SkeletonCard key={i} width={CARD_WIDTH} />)}
              </ScrollView>
            ) : (
              <FlatList
                data={newArrivals}
                horizontal
                keyExtractor={item => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
                renderItem={({ item }) => <ProductCard product={item} variant="carousel" />}
                ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
                scrollEnabled={newArrivals.length > 0}
              />
            )}
          </>
        )}

        {/* ── Promo Banner ── */}
        <Pressable style={styles.promoBanner} onPress={() => setSelectedCategory('Shoe')}>
          <AppIcon name="flash" size={20} color="#fff" />
          <Text style={styles.promoBannerText}>{t.salesBanner}</Text>
          <AppIcon name="chevron-forward" size={18} color="rgba(255,255,255,0.8)" />
        </Pressable>

        {/* ── On Sale ── */}
        {onSale.length > 0 && (
          <>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>{t.onSale}</Text>
              <Pressable onPress={() => router.push('/(tabs)/catalog' as any)}>
                <Text style={styles.seeAll}>{t.seeAll}</Text>
              </Pressable>
            </View>
            {isLoading ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
                {[1, 2, 3].map(i => <SkeletonCard key={i} width={CARD_WIDTH} />)}
              </ScrollView>
            ) : (
              <FlatList
                data={onSale}
                horizontal
                keyExtractor={item => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
                renderItem={({ item }) => <ProductCard product={item} variant="carousel" />}
                ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
                scrollEnabled={onSale.length > 0}
              />
            )}
          </>
        )}

        {/* ── Products grid ── */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'all'
              ? t.allProducts
              : catLabels[selectedCategory] ?? selectedCategory}
          </Text>
        </View>

        <View style={styles.grid}>
          {filtered.map((product: Product) => (
            <ProductCard key={product.id} product={product} variant="grid" />
          ))}
        </View>

        <View style={{ height: Platform.OS === 'web' ? 34 : insets.bottom + 80 }} />
      </ScrollView>
    </View>
  );
}

const makeStyles = (colors: ReturnType<typeof useColors>, topPad: number) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      backgroundColor: colors.headerBg,
      paddingTop: topPad + 8,
      paddingBottom: 14,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    logoWrap: { flex: 1, alignItems: 'flex-start' },
    logoImage: { height: 34, width: 148 },
    headerActions: { flexDirection: 'row', gap: 4 },
    headerIcon: { padding: 8, position: 'relative' },
    cartBadge: {
      position: 'absolute', top: 4, right: 4,
      backgroundColor: colors.promoBadge, borderRadius: 8,
      minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3,
    },
    cartBadgeText: { color: '#fff', fontSize: 9, fontFamily: 'Inter_700Bold' },
    scroll: { paddingTop: 0 },
    heroBanner: { height: 220, marginBottom: 4 },
    heroImage: { width: '100%', height: '100%' },
    heroOverlay: {
      position: 'absolute', inset: 0,
      backgroundColor: 'rgba(0,0,0,0.48)', padding: 20, justifyContent: 'flex-end',
    },
    heroLabel: { color: colors.primary, fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 2, marginBottom: 4 },
    heroTitle: { color: '#fff', fontSize: 28, fontFamily: 'Inter_700Bold', lineHeight: 32 },
    heroSub: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 4 },
    heroBtn: {
      flexDirection: 'row', alignItems: 'center', gap: 6,
      backgroundColor: colors.primary, alignSelf: 'flex-start',
      paddingHorizontal: 16, paddingVertical: 9, borderRadius: 22, marginTop: 12,
    },
    heroBtnText: { color: '#fff', fontSize: 13, fontFamily: 'Inter_700Bold' },
    sectionRow: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: 16, marginTop: 20, marginBottom: 10,
    },
    sectionTitle: { fontSize: 17, fontFamily: 'Inter_700Bold', color: colors.foreground },
    seeAll: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: colors.primary },
    categoryScroll: { paddingHorizontal: 16, gap: 8 },
    categoryPill: {
      paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
      backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.border,
    },
    categoryPillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    categoryPillText: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: colors.mutedForeground },
    categoryPillTextActive: { color: '#fff' },
    horizontalList: { paddingHorizontal: 16, gap: 12 },
    promoBanner: {
      flexDirection: 'row', alignItems: 'center', gap: 10,
      marginHorizontal: 16, marginTop: 20,
      backgroundColor: colors.primary, borderRadius: 14, padding: 14,
    },
    promoBannerText: { flex: 1, color: '#fff', fontSize: 13, fontFamily: 'Inter_700Bold' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 12, marginTop: 4 },
  });
