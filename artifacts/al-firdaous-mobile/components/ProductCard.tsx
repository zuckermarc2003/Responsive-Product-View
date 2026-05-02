import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import {
  Dimensions,
  Image,
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
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useColors } from '@/hooks/useColors';
import { Product } from '@/types';
import { getFinalPrice } from '@/constants/data';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface ProductCardProps {
  product: Product;
  variant?: 'grid' | 'carousel';
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const ProductCard = React.memo(({ product, variant = 'grid' }: ProductCardProps) => {
  const colors = useColors();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const scale = useSharedValue(1);
  const heartScale = useSharedValue(1);
  const inWishlist = isInWishlist(product.id);

  const cardWidth = variant === 'carousel' ? 172 : (SCREEN_WIDTH - 48) / 2;
  const finalPrice = getFinalPrice(product.price, product.promo);

  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = useCallback(() => {
    router.push(`/product/${product.id}` as any);
  }, [product.id]);

  const handleWishlist = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    heartScale.value = withSpring(1.4, {}, () => {
      heartScale.value = withSpring(1);
    });
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  }, [inWishlist, product, addToWishlist, removeFromWishlist, heartScale]);

  const handleAddToCart = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    addToCart(product, product.sizes[0] ?? '');
  }, [product, addToCart]);

  const heartStyle = useAnimatedStyle(() => ({ transform: [{ scale: heartScale.value }] }));

  const styles = makeStyles(colors, cardWidth);

  return (
    <AnimatedPressable
      style={[styles.card, animStyle]}
      onPress={handlePress}
      onPressIn={() => { scale.value = withSpring(0.96); }}
      onPressOut={() => { scale.value = withSpring(1); }}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />

        {product.promo > 0 && (
          <View style={styles.promoBadge}>
            <Text style={styles.promoText}>-{product.promo}%</Text>
          </View>
        )}

        {product.isNew && product.promo === 0 && (
          <View style={[styles.promoBadge, styles.newBadge]}>
            <Text style={styles.promoText}>NEW</Text>
          </View>
        )}

        <Animated.View style={[styles.wishlistBtn, heartStyle]}>
          <Pressable onPress={handleWishlist} hitSlop={8}>
            <Ionicons
              name={inWishlist ? 'heart' : 'heart-outline'}
              size={20}
              color={inWishlist ? colors.destructive : '#fff'}
            />
          </Pressable>
        </Animated.View>
      </View>

      <View style={styles.info}>
        <Text style={styles.brand} numberOfLines={1}>{product.brand}</Text>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>

        <View style={styles.priceRow}>
          <Text style={styles.finalPrice}>{finalPrice.toFixed(0)} MAD</Text>
          {product.promo > 0 && (
            <Text style={styles.originalPrice}>{product.price} MAD</Text>
          )}
        </View>

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={11} color={colors.starGold} />
          <Text style={styles.ratingText}>{product.rating}</Text>
          <Text style={styles.reviewCount}>({product.reviewCount})</Text>
        </View>
      </View>

      <Pressable style={styles.cartBtn} onPress={handleAddToCart}>
        <Ionicons name="cart-outline" size={16} color="#fff" />
        <Text style={styles.cartBtnText}>Ajouter</Text>
      </Pressable>
    </AnimatedPressable>
  );
});

ProductCard.displayName = 'ProductCard';

const makeStyles = (colors: ReturnType<typeof useColors>, cardWidth: number) =>
  StyleSheet.create({
    card: {
      width: cardWidth,
      backgroundColor: colors.card,
      borderRadius: 14,
      overflow: 'hidden',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 4,
      marginBottom: 4,
    },
    imageContainer: {
      width: '100%',
      aspectRatio: 1,
      backgroundColor: colors.muted,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    promoBadge: {
      position: 'absolute',
      top: 8,
      left: 8,
      backgroundColor: colors.promoBadge,
      borderRadius: 6,
      paddingHorizontal: 7,
      paddingVertical: 3,
    },
    newBadge: {
      backgroundColor: colors.primary,
    },
    promoText: {
      color: '#fff',
      fontSize: 10,
      fontFamily: 'Inter_700Bold',
      letterSpacing: 0.3,
    },
    wishlistBtn: {
      position: 'absolute',
      top: 8,
      right: 8,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: 'rgba(0,0,0,0.35)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    info: {
      padding: 10,
      gap: 2,
    },
    brand: {
      fontSize: 10,
      fontFamily: 'Inter_500Medium',
      color: colors.mutedForeground,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    name: {
      fontSize: 13,
      fontFamily: 'Inter_600SemiBold',
      color: colors.foreground,
      lineHeight: 18,
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: 6,
      marginTop: 4,
    },
    finalPrice: {
      fontSize: 15,
      fontFamily: 'Inter_700Bold',
      color: colors.priceGreen,
    },
    originalPrice: {
      fontSize: 11,
      fontFamily: 'Inter_400Regular',
      color: colors.mutedForeground,
      textDecorationLine: 'line-through',
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      marginTop: 2,
    },
    ratingText: {
      fontSize: 11,
      fontFamily: 'Inter_600SemiBold',
      color: colors.foreground,
    },
    reviewCount: {
      fontSize: 10,
      fontFamily: 'Inter_400Regular',
      color: colors.mutedForeground,
    },
    cartBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5,
      backgroundColor: colors.primary,
      paddingVertical: 9,
    },
    cartBtnText: {
      color: '#fff',
      fontSize: 12,
      fontFamily: 'Inter_700Bold',
      letterSpacing: 0.3,
    },
  });
