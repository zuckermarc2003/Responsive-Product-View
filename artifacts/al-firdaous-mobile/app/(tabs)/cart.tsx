import { AppIcon } from '@/components/AppIcon';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React from 'react';
import {
  Alert,
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '@/context/CartContext';
import { useColors } from '@/hooks/useColors';
import { CartItem } from '@/types';
import { getFinalPrice } from '@/constants/data';

export default function CartScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { items, updateQuantity, removeFromCart, clearCart, total, itemCount } = useCart();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;
  const styles = makeStyles(colors, topPad, bottomPad);

  const handleCheckout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/checkout' as any);
  };

  const renderItem = ({ item }: { item: CartItem }) => {
    const itemPrice = getFinalPrice(item.product.price, item.product.promo);
    return (
      <View style={styles.cartItem}>
        <Image source={{ uri: item.product.image }} style={styles.itemImage} />
        <View style={styles.itemInfo}>
          <Text style={styles.itemBrand}>{item.product.brand}</Text>
          <Text style={styles.itemName} numberOfLines={1}>{item.product.name}</Text>
          <Text style={styles.itemSize}>Taille: {item.selectedSize}</Text>
          <Text style={styles.itemPrice}>{itemPrice.toFixed(2)} MAD</Text>
        </View>
        <View style={styles.itemControls}>
          <Pressable
            style={styles.removeBtn}
            onPress={() => { removeFromCart(item.product.id, item.selectedSize); }}
          >
            <AppIcon name="trash-outline" size={16} color={colors.destructive} />
          </Pressable>
          <View style={styles.qtyRow}>
            <Pressable
              style={styles.qtyBtn}
              onPress={() => updateQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
            >
              <AppIcon name="remove" size={16} color={colors.foreground} />
            </Pressable>
            <Text style={styles.qtyText}>{item.quantity}</Text>
            <Pressable
              style={styles.qtyBtn}
              onPress={() => updateQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
            >
              <AppIcon name="add" size={16} color={colors.foreground} />
            </Pressable>
          </View>
          <Text style={styles.subtotal}>{(itemPrice * item.quantity).toFixed(2)} MAD</Text>
        </View>
      </View>
    );
  };

  if (items.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mon Panier</Text>
        </View>
        <View style={styles.empty}>
          <AppIcon name="cart-outline" size={64} color={colors.border} />
          <Text style={styles.emptyTitle}>Panier vide</Text>
          <Text style={styles.emptyText}>Ajoutez des produits à votre panier pour commencer vos achats.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mon Panier</Text>
        <Pressable onPress={() => Alert.alert('Vider le panier', 'Confirmer?', [
          { text: 'Annuler' },
          { text: 'Vider', style: 'destructive', onPress: clearCart },
        ])}>
          <Text style={styles.clearBtn}>Vider</Text>
        </Pressable>
      </View>

      <FlatList
        data={items}
        keyExtractor={item => `${item.product.id}-${item.selectedSize}`}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Articles ({itemCount})</Text>
              <Text style={styles.summaryValue}>{total.toFixed(2)} MAD</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Livraison</Text>
              <Text style={[styles.summaryValue, { color: colors.priceGreen }]}>Gratuite</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{total.toFixed(2)} MAD</Text>
            </View>

            <View style={styles.deliveryNote}>
              <AppIcon name="shield-checkmark-outline" size={16} color={colors.priceGreen} />
              <Text style={styles.deliveryNoteText}>Livraison sécurisée • Retour gratuit 30 jours</Text>
            </View>

            <Pressable style={styles.checkoutBtn} onPress={handleCheckout}>
              <AppIcon name="bag-check-outline" size={20} color="#fff" />
              <Text style={styles.checkoutBtnText}>Commander — {total.toFixed(2)} MAD</Text>
            </Pressable>

            <View style={{ height: bottomPad + 20 }} />
          </View>
        }
      />
    </View>
  );
}

const makeStyles = (colors: ReturnType<typeof useColors>, topPad: number, bottomPad: number) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    emptyContainer: {},
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
    clearBtn: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: colors.destructive },

    list: { padding: 16, gap: 12 },

    cartItem: {
      backgroundColor: colors.card,
      borderRadius: 14,
      flexDirection: 'row',
      padding: 12,
      gap: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 3,
    },
    itemImage: { width: 80, height: 80, borderRadius: 10 },
    itemInfo: { flex: 1, gap: 2 },
    itemBrand: { fontSize: 10, fontFamily: 'Inter_500Medium', color: colors.mutedForeground, textTransform: 'uppercase' },
    itemName: { fontSize: 14, fontFamily: 'Inter_700Bold', color: colors.foreground },
    itemSize: { fontSize: 12, fontFamily: 'Inter_400Regular', color: colors.mutedForeground },
    itemPrice: { fontSize: 14, fontFamily: 'Inter_700Bold', color: colors.priceGreen, marginTop: 4 },

    itemControls: { alignItems: 'flex-end', gap: 8, justifyContent: 'space-between' },
    removeBtn: { padding: 4 },
    qtyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.muted,
      borderRadius: 8,
      overflow: 'hidden',
    },
    qtyBtn: { padding: 8 },
    qtyText: { minWidth: 28, textAlign: 'center', fontSize: 14, fontFamily: 'Inter_700Bold', color: colors.foreground },
    subtotal: { fontSize: 13, fontFamily: 'Inter_700Bold', color: colors.foreground },

    summary: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginTop: 8,
      gap: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 4,
    },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    summaryLabel: { fontSize: 14, fontFamily: 'Inter_400Regular', color: colors.mutedForeground },
    summaryValue: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: colors.foreground },
    totalRow: { paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border, marginTop: 4 },
    totalLabel: { fontSize: 17, fontFamily: 'Inter_700Bold', color: colors.foreground },
    totalValue: { fontSize: 20, fontFamily: 'Inter_700Bold', color: colors.primary },

    deliveryNote: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: colors.secondary,
      borderRadius: 10,
      padding: 10,
    },
    deliveryNoteText: { fontSize: 12, fontFamily: 'Inter_500Medium', color: colors.primary, flex: 1 },

    checkoutBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: colors.primary,
      borderRadius: 14,
      paddingVertical: 16,
    },
    checkoutBtnText: { color: '#fff', fontSize: 16, fontFamily: 'Inter_700Bold' },

    empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 32 },
    emptyTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', color: colors.foreground },
    emptyText: { fontSize: 14, fontFamily: 'Inter_400Regular', color: colors.mutedForeground, textAlign: 'center' },
  });
