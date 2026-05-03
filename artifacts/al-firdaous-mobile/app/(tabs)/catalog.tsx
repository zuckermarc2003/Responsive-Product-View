import { AppIcon } from '@/components/AppIcon';
import { ProductCard } from '@/components/ProductCard';
import { SkeletonCard } from '@/components/SkeletonCard';
import { CATEGORIES } from '@/constants/data';
import { useLanguage } from '@/context/LanguageContext';
import { useColors } from '@/hooks/useColors';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
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

type SortKey = 'default' | 'price_asc' | 'price_desc' | 'rating';
const { width: SW } = Dimensions.get('window');

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
  const cardWidth = (SW - 48) / 2;
  const isDark = colors.background === '#0f172a';
  const bg = isDark ? '#0a0a14' : '#f8f7f4';
  const cardBg = isDark ? '#141424' : '#fff';
  const textCol = isDark ? '#f9fafb' : '#111827';
  const mutedCol = isDark ? '#64748b' : '#6b7280';
  const borderCol = isDark ? '#1e293b' : '#e5e7eb';

  const SORT_OPTIONS: { key: SortKey; label: string }[] = [
    { key: 'default', label: t.sortDefault },
    { key: 'price_asc', label: t.sortPriceAsc },
    { key: 'price_desc', label: t.sortPriceDesc },
    { key: 'rating', label: t.sortRating },
  ];

  const catLabels: Record<string, string> = {
    all: t.catAll, Shoe: t.catShoe, Sandal: t.catSandal, Shirt: t.catShirt, Pant: t.catPant,
  };

  const { data: products = [], isLoading, error, refetch } = useProducts({
    category: selectedCat, search: query, sort, promo: promoOnly,
  });

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={{ flex: 1 }}>
      <ProductCard product={item} variant="grid" />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>

      {/* ── Header ── */}
      <LinearGradient
        colors={isDark ? ['#0a0a14', '#0d1a2e'] : ['#0d1a2e', '#0d2244']}
        style={[styles.header, { paddingTop: topPad + 10 }]}
      >
        <View>
          <Text style={styles.headerEyebrow}>AL-FIRDAOUS STORE</Text>
          <Text style={styles.headerTitle}>Boutique</Text>
        </View>
        <Pressable style={styles.sortTrigger} onPress={() => setShowSort(v => !v)}>
          <AppIcon name="options-outline" size={18} color="#C9A84C" />
          <Text style={styles.sortTriggerText}>{t.sort}</Text>
          <AppIcon name="chevron-down" size={14} color="#C9A84C" />
        </Pressable>
      </LinearGradient>

      {/* ── Sort Sheet ── */}
      {showSort && (
        <View style={[styles.sortSheet, { backgroundColor: cardBg, borderColor: borderCol }]}>
          {SORT_OPTIONS.map((opt, i) => (
            <Pressable
              key={opt.key}
              style={[
                styles.sortRow,
                i < SORT_OPTIONS.length - 1 && { borderBottomWidth: 1, borderBottomColor: borderCol },
                sort === opt.key && { backgroundColor: isDark ? '#0d1a2e' : '#f0f8ff' },
              ]}
              onPress={() => { setSort(opt.key); setShowSort(false); }}
            >
              <Text style={[styles.sortRowText, { color: sort === opt.key ? '#C9A84C' : textCol }]}>
                {opt.label}
              </Text>
              {sort === opt.key && <AppIcon name="checkmark-circle" size={18} color="#C9A84C" />}
            </Pressable>
          ))}
        </View>
      )}

      {/* ── Search ── */}
      <View style={[styles.searchWrap, { backgroundColor: cardBg, borderColor: borderCol }]}>
        <AppIcon name="search-outline" size={18} color={mutedCol} />
        <TextInput
          style={[styles.searchInput, { color: textCol }]}
          value={query}
          onChangeText={setQuery}
          placeholder={t.searchPlaceholder}
          placeholderTextColor={mutedCol}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery('')}>
            <AppIcon name="close-circle" size={18} color={mutedCol} />
          </Pressable>
        )}
      </View>

      {/* ── Category Pills ── */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
        {CATEGORIES.map(cat => {
          const active = selectedCat === cat.key;
          return (
            <Pressable
              key={cat.key}
              style={[styles.catPill, active && styles.catPillActive, { borderColor: active ? '#C9A84C' : borderCol }]}
              onPress={() => setSelectedCat(cat.key)}
            >
              <Text style={[styles.catPillText, { color: active ? '#0d1a2e' : mutedCol }]}>
                {catLabels[cat.key]}
              </Text>
            </Pressable>
          );
        })}
        <Pressable
          style={[styles.catPill, promoOnly && styles.catPillActive, { borderColor: promoOnly ? '#ef4444' : borderCol, backgroundColor: promoOnly ? '#ef4444' : 'transparent' }]}
          onPress={() => setPromoOnly(v => !v)}
        >
          <AppIcon name="flash" size={13} color={promoOnly ? '#fff' : '#ef4444'} />
          <Text style={[styles.catPillText, { color: promoOnly ? '#fff' : '#ef4444' }]}>{t.promos}</Text>
        </Pressable>
      </ScrollView>

      {/* ── Result count ── */}
      {!isLoading && (
        <View style={styles.countRow}>
          <View style={styles.countDot} />
          <Text style={[styles.countText, { color: mutedCol }]}>{t.productCount(products.length)}</Text>
        </View>
      )}

      {/* ── Content ── */}
      {isLoading ? (
        <View style={styles.skeletonGrid}>
          {[1, 2, 3, 4].map(i => <SkeletonCard key={i} width={cardWidth} />)}
        </View>
      ) : error ? (
        <View style={styles.errorWrap}>
          <View style={styles.errorIcon}>
            <AppIcon name="wifi-outline" size={36} color="#C9A84C" />
          </View>
          <Text style={[styles.errorTitle, { color: textCol }]}>{t.connectionError}</Text>
          <Text style={[styles.errorSub, { color: mutedCol }]}>{t.loadingError}</Text>
          <Pressable style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryText}>{t.retry}</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.gridRow}
          showsVerticalScrollIndicator={false}
          renderItem={renderProduct}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={[styles.emptyTitle, { color: textCol }]}>{t.noProducts}</Text>
              <Text style={[styles.emptySub, { color: mutedCol }]}>{t.trySearch}</Text>
            </View>
          }
          ListFooterComponent={<View style={{ height: Platform.OS === 'web' ? 34 : insets.bottom + 90 }} />}
        />
      )}
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
  sortTrigger: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(201,168,76,0.15)', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.35)',
  },
  sortTriggerText: { color: '#C9A84C', fontSize: 13, fontFamily: 'Inter_700Bold' },

  sortSheet: {
    marginHorizontal: 14, borderRadius: 14, borderWidth: 1,
    overflow: 'hidden', zIndex: 99,
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 12,
    elevation: 10,
  },
  sortRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 15 },
  sortRowText: { fontSize: 15, fontFamily: 'Inter_500Medium' },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginHorizontal: 14, marginTop: 12,
    borderRadius: 14, borderWidth: 1.5,
    paddingHorizontal: 14, paddingVertical: 12,
  },
  searchInput: { flex: 1, fontSize: 14, fontFamily: 'Inter_400Regular', padding: 0 },

  catRow: { paddingHorizontal: 14, gap: 8, paddingVertical: 12 },
  catPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 16, paddingVertical: 9, borderRadius: 24,
    borderWidth: 1.5,
  },
  catPillActive: { backgroundColor: '#C9A84C' },
  catPillText: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },

  countRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 18, marginBottom: 8 },
  countDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#C9A84C' },
  countText: { fontSize: 12, fontFamily: 'Inter_500Medium' },

  grid: { paddingHorizontal: 14, paddingTop: 4 },
  gridRow: { gap: 12, marginBottom: 12 },
  skeletonGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 14, paddingTop: 4, gap: 12 },

  errorWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, paddingHorizontal: 32, marginTop: 60 },
  errorIcon: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(201,168,76,0.12)', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.3)',
  },
  errorTitle: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  errorSub: { fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  retryBtn: {
    backgroundColor: '#C9A84C', borderRadius: 25, paddingHorizontal: 28, paddingVertical: 13, marginTop: 4,
  },
  retryText: { color: '#0d1a2e', fontSize: 14, fontFamily: 'Inter_700Bold' },

  emptyWrap: { alignItems: 'center', paddingTop: 60, gap: 10 },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  emptySub: { fontSize: 14, fontFamily: 'Inter_400Regular' },
});
