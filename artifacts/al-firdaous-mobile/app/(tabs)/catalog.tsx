import { AppIcon } from '@/components/AppIcon';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProductCard } from '@/components/ProductCard';
import { SkeletonCard } from '@/components/SkeletonCard';
import { useLanguage } from '@/context/LanguageContext';
import { useColors } from '@/hooks/useColors';
import { useProducts } from '@/hooks/useProducts';
import { CATEGORIES } from '@/constants/data';
import { Product } from '@/types';

type SortKey = 'default' | 'price_asc' | 'price_desc' | 'rating';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function CatalogScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [sort, setSort] = useState<SortKey>('default');
  const [showSort, setShowSort] = useState(false);
  const [promoOnly, setPromoOnly] = useState(false);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const cardWidth = (SCREEN_WIDTH - 48) / 2;
  const styles = makeStyles(colors, topPad);

  const SORT_OPTIONS: { key: SortKey; label: string }[] = [
    { key: 'default', label: t.sortDefault },
    { key: 'price_asc', label: t.sortPriceAsc },
    { key: 'price_desc', label: t.sortPriceDesc },
    { key: 'rating', label: t.sortRating },
  ];

  const catLabels: Record<string, string> = {
    all: t.catAll,
    Shoe: t.catShoe,
    Sandal: t.catSandal,
    Shirt: t.catShirt,
    Pant: t.catPant,
  };

  const { data: products = [], isLoading, error, refetch } = useProducts({
    category: selectedCat,
    search: query,
    sort,
    promo: promoOnly,
  });

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={{ flex: 1 }}>
      <ProductCard product={item} variant="grid" />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t.catalogue}</Text>
        <Pressable style={styles.sortBtn} onPress={() => setShowSort(v => !v)}>
          <AppIcon name="options-outline" size={20} color={colors.primary} />
          <Text style={styles.sortBtnText}>{t.sort}</Text>
        </Pressable>
      </View>

      {/* ── Sort dropdown ── */}
      {showSort && (
        <View style={styles.sortDropdown}>
          {SORT_OPTIONS.map(opt => (
            <Pressable
              key={opt.key}
              style={[styles.sortOption, sort === opt.key && styles.sortOptionActive]}
              onPress={() => { setSort(opt.key); setShowSort(false); }}
            >
              <Text style={[styles.sortOptionText, sort === opt.key && styles.sortOptionTextActive]}>
                {opt.label}
              </Text>
              {sort === opt.key && <AppIcon name="checkmark" size={16} color={colors.primary} />}
            </Pressable>
          ))}
        </View>
      )}

      {/* ── Search ── */}
      <View style={styles.searchBar}>
        <AppIcon name="search-outline" size={18} color={colors.mutedForeground} />
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder={t.searchPlaceholder}
          placeholderTextColor={colors.mutedForeground}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery('')}>
            <AppIcon name="close-circle" size={18} color={colors.mutedForeground} />
          </Pressable>
        )}
      </View>

      {/* ── Categories ── */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
        {CATEGORIES.map(cat => {
          const active = selectedCat === cat.key;
          const label = catLabels[cat.key];
          return (
            <Pressable
              key={cat.key}
              style={[styles.catPill, active && styles.catPillActive]}
              onPress={() => setSelectedCat(cat.key)}
            >
              <Text style={[styles.catPillText, active && styles.catPillTextActive]} numberOfLines={1}>
                {label}
              </Text>
            </Pressable>
          );
        })}
        <Pressable
          style={[styles.catPill, promoOnly && styles.catPillActive]}
          onPress={() => setPromoOnly(v => !v)}
        >
          <AppIcon name="flash" size={13} color={promoOnly ? '#fff' : colors.promoBadge} />
          <Text style={[styles.catPillText, promoOnly && styles.catPillTextActive]}>{t.promos}</Text>
        </Pressable>
      </ScrollView>

      {/* ── Results count ── */}
      {!isLoading && (
        <View style={styles.resultRow}>
          <Text style={styles.resultCount}>{t.productCount(products.length)}</Text>
        </View>
      )}

      {/* ── Content ── */}
      {isLoading ? (
        <View style={styles.skeletonGrid}>
          {[1, 2, 3, 4].map(i => <SkeletonCard key={i} width={cardWidth} />)}
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <AppIcon name="wifi-outline" size={48} color={colors.border} />
          <Text style={styles.errorTitle}>{t.connectionError}</Text>
          <Text style={styles.errorText}>{t.loadingError}</Text>
          <Pressable style={[styles.retryBtn, { backgroundColor: colors.primary }]} onPress={() => refetch()}>
            <Text style={styles.retryBtnText}>{t.retry}</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          renderItem={renderProduct}
          ListEmptyComponent={
            <View style={styles.empty}>
              <AppIcon name="search-outline" size={48} color={colors.border} />
              <Text style={styles.emptyTitle}>{t.noProducts}</Text>
              <Text style={styles.emptyText}>{t.trySearch}</Text>
            </View>
          }
          ListFooterComponent={<View style={{ height: Platform.OS === 'web' ? 34 : insets.bottom + 80 }} />}
        />
      )}
    </View>
  );
}

