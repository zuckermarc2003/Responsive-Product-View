import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProductCard } from '@/components/ProductCard';
import { useWishlist } from '@/context/WishlistContext';
import { useColors } from '@/hooks/useColors';
import { Product } from '@/types';

export default function WishlistScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { items } = useWishlist();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const styles = makeStyles(colors, topPad);

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.cardWrapper}>
      <ProductCard product={item} variant="grid" />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favoris</Text>
        {items.length > 0 && (
          <Text style={styles.countText}>{items.length} article{items.length > 1 ? 's' : ''}</Text>
        )}
      </View>

      <FlatList
        data={items}
        keyExtractor={item => item.id}
        numColumns={2}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="heart-outline" size={64} color={colors.border} />
            <Text style={styles.emptyTitle}>Aucun favori</Text>
            <Text style={styles.emptyText}>
              Appuyez sur le bouton coeur pour sauvegarder vos produits préférés.
            </Text>
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
      paddingBottom: 14,
      paddingHorizontal: 16,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', color: colors.foreground },
    countText: { fontSize: 14, fontFamily: 'Inter_500Medium', color: colors.mutedForeground },

    list: { padding: 12, paddingTop: 16 },
    columnWrapper: { gap: 12, marginBottom: 12 },
    cardWrapper: { flex: 1 },

    empty: { flex: 1, alignItems: 'center', paddingTop: 80, gap: 12, paddingHorizontal: 32 },
    emptyTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', color: colors.foreground },
    emptyText: { fontSize: 14, fontFamily: 'Inter_400Regular', color: colors.mutedForeground, textAlign: 'center' },
  });
