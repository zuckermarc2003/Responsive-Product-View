import { AppIcon } from '@/components/AppIcon';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { ProductCard } from '@/components/ProductCard';
import { SkeletonCard } from '@/components/SkeletonCard';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useColors } from '@/hooks/useColors';
import { useProduct, useRelated, useReviews, useAddReview } from '@/hooks/useProducts';
import { getFinalPrice } from '@/constants/data';
import { Review } from '@/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const { data: product, isLoading: loadingProduct } = useProduct(id ?? '');
  const { data: related = [], isLoading: loadingRelated } = useRelated(id ?? '');
  const { data: serverReviews = [] } = useReviews(id ?? '');
  const addReviewMutation = useAddReview(id ?? '');

  const [imageIndex, setImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewEmail, setReviewEmail] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewStars, setReviewStars] = useState(0);
  // Optimistic local reviews that start from server data and allow adding
  const [localReviews, setLocalReviews] = useState<Review[]>([]);

  const cartBtnScale = useSharedValue(1);
  const heartScale = useSharedValue(1);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;
  const styles = makeStyles(colors, topPad, bottomPad);

  // Sync reviews whenever server data changes (handles async load)
  useEffect(() => {
    setLocalReviews(serverReviews);
  }, [serverReviews]);

  const inWishlist = product ? isInWishlist(product.id) : false;

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    if (!selectedSize) {
      Alert.alert('Sélectionnez une taille', 'Veuillez choisir une taille avant d\'ajouter au panier.');
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    cartBtnScale.value = withSpring(0.94, {}, () => { cartBtnScale.value = withSpring(1); });
    addToCart(product, selectedSize);
    Alert.alert('Ajouté!', `${product.name} (${selectedSize}) ajouté au panier.`);
  }, [selectedSize, product, addToCart, cartBtnScale]);

  const handleWishlist = useCallback(() => {
    if (!product) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    heartScale.value = withSpring(1.5, {}, () => { heartScale.value = withSpring(1); });
    if (inWishlist) removeFromWishlist(product.id);
    else addToWishlist(product);
  }, [inWishlist, product, addToWishlist, removeFromWishlist, heartScale]);

  const cartBtnStyle = useAnimatedStyle(() => ({ transform: [{ scale: cartBtnScale.value }] }));
  const heartStyle = useAnimatedStyle(() => ({ transform: [{ scale: heartScale.value }] }));

  const closeReviewModal = useCallback(() => {
    setShowReviewModal(false);
    setReviewName('');
    setReviewEmail('');
    setReviewText('');
    setReviewStars(0);
  }, []);

  const handleSubmitReview = useCallback(async () => {
    if (!reviewName.trim() || !reviewText.trim() || reviewStars === 0) {
      Alert.alert('Erreur', 'Veuillez remplir le nom, votre avis et noter le produit.');
      return;
    }
    if (!reviewEmail.trim() || !reviewEmail.includes('@')) {
      Alert.alert('Erreur', 'Veuillez entrer un email valide.');
      return;
    }

    // Optimistic update — show review immediately
    const optimistic: Review = {
      id: `local-${Date.now()}`,
      author: reviewName.trim(),
      email: reviewEmail.trim(),
      rating: reviewStars,
      date: new Date().toLocaleDateString('fr-FR'),
      comment: reviewText.trim(),
    };
    setLocalReviews(prev => [optimistic, ...prev]);
    closeReviewModal();

    // Post to server in background
    try {
      await addReviewMutation.mutateAsync({
        name: reviewName.trim(),
        email: reviewEmail.trim(),
        review: reviewText.trim(),
        stars: reviewStars,
        product: Number(id),
        date: new Date().toISOString(),
      });
    } catch {
      // Already shown optimistically — server will sync on next load
    }
  }, [reviewName, reviewEmail, reviewText, reviewStars, id, addReviewMutation, closeReviewModal]);

  if (loadingProduct) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Pressable style={[styles.backBtn, { top: topPad + 8, position: 'absolute', left: 12 }]} onPress={() => router.back()}>
          <AppIcon name="arrow-back" size={22} color={colors.foreground} />
        </Pressable>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 12, color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }}>
          Chargement...
        </Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center', gap: 12 }]}>
        <Pressable style={[styles.backBtn, { top: topPad + 8, position: 'absolute', left: 12 }]} onPress={() => router.back()}>
          <AppIcon name="arrow-back" size={22} color={colors.foreground} />
        </Pressable>
        <AppIcon name="alert-circle-outline" size={48} color={colors.border} />
        <Text style={{ fontSize: 17, fontFamily: 'Inter_700Bold', color: colors.foreground }}>Produit introuvable</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={{ color: colors.primary, fontFamily: 'Inter_600SemiBold' }}>Retourner</Text>
        </Pressable>
      </View>
    );
  }

  const finalPrice = getFinalPrice(product.price, product.promo);
  const images = product.images?.length ? product.images : [product.image];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* ── Image Gallery ── */}
        <View style={styles.galleryContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={e => {
              setImageIndex(Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH));
            }}
          >
            {images.map((uri, i) => (
              <Image key={i} source={{ uri }} style={styles.galleryImage} resizeMode="cover" />
            ))}
          </ScrollView>

          {images.length > 1 && (
            <View style={styles.dotsRow}>
              {images.map((_, i) => (
                <View key={i} style={[styles.dot, i === imageIndex && styles.dotActive]} />
              ))}
            </View>
          )}

          <Pressable style={[styles.backBtn, { top: topPad + 8 }]} onPress={() => router.back()}>
            <AppIcon name="arrow-back" size={22} color="#fff" />
          </Pressable>

          <Animated.View style={[styles.wishlistBtn, { top: topPad + 8 }, heartStyle]}>
            <Pressable onPress={handleWishlist}>
              <AppIcon
                name={inWishlist ? 'heart' : 'heart-outline'}
                size={22}
                color={inWishlist ? colors.destructive : '#fff'}
              />
            </Pressable>
          </Animated.View>

          {product.promo > 0 && (
            <View style={styles.galleryBadge}>
              <Text style={styles.galleryBadgeText}>-{product.promo}%</Text>
            </View>
          )}
        </View>

        {/* ── Product Info ── */}
        <View style={styles.infoCard}>
          <View style={styles.infoTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.brand}>{product.brand}</Text>
              <Text style={styles.name}>{product.name}</Text>
              <Text style={styles.ref}>REF: {product.ref}</Text>
            </View>
            <View style={styles.ratingBox}>
              <AppIcon name="star" size={14} color={colors.starGold} />
              <Text style={styles.rating}>{product.rating}</Text>
              <Text style={styles.reviewCount}>({localReviews.length})</Text>
            </View>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.finalPrice}>{finalPrice.toFixed(2)} MAD</Text>
            {product.promo > 0 && (
              <>
                <Text style={styles.originalPrice}>{product.price.toFixed(2)} MAD</Text>
                <View style={styles.discountTag}>
                  <Text style={styles.discountTagText}>-{product.promo}%</Text>
                </View>
              </>
            )}
          </View>

          {/* Size selector */}
          <View style={styles.sizeSection}>
            <Text style={styles.sizeLabel}>
              Taille{selectedSize ? `: ${selectedSize}` : ' — Sélectionner'}
            </Text>
            <View style={styles.sizeGrid}>
              {product.sizes?.map(size => (
                <Pressable
                  key={size}
                  style={[styles.sizeBtn, selectedSize === size && styles.sizeBtnActive]}
                  onPress={() => { Haptics.selectionAsync(); setSelectedSize(size); }}
                >
                  <Text style={[styles.sizeBtnText, selectedSize === size && styles.sizeBtnTextActive]}>
                    {size}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Description */}
          <View style={styles.descSection}>
            <Text style={styles.descTitle}>Description</Text>
            <Text style={styles.descText} numberOfLines={showFullDesc ? undefined : 3}>
              {product.description}
            </Text>
            <Pressable onPress={() => setShowFullDesc(v => !v)}>
              <Text style={styles.readMore}>{showFullDesc ? 'Voir moins' : 'Lire plus'}</Text>
            </Pressable>
          </View>

          {/* Features */}
          <View style={styles.featuresRow}>
            {[
              { icon: 'shield-checkmark-outline', label: 'Qualité garantie' },
              { icon: 'refresh-outline', label: 'Retour 30j' },
              { icon: 'car-outline', label: 'Livraison gratuite' },
            ].map(f => (
              <View key={f.label} style={styles.featureItem}>
                <AppIcon name={f.icon as any} size={20} color={colors.primary} />
                <Text style={styles.featureText}>{f.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Reviews Section ── */}
        <View style={styles.reviewsSection}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.reviewsTitle}>Avis clients</Text>
            <View style={styles.overallRating}>
              <Text style={styles.overallRatingNum}>{product.rating.toFixed(1)}</Text>
              <View>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <AppIcon
                      key={s}
                      name={s <= Math.floor(product.rating) ? 'star' : 'star-outline'}
                      size={14}
                      color={colors.starGold}
                    />
                  ))}
                </View>
                <Text style={styles.reviewCountText}>{localReviews.length} avis</Text>
              </View>
            </View>
          </View>

          {localReviews.length > 0 ? (
            localReviews.map(review => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewAvatar}>
                    <Text style={styles.reviewAvatarText}>{review.author.charAt(0).toUpperCase()}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reviewAuthor}>{review.author}</Text>
                    <View style={styles.starsRow}>
                      {[1, 2, 3, 4, 5].map(s => (
                        <AppIcon key={s} name={s <= review.rating ? 'star' : 'star-outline'} size={12} color={colors.starGold} />
                      ))}
                    </View>
                  </View>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>
                <Text style={styles.reviewText}>{review.comment}</Text>
              </View>
            ))
          ) : (
            <View style={styles.noReviews}>
              <AppIcon name="chatbubble-outline" size={36} color={colors.border} />
              <Text style={[styles.noReviewsText, { color: colors.mutedForeground }]}>
                Soyez le premier à laisser un avis
              </Text>
            </View>
          )}

          <Pressable
            style={[styles.addReviewBtn, { backgroundColor: colors.primary }]}
            onPress={() => setShowReviewModal(true)}
          >
            <AppIcon name="pencil-outline" size={16} color="#fff" />
            <Text style={styles.addReviewBtnText}>Laisser un avis</Text>
          </Pressable>
        </View>

        {/* ── Related Products ── */}
        {(loadingRelated || related.length > 0) && (
          <View style={styles.relatedSection}>
            <Text style={styles.relatedTitle}>Produits similaires</Text>
            {loadingRelated ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
                {[1, 2, 3].map(i => <SkeletonCard key={i} width={172} />)}
              </ScrollView>
            ) : (
              <FlatList
                data={related}
                horizontal
                keyExtractor={p => p.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
                renderItem={({ item }) => <ProductCard product={item} variant="carousel" />}
              />
            )}
          </View>
        )}

        <View style={{ height: bottomPad + 100 }} />
      </ScrollView>

      {/* ── Sticky CTA ── */}
      <View style={[styles.cta, { paddingBottom: bottomPad + 8 }]}>
        <Animated.View style={[{ flex: 1 }, cartBtnStyle]}>
          <Pressable style={styles.cartBtn} onPress={handleAddToCart}>
            <AppIcon name="cart-outline" size={22} color="#fff" />
            <Text style={styles.cartBtnText}>Ajouter au panier</Text>
          </Pressable>
        </Animated.View>
        <Pressable style={styles.buyNowBtn} onPress={() => {
          if (!selectedSize) { Alert.alert('Sélectionnez une taille'); return; }
          addToCart(product, selectedSize);
          router.push('/(tabs)/cart' as any);
        }}>
          <Text style={styles.buyNowText}>Commander</Text>
        </Pressable>
      </View>

      {/* ── Review Modal with proper keyboard handling ── */}
      <Modal
        visible={showReviewModal}
        transparent
        animationType="slide"
        onRequestClose={closeReviewModal}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Pressable style={styles.modalBackdrop} onPress={closeReviewModal} />
          <View style={[styles.reviewFormContainer, { backgroundColor: colors.card }]}>
            {/* Handle */}
            <View style={styles.modalHandle} />

            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>Laisser un avis</Text>
              <Pressable onPress={closeReviewModal} hitSlop={12}>
                <AppIcon name="close" size={22} color={colors.foreground} />
              </Pressable>
            </View>

            <ScrollView
              style={styles.reviewFormScroll}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Star rating first — most important */}
              <Text style={[styles.formLabel, { color: colors.foreground }]}>Note *</Text>
              <View style={styles.starsInput}>
                {[1, 2, 3, 4, 5].map(s => (
                  <Pressable key={s} onPress={() => setReviewStars(s)} hitSlop={8}>
                    <AppIcon
                      name={s <= reviewStars ? 'star' : 'star-outline'}
                      size={36}
                      color={s <= reviewStars ? colors.starGold : colors.border}
                    />
                  </Pressable>
                ))}
              </View>

              <Text style={[styles.formLabel, { color: colors.foreground }]}>Nom *</Text>
              <TextInput
                style={[styles.formInput, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]}
                placeholder="Votre nom"
                placeholderTextColor={colors.mutedForeground}
                value={reviewName}
                onChangeText={setReviewName}
                autoCapitalize="words"
              />

              <Text style={[styles.formLabel, { color: colors.foreground }]}>Email *</Text>
              <TextInput
                style={[styles.formInput, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]}
                placeholder="votre@email.com"
                placeholderTextColor={colors.mutedForeground}
                value={reviewEmail}
                onChangeText={setReviewEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={[styles.formLabel, { color: colors.foreground }]}>Votre avis *</Text>
              <TextInput
                style={[styles.formTextarea, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]}
                placeholder="Partagez votre expérience avec ce produit..."
                placeholderTextColor={colors.mutedForeground}
                value={reviewText}
                onChangeText={setReviewText}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              <View style={styles.formActions}>
                <Pressable
                  style={[styles.submitBtn, { backgroundColor: colors.primary, opacity: addReviewMutation.isPending ? 0.6 : 1 }]}
                  onPress={handleSubmitReview}
                  disabled={addReviewMutation.isPending}
                >
                  <Text style={styles.submitBtnText}>
                    {addReviewMutation.isPending ? 'Envoi...' : 'Publier'}
                  </Text>
                </Pressable>
                <Pressable style={[styles.cancelBtn, { borderColor: colors.border }]} onPress={closeReviewModal}>
                  <Text style={[styles.cancelBtnText, { color: colors.foreground }]}>Annuler</Text>
                </Pressable>
              </View>

              <View style={{ height: bottomPad + 20 }} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const makeStyles = (colors: ReturnType<typeof useColors>, topPad: number, bottomPad: number) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    galleryContainer: { width: SCREEN_WIDTH, height: SCREEN_WIDTH * 1.05, backgroundColor: colors.muted },
    galleryImage: { width: SCREEN_WIDTH, height: SCREEN_WIDTH * 1.05 },
    dotsRow: {
      position: 'absolute', bottom: 12, left: 0, right: 0,
      flexDirection: 'row', justifyContent: 'center', gap: 6,
    },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' },
    dotActive: { width: 20, backgroundColor: '#fff' },
    backBtn: {
      position: 'absolute', left: 12, width: 40, height: 40, borderRadius: 20,
      backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center',
    },
    wishlistBtn: {
      position: 'absolute', right: 12, width: 40, height: 40, borderRadius: 20,
      backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center',
    },
    galleryBadge: {
      position: 'absolute', bottom: 40, left: 12,
      backgroundColor: colors.promoBadge, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4,
    },
    galleryBadgeText: { color: '#fff', fontSize: 12, fontFamily: 'Inter_700Bold' },
    infoCard: {
      backgroundColor: colors.card, borderTopLeftRadius: 24, borderTopRightRadius: 24,
      marginTop: -20, paddingTop: 24, paddingHorizontal: 20, paddingBottom: 20,
      shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 8,
    },
    infoTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
    brand: { fontSize: 11, fontFamily: 'Inter_600SemiBold', color: colors.primary, textTransform: 'uppercase', letterSpacing: 1 },
    name: { fontSize: 22, fontFamily: 'Inter_700Bold', color: colors.foreground, marginTop: 2, lineHeight: 28 },
    ref: { fontSize: 11, fontFamily: 'Inter_400Regular', color: colors.mutedForeground, marginTop: 4 },
    ratingBox: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 4 },
    rating: { fontSize: 14, fontFamily: 'Inter_700Bold', color: colors.foreground },
    reviewCount: { fontSize: 12, fontFamily: 'Inter_400Regular', color: colors.mutedForeground },
    priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 10, marginBottom: 20 },
    finalPrice: { fontSize: 28, fontFamily: 'Inter_700Bold', color: colors.priceGreen },
    originalPrice: { fontSize: 15, fontFamily: 'Inter_400Regular', color: colors.mutedForeground, textDecorationLine: 'line-through' },
    discountTag: { backgroundColor: `${colors.promoBadge}18`, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
    discountTagText: { color: colors.promoBadge, fontSize: 12, fontFamily: 'Inter_700Bold' },
    sizeSection: { marginBottom: 20 },
    sizeLabel: { fontSize: 14, fontFamily: 'Inter_700Bold', color: colors.foreground, marginBottom: 10 },
    sizeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    sizeBtn: {
      minWidth: 48, height: 44, borderRadius: 10,
      borderWidth: 1.5, borderColor: colors.border,
      alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12,
    },
    sizeBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    sizeBtnText: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: colors.foreground },
    sizeBtnTextActive: { color: '#fff' },
    descSection: { marginBottom: 20 },
    descTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', color: colors.foreground, marginBottom: 8 },
    descText: { fontSize: 14, fontFamily: 'Inter_400Regular', color: colors.mutedForeground, lineHeight: 22 },
    readMore: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: colors.primary, marginTop: 6 },
    featuresRow: {
      flexDirection: 'row', justifyContent: 'space-around',
      paddingVertical: 16, borderTopWidth: 1, borderTopColor: colors.border,
    },
    featureItem: { alignItems: 'center', gap: 6 },
    featureText: { fontSize: 11, fontFamily: 'Inter_500Medium', color: colors.mutedForeground, textAlign: 'center' },

    // Reviews
    reviewsSection: { padding: 20 },
    reviewsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
    reviewsTitle: { fontSize: 18, fontFamily: 'Inter_700Bold', color: colors.foreground },
    overallRating: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    overallRatingNum: { fontSize: 32, fontFamily: 'Inter_700Bold', color: colors.foreground },
    starsRow: { flexDirection: 'row', gap: 2 },
    reviewCountText: { fontSize: 11, fontFamily: 'Inter_400Regular', color: colors.mutedForeground, marginTop: 2 },
    noReviews: { alignItems: 'center', paddingVertical: 24, gap: 10 },
    noReviewsText: { fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'center' },
    reviewCard: {
      backgroundColor: colors.card, borderRadius: 14, padding: 14, marginBottom: 10,
      shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
    },
    reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
    reviewAvatar: {
      width: 36, height: 36, borderRadius: 18,
      backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center',
    },
    reviewAvatarText: { fontSize: 16, fontFamily: 'Inter_700Bold', color: colors.primary },
    reviewAuthor: { fontSize: 14, fontFamily: 'Inter_700Bold', color: colors.foreground },
    reviewDate: { fontSize: 11, fontFamily: 'Inter_400Regular', color: colors.mutedForeground },
    reviewText: { fontSize: 13, fontFamily: 'Inter_400Regular', color: colors.mutedForeground, lineHeight: 20 },
    addReviewBtn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
      marginTop: 16, paddingVertical: 14, borderRadius: 12,
    },
    addReviewBtnText: { color: '#fff', fontSize: 14, fontFamily: 'Inter_700Bold' },

    // Related
    relatedSection: { marginBottom: 16 },
    relatedTitle: { fontSize: 18, fontFamily: 'Inter_700Bold', color: colors.foreground, paddingHorizontal: 16, marginBottom: 12 },

    // CTA
    cta: {
      flexDirection: 'row', gap: 10, padding: 16, paddingTop: 12,
      backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.border,
      shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 12,
    },
    cartBtn: {
      flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
      backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 15,
    },
    cartBtnText: { color: '#fff', fontSize: 15, fontFamily: 'Inter_700Bold' },
    buyNowBtn: {
      paddingHorizontal: 20, borderRadius: 14,
      borderWidth: 2, borderColor: colors.primary,
      alignItems: 'center', justifyContent: 'center',
    },
    buyNowText: { color: colors.primary, fontSize: 14, fontFamily: 'Inter_700Bold' },

    // Review Modal
    modalOverlay: { flex: 1, justifyContent: 'flex-end' },
    modalBackdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.55)',
    },
    reviewFormContainer: {
      borderTopLeftRadius: 24, borderTopRightRadius: 24,
      paddingHorizontal: 20, maxHeight: '90%',
    },
    modalHandle: {
      width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border,
      alignSelf: 'center', marginTop: 12, marginBottom: 4,
    },
    modalHeader: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      paddingVertical: 16, borderBottomWidth: 1,
    },
    modalTitle: { fontSize: 18, fontFamily: 'Inter_700Bold' },
    reviewFormScroll: { paddingTop: 8 },
    formLabel: { fontSize: 13, fontFamily: 'Inter_700Bold', marginBottom: 8, marginTop: 16 },
    formInput: {
      borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12,
      fontFamily: 'Inter_400Regular', fontSize: 14,
    },
    formTextarea: {
      borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12,
      fontFamily: 'Inter_400Regular', fontSize: 14, minHeight: 100,
    },
    starsInput: { flexDirection: 'row', gap: 10, marginBottom: 8 },
    formActions: { flexDirection: 'row', gap: 12, marginTop: 24 },
    submitBtn: { flex: 2, paddingVertical: 15, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    submitBtnText: { color: '#fff', fontSize: 15, fontFamily: 'Inter_700Bold' },
    cancelBtn: { flex: 1, borderWidth: 1.5, borderRadius: 12, alignItems: 'center', justifyContent: 'center', paddingVertical: 15 },
    cancelBtnText: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  });
