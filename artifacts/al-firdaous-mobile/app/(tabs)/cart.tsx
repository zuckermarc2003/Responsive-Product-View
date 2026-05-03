import { AppIcon } from '@/components/AppIcon';
import { getFinalPrice } from '@/constants/data';
import { useCart } from '@/context/CartContext';
import { useColors } from '@/hooks/useColors';
import { CartItem } from '@/types';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
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
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function QtyButton({ icon, onPress }: { icon: string; onPress: () => void }) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <AnimatedPressable
      style={[styles.qtyBtn, anim]}
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.85); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
      onPressOut={() => { scale.value = withSpring(1); }}
    >
      <AppIcon name={icon as any} size={16} color="#C9A84C" />
    </AnimatedPressable>
  );
}

function CartRow({ item, onRemove, onQtyChange }: {
  item: CartItem;
  onRemove: () => void;
  onQtyChange: (q: number) => void;
}) {
  const colors = useColors();
  const isDark = colors.background === '#0f172a';
  const cardBg = isDark ? '#141424' : '#fff';
  const textCol = isDark ? '#f9fafb' : '#111827';
  const mutedCol = isDark ? '#64748b' : '#6b7280';
  const borderCol = isDark ? '#1e293b' : '#f0f0f0';

  const finalPrice = getFinalPrice(item.product.price, item.product.promo);
  const subtotal = (finalPrice * item.quantity).toFixed(2);

  return (
    <View style={[styles.row, { backgroundColor: cardBg, borderColor: borderCol }]}>
      <View style={styles.rowImageWrap}>
        <Image source={{ uri: item.product.image }} style={styles.rowImage} />
        {item.product.promo > 0 && (
          <View style={styles.rowBadge}>
            <Text style={styles.rowBadgeText}>-{item.product.promo}%</Text>
          </View>
        )}
      </View>

      <View style={styles.rowBody}>
        <View style={styles.rowTop}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowBrand, { color: '#C9A84C' }]}>{item.product.brand}</Text>
            <Text style={[styles.rowName, { color: textCol }]} numberOfLines={2}>{item.product.name}</Text>
            <View style={[styles.sizePill, { borderColor: borderCol }]}>
              <Text style={[styles.sizeText, { color: mutedCol }]}>Taille {item.selectedSize}</Text>
            </View>
          </View>
          <Pressable onPress={onRemove} hitSlop={10}>
            <AppIcon name="trash-outline" size={18} color="#ef4444" />
          </Pressable>
        </View>

        <View style={styles.rowBottom}>
          <View style={styles.qtyWrap}>
            <QtyButton icon="remove" onPress={() => onQtyChange(item.quantity - 1)} />
            <Text style={[styles.qtyNum, { color: textCol }]}>{item.quantity}</Text>
            <QtyButton icon="add" onPress={() => onQtyChange(item.quantity + 1)} />
          </View>
          <View style={styles.rowPrices}>
            {item.product.promo > 0 && (
              <Text style={[styles.origPrice, { color: mutedCol }]}>{item.product.price} MAD</Text>
            )}
            <Text style={styles.subtotal}>{subtotal} MAD</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function CartScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { items, updateQuantity, removeFromCart, clearCart, total, itemCount } = useCart();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const isDark = colors.background === '#0f172a';
  const bg = isDark ? '#0a0a14' : '#f8f7f4';
  const cardBg = isDark ? '#141424' : '#fff';
  const textCol = isDark ? '#f9fafb' : '#111827';
  const mutedCol = isDark ? '#64748b' : '#6b7280';
  const borderCol = isDark ? '#1e293b' : '#e5e7eb';

  const handleCheckout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/checkout' as any);
  };

  if (items.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: bg }}>
        <LinearGradient
          colors={isDark ? ['#0a0a14', '#0d1a2e'] : ['#0d1a2e', '#0d2244']}
          style={[styles.header, { paddingTop: topPad + 10 }]}
        >
          <Text style={styles.headerEyebrow}>AL-FIRDAOUS STORE</Text>
          <Text style={styles.headerTitle}>Mon Panier</Text>
        </LinearGradient>
        <View style={styles.emptyWrap}>
          <View style={styles.emptyIcon}>
            <AppIcon name="cart-outline" size={40} color="#C9A84C" />
          </View>
          <Text style={[styles.emptyTitle, { color: textCol }]}>Panier vide</Text>
          <Text style={[styles.emptySub, { color: mutedCol }]}>
            Ajoutez des produits à votre panier pour commencer vos achats.
          </Text>
          <Pressable style={styles.browseBtn} onPress={() => router.push('/(tabs)/catalog' as any)}>
            <Text style={styles.browseBtnText}>Parcourir la boutique</Text>
            <AppIcon name="arrow-forward" size={16} color="#0d1a2e" />
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <LinearGradient
        colors={isDark ? ['#0a0a14', '#0d1a2e'] : ['#0d1a2e', '#0d2244']}
        style={[styles.header, { paddingTop: topPad + 10 }]}
      >
        <View>
          <Text style={styles.headerEyebrow}>AL-FIRDAOUS STORE</Text>
          <Text style={styles.headerTitle}>Mon Panier</Text>
        </View>
        <Pressable
          style={styles.clearBtn}
          onPress={() => Alert.alert('Vider le panier', 'Tous les articles seront supprimés.', [
            { text: 'Annuler', style: 'cancel' },
            { text: 'Vider', style: 'destructive', onPress: clearCart },
          ])}
        >
          <Text style={styles.clearBtnText}>Vider</Text>
        </Pressable>
      </LinearGradient>

      <FlatList
        data={items}
        keyExtractor={item => `${item.product.id}-${item.selectedSize}`}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CartRow
            item={item}
            onRemove={() => removeFromCart(item.product.id, item.selectedSize)}
            onQtyChange={q => updateQuantity(item.product.id, item.selectedSize, q)}
          />
        )}
        ListFooterComponent={
          <View style={[styles.summary, { backgroundColor: cardBg, borderColor: borderCol }]}>
            {/* Delivery note */}
            <View style={styles.deliveryRow}>
              <AppIcon name="shield-checkmark-outline" size={18} color="#22c55e" />
              <Text style={[styles.deliveryText, { color: '#22c55e' }]}>Livraison gratuite · Retour 30 jours</Text>
            </View>

            <View style={[styles.divider, { backgroundColor: borderCol }]} />

            <View style={styles.summaryLine}>
              <Text style={[styles.summaryLabel, { color: mutedCol }]}>Articles ({itemCount})</Text>
              <Text style={[styles.summaryVal, { color: textCol }]}>{total.toFixed(2)} MAD</Text>
            </View>
            <View style={styles.summaryLine}>
              <Text style={[styles.summaryLabel, { color: mutedCol }]}>Livraison</Text>
              <Text style={[styles.summaryVal, { color: '#22c55e' }]}>Gratuite</Text>
            </View>

            <View style={[styles.divider, { backgroundColor: borderCol }]} />

            <View style={styles.summaryLine}>
              <Text style={[styles.totalLabel, { color: textCol }]}>Total</Text>
              <Text style={styles.totalVal}>{total.toFixed(2)} MAD</Text>
            </View>

            <Pressable style={styles.checkoutBtn} onPress={handleCheckout}>
              <LinearGradient colors={['#C9A84C', '#e8c96d']} style={styles.checkoutGrad}>
                <AppIcon name="bag-check-outline" size={20} color="#0d1a2e" />
                <Text style={styles.checkoutText}>Commander — {total.toFixed(0)} MAD</Text>
              </LinearGradient>
            </Pressable>

            <View style={{ height: bottomPad + 20 }} />
          </View>
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
  clearBtn: {
    backgroundColor: 'rgba(239,68,68,0.15)', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)',
  },
  clearBtnText: { color: '#ef4444', fontSize: 13, fontFamily: 'Inter_700Bold' },

  list: { padding: 14, gap: 12 },

  row: {
    flexDirection: 'row', gap: 12, borderRadius: 18,
    padding: 14, borderWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  rowImageWrap: { position: 'relative' },
  rowImage: { width: 86, height: 86, borderRadius: 12 },
  rowBadge: {
    position: 'absolute', top: 4, left: 4, backgroundColor: '#ef4444',
    borderRadius: 6, paddingHorizontal: 5, paddingVertical: 2,
  },
  rowBadgeText: { color: '#fff', fontSize: 9, fontFamily: 'Inter_700Bold' },

  rowBody: { flex: 1, gap: 10 },
  rowTop: { flexDirection: 'row', gap: 8 },
  rowBrand: { fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 1 },
  rowName: { fontSize: 14, fontFamily: 'Inter_700Bold', lineHeight: 19, marginTop: 1 },
  sizePill: {
    alignSelf: 'flex-start', borderWidth: 1, borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 3, marginTop: 4,
  },
  sizeText: { fontSize: 11, fontFamily: 'Inter_500Medium' },
  rowBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  qtyWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 0,
    borderRadius: 12, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.3)',
  },
  qtyBtn: { padding: 9, backgroundColor: 'rgba(201,168,76,0.08)' },
  qtyNum: { minWidth: 30, textAlign: 'center', fontSize: 15, fontFamily: 'Inter_700Bold' },

  rowPrices: { alignItems: 'flex-end', gap: 1 },
  origPrice: { fontSize: 11, fontFamily: 'Inter_400Regular', textDecorationLine: 'line-through' },
  subtotal: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#C9A84C' },

  summary: {
    marginHorizontal: 0, marginTop: 4, borderRadius: 20,
    padding: 20, gap: 14, borderWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 5,
  },
  deliveryRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  deliveryText: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  divider: { height: 1 },
  summaryLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  summaryVal: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  totalLabel: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  totalVal: { fontSize: 22, fontFamily: 'Inter_700Bold', color: '#C9A84C' },

  checkoutBtn: { borderRadius: 16, overflow: 'hidden', marginTop: 4 },
  checkoutGrad: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 17,
  },
  checkoutText: { color: '#0d1a2e', fontSize: 16, fontFamily: 'Inter_700Bold' },

  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, paddingHorizontal: 36 },
  emptyIcon: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: 'rgba(201,168,76,0.1)', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: 'rgba(201,168,76,0.35)',
  },
  emptyTitle: { fontSize: 22, fontFamily: 'Inter_700Bold' },
  emptySub: { fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'center', lineHeight: 21 },
  browseBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#C9A84C', borderRadius: 25, paddingHorizontal: 26, paddingVertical: 14, marginTop: 4,
  },
  browseBtnText: { color: '#0d1a2e', fontSize: 15, fontFamily: 'Inter_700Bold' },
});
