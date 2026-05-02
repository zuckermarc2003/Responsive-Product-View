import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
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
import { useColors } from '@/hooks/useColors';
import { CATEGORIES, PRODUCTS } from '@/constants/data';
import { Product } from '@/types';

type SortKey = 'default' | 'price_asc' | 'price_desc' | 'rating';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'default', label: 'Par défaut' },
  { key: 'price_asc', label: 'Prix croissant' },
  { key: 'price_desc', label: 'Prix décroissant' },
  { key: 'rating', label: 'Mieux notés' },
];

export default function CatalogScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [sort, setSort] = useState<SortKey>('default');
  const [showSort, setShowSort] = useState(false);
  const [promoOnly, setPromoOnly] = useState(false);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const styles = makeStyles(colors, topPad);

  const filtered = PRODUCTS
    .filter(p => {
      const matchCat = selectedCat === 'all' || p.product_type === selectedCat;
      const matchQuery = query.trim() === '' ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase());
      const matchPromo = !promoOnly || p.promo > 0;
      return matchCat && matchQuery && matchPromo;
    })
    .sort((a, b) => {
      if (sort === 'price_asc') return a.price - b.price;
      if (sort === 'price_desc') return b.price - a.price;
      if (sort === 'rating') return b.rating - a.rating;
      return 0;
    });

  const numCols = 2;

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.cardWrapper}>
      <ProductCard product={item} variant="grid" />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Catalogue</Text>
        <Pressable style={styles.sortBtn} onPress={() => setShowSort(v => !v)}>
          <Ionicons name="options-outline" size={20} color={colors.primary} />
          <Text style={styles.sortBtnText}>Trier</Text>
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
              {sort === opt.key && <Ionicons name="checkmark" size={16} color={colors.primary} />}
            </Pressable>
          ))}
        </View>
      )}

      {/* ── Search ── */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color={colors.mutedForeground} />
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Rechercher un produit..."
          placeholderTextColor={colors.mutedForeground}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={18} color={colors.mutedForeground} />
          </Pressable>
        )}
      </View>

      {/* ── Categories ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.catScroll}
      >
        {CATEGORIES.map(cat => {
          const active = selectedCat === cat.key;
          return (
            <Pressable
              key={cat.key}
              style={[styles.catPill, active && styles.catPillActive]}
              onPress={() => setSelectedCat(cat.key)}
            >
              <Text style={[styles.catPillText, active && styles.catPillTextActive]}>
                {cat.label}
              </Text>
            </Pressable>
          );
        })}
        <Pressable
          style={[styles.catPill, promoOnly && styles.catPillActive]}
          onPress={() => setPromoOnly(v => !v)}
        >
          <Ionicons name="flash" size={13} color={promoOnly ? '#fff' : colors.promoBadge} />
          <Text style={[styles.catPillText, promoOnly && styles.catPillTextActive]}>Promos</Text>
        </Pressable>
      </ScrollView>

      {/* ── Results count ── */}
      <View style={styles.resultRow}>
        <Text style={styles.resultCount}>{filtered.length} produit{filtered.length > 1 ? 's' : ''}</Text>
      </View>

      {/* ── Grid ── */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        numColumns={numCols}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        renderItem={renderProduct}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={48} color={colors.border} />
            <Text style={styles.emptyTitle}>Aucun produit trouvé</Text>
            <Text style={styles.emptyText}>Essayez un autre terme de recherche</Text>
          </View>
        }
        ListFooterComponent={<View style={{ height: Platform.OS === 'web' ? 34 : insets.bottom + 80 }} />}
      />
    </View>
  );
}

const makeStyles = (colors: ReturnType<typeof useColors>, topPad: number) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: topPad + 12,
      paddingBottom: 12,
      paddingHorizontal: 16,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', color: colors.foreground },
    sortBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    sortBtnText: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: colors.primary },

    sortDropdown: {
      backgroundColor: colors.card,
      marginHorizontal: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
      zIndex: 100,
    },
    sortOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    sortOptionActive: { backgroundColor: colors.secondary },
    sortOptionText: { fontSize: 14, fontFamily: 'Inter_500Medium', color: colors.foreground },
    sortOptionTextActive: { color: colors.primary, fontFamily: 'Inter_700Bold' },

    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 16,
      marginTop: 12,
      marginBottom: 4,
      backgroundColor: colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 14,
      paddingVertical: 10,
      gap: 10,
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
      fontFamily: 'Inter_400Regular',
      color: colors.foreground,
      padding: 0,
    },

    catScroll: { paddingHorizontal: 16, gap: 8, paddingVertical: 10 },
    catPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 20,
      backgroundColor: colors.card,
      borderWidth: 1.5,
      borderColor: colors.border,
    },
    catPillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    catPillText: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: colors.mutedForeground },
    catPillTextActive: { color: '#fff' },

    resultRow: { paddingHorizontal: 16, paddingBottom: 8 },
    resultCount: { fontSize: 12, fontFamily: 'Inter_500Medium', color: colors.mutedForeground },

    list: { paddingHorizontal: 12, paddingTop: 4 },
    columnWrapper: { gap: 12, marginBottom: 12 },
    cardWrapper: { flex: 1 },

    empty: { alignItems: 'center', paddingTop: 60, gap: 10 },
    emptyTitle: { fontSize: 17, fontFamily: 'Inter_700Bold', color: colors.foreground },
    emptyText: { fontSize: 14, fontFamily: 'Inter_400Regular', color: colors.mutedForeground },
  });