const makeStyles = (colors: ReturnType<typeof useColors>, topPad: number) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingTop: topPad + 12, paddingBottom: 12, paddingHorizontal: 16,
      backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border,
    },
    headerTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', color: colors.foreground },
    sortBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    sortBtnText: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: colors.primary },
    sortDropdown: {
      backgroundColor: colors.card, marginHorizontal: 16, borderRadius: 12,
      borderWidth: 1, borderColor: colors.border,
      shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8,
      elevation: 8, zIndex: 100,
    },
    sortOption: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      padding: 14, borderBottomWidth: 1, borderBottomColor: colors.border,
    },
    sortOptionActive: { backgroundColor: colors.secondary },
    sortOptionText: { fontSize: 14, fontFamily: 'Inter_500Medium', color: colors.foreground },
    sortOptionTextActive: { color: colors.primary, fontFamily: 'Inter_700Bold' },
    searchBar: {
      flexDirection: 'row', alignItems: 'center',
      marginHorizontal: 16, marginTop: 12, marginBottom: 4,
      backgroundColor: colors.card, borderRadius: 12,
      borderWidth: 1, borderColor: colors.border,
      paddingHorizontal: 14, paddingVertical: 10, gap: 10,
    },
    searchInput: { flex: 1, fontSize: 14, fontFamily: 'Inter_400Regular', color: colors.foreground, padding: 0 },
    catScroll: { paddingHorizontal: 16, gap: 8, paddingVertical: 10 },
    catPill: {
      flexDirection: 'row', alignItems: 'center', gap: 5,
      paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
      backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.border,
    },
    catPillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    catPillText: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: colors.mutedForeground },
    catPillTextActive: { color: '#fff' },
    resultRow: { paddingHorizontal: 16, paddingBottom: 8 },
    resultCount: { fontSize: 12, fontFamily: 'Inter_500Medium', color: colors.mutedForeground },
    list: { paddingHorizontal: 12, paddingTop: 4 },
    columnWrapper: { gap: 12, marginBottom: 12 },
    skeletonGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, paddingTop: 8, gap: 12 },
    errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 32, marginTop: 60 },
    errorTitle: { fontSize: 18, fontFamily: 'Inter_700Bold', color: colors.foreground },
    errorText: { fontSize: 14, fontFamily: 'Inter_400Regular', color: colors.mutedForeground, textAlign: 'center' },
    retryBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, marginTop: 8 },
    retryBtnText: { color: '#fff', fontSize: 14, fontFamily: 'Inter_700Bold' },
    empty: { alignItems: 'center', paddingTop: 60, gap: 10 },
    emptyTitle: { fontSize: 17, fontFamily: 'Inter_700Bold', color: colors.foreground },
    emptyText: { fontSize: 14, fontFamily: 'Inter_400Regular', color: colors.mutedForeground },
  });
