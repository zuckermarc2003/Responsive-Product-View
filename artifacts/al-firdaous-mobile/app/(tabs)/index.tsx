import { AppIcon } from '@/components/AppIcon';
import { ProductCard } from '@/components/ProductCard';
import { SkeletonCard } from '@/components/SkeletonCard';
import { CATEGORIES } from '@/constants/data';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useColors } from '@/hooks/useColors';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
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

const { width: SW } = Dimensions.get('window');
const CARD_W = 172;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function HeroBannerCard({ onPress }: { onPress: () => void }) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <AnimatedPressable
      style={[styles.heroBannerWrap, anim]}
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.98); }}
      onPressOut={() => { scale.value = withSpring(1); }}
    >
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80' }}
        style={styles.heroImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(10,10,20,0.55)', 'rgba(10,10,20,0.92)']}
        style={styles.heroGrad}
      >
        <View style={styles.heroPill}>
          <Text style={styles.heroPillText}>✦  NOUVELLE COLLECTION</Text>
        </View>
        <Text style={styles.heroTitle}>Été 2025</Text>
        <Text style={styles.heroSub}>Jusqu'à 45% de réduction</Text>
        <View style={styles.heroRow}>
          <Text style={styles.heroCtaText}>Découvrir</Text>
          <AppIcon name="arrow-forward" size={14} color="#C9A84C" />
        </View>
      </LinearGradient>
    </AnimatedPressable>
  );
}

function CategoryPill({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      style={[styles.pill, active && styles.pillActive]}
      onPress={onPress}
    >
      {active && (
        <View style={styles.pillDot} />
      )}
      <Text style={[styles.pillText, active && styles.pillTextActive]}>{label}</Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { itemCount } = useCart();
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const { data: allProducts = [], isLoading } = useProducts();

  const catLabels: Record<string, string> = {
    all: t.catAll, Shoe: t.catShoe, Sandal: t.catSandal, Shirt: t.catShirt, Pant: t.catPant,
  };

  const filtered = useMemo(() => {
    if (selectedCategory === 'all') return allProducts;
    return allProducts.filter(p => p.product_type === selectedCategory);
  }, [allProducts, selectedCategory]);

  const newArrivals = useMemo(() => filtered.filter(p => p.isNew), [filtered]);
  const onSale = useMemo(() => filtered.filter(p => p.promo > 0), [filtered]);

  const isDark = colors.background === '#0f172a';

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#0a0a14' : '#f8f7f4' }}>
      <StatusBar barStyle="light-content" />

      {/* ── Header ── */}
      <LinearGradient
        colors={isDark ? ['#0a0a14', '#0d1a2e'] : ['#0d1a2e', '#0d2244']}
        style={[styles.header, { paddingTop: topPad + 10 }]}
      >
        <Image
          source={{ uri: 'https://www.alfirdaousstore.com/assets/WHITE%20FIRDAOUS%20STORE-DgnBjEdy.png' }}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.headerRight}>
          <Pressable style={styles.iconBtn} onPress={() => router.push('/(tabs)/catalog' as any)}>
            <AppIcon name="search-outline" size={22} color="#fff" />
          </Pressable>
          <Pressable style={styles.iconBtn} onPress={() => router.push('/(tabs)/cart' as any)}>
            <AppIcon name="cart-outline" size={22} color="#fff" />
            {itemCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{itemCount > 9 ? '9+' : itemCount}</Text>
              </View>
            )}
          </Pressable>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Hero ── */}
        <HeroBannerCard onPress={() => setSelectedCategory('Shoe')} />

        {/* ── Marquee-style ribbon ── */}
        <LinearGradient colors={['#C9A84C', '#e8c96d', '#C9A84C']} style={styles.ribbon}>
          <Text style={styles.ribbonText}>✦  LIVRAISON GRATUITE AU MAROC  ✦  RETOUR SOUS 30 JOURS  ✦  PAIEMENT À LA LIVRAISON  ✦</Text>
        </LinearGradient>

        {/* ── Category Pills ── */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#f9fafb' : '#111' }]}>Catégories</Text>
          {isLoading && <Text style={styles.loadingDot}>•••</Text>}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
          {CATEGORIES.map(cat => (
            <CategoryPill
              key={cat.key}
              label={catLabels[cat.key] ?? cat.label}
              active={selectedCategory === cat.key}
              onPress={() => setSelectedCategory(cat.key)}
            />
          ))}
        </ScrollView>

        {/* ── New Arrivals ── */}
        {(isLoading || newArrivals.length > 0) && (
          <>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={[styles.sectionTitle, { color: isDark ? '#f9fafb' : '#111' }]}>{t.newArrivals}</Text>
                <View style={styles.sectionUnderline} />
              </View>
              <Pressable onPress={() => router.push('/(tabs)/catalog' as any)}>
                <Text style={styles.seeAll}>{t.seeAll} →</Text>
              </Pressable>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
              {isLoading
                ? [1, 2, 3].map(i => <SkeletonCard key={i} width={CARD_W} />)
                : newArrivals.map((item, idx) => (
                    <React.Fragment key={item.id}>
                      {idx > 0 && <View style={{ width: 14 }} />}
                      <ProductCard product={item} variant="carousel" />
                    </React.Fragment>
                  ))}
            </ScrollView>
          </>
        )}

        {/* ── Promo Strip ── */}
        <Pressable onPress={() => setSelectedCategory('Shoe')}>
          <LinearGradient colors={['#0d1a2e', '#1a3050']} style={styles.promoStrip}>
            <View style={styles.promoLeft}>
              <Text style={styles.promoLabel}>SOLDES</Text>
              <Text style={styles.promoHeadline}>Jusqu'à 45%</Text>
              <Text style={styles.promoSub}>sur les Chaussures & Sandales</Text>
            </View>
            <View style={styles.promoIcon}>
              <AppIcon name="flash" size={32} color="#C9A84C" />
            </View>
          </LinearGradient>
        </Pressable>

        {/* ── On Sale ── */}
        {(isLoading || onSale.length > 0) && (
          <>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={[styles.sectionTitle, { color: isDark ? '#f9fafb' : '#111' }]}>{t.onSale}</Text>
                <View style={[styles.sectionUnderline, { backgroundColor: '#ef4444' }]} />
              </View>
              <Pressable onPress={() => router.push('/(tabs)/catalog' as any)}>
                <Text style={styles.seeAll}>{t.seeAll} →</Text>
              </Pressable>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
              {isLoading
                ? [1, 2, 3].map(i => <SkeletonCard key={i} width={CARD_W} />)
                : onSale.map((item, idx) => (
                    <React.Fragment key={item.id}>
                      {idx > 0 && <View style={{ width: 14 }} />}
                      <ProductCard product={item} variant="carousel" />
                    </React.Fragment>
                  ))}
            </ScrollView>
          </>
        )}

        {/* ── All Products ── */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTitle, { color: isDark ? '#f9fafb' : '#111' }]}>
              {selectedCategory === 'all' ? t.allProducts : catLabels[selectedCategory] ?? selectedCategory}
            </Text>
            <View style={styles.sectionUnderline} />
          </View>
        </View>

        <View style={[styles.grid, { paddingHorizontal: 14, gap: 14 }]}>
          {filtered.map((product: Product) => (
            <ProductCard key={product.id} product={product} variant="grid" />
          ))}
        </View>

        <View style={{ height: Platform.OS === 'web' ? 34 : insets.bottom + 90 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingBottom: 16, paddingHorizontal: 18,
  },
  logo: { height: 30, width: 140 },
  headerRight: { flexDirection: 'row', gap: 2 },
  iconBtn: { padding: 9, position: 'relative' },
  badge: {
    position: 'absolute', top: 4, right: 4,
    backgroundColor: '#ef4444', borderRadius: 9, minWidth: 17, height: 17,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3,
  },
  badgeText: { color: '#fff', fontSize: 9, fontFamily: 'Inter_700Bold' },

  heroBannerWrap: { height: 260, marginHorizontal: 14, marginTop: 14, borderRadius: 20, overflow: 'hidden' },
  heroImage: { width: '100%', height: '100%' },
  heroGrad: {
    position: 'absolute', inset: 0, justifyContent: 'flex-end', padding: 20,
  },
  heroPill: {
    alignSelf: 'flex-start', backgroundColor: 'rgba(201,168,76,0.22)',
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5,
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.5)', marginBottom: 10,
  },
  heroPillText: { color: '#C9A84C', fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 1.5 },
  heroTitle: { color: '#fff', fontSize: 34, fontFamily: 'Inter_700Bold', lineHeight: 38 },
  heroSub: { color: 'rgba(255,255,255,0.75)', fontSize: 14, fontFamily: 'Inter_400Regular', marginTop: 4 },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14 },
  heroCtaText: { color: '#C9A84C', fontSize: 14, fontFamily: 'Inter_700Bold' },

  ribbon: { marginTop: 14, paddingVertical: 9, paddingHorizontal: 16 },
  ribbonText: { color: '#0d1a2e', fontSize: 11, fontFamily: 'Inter_700Bold', letterSpacing: 1 },

  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 18, marginTop: 26, marginBottom: 14,
  },
  sectionTitle: { fontSize: 19, fontFamily: 'Inter_700Bold' },
  sectionUnderline: { width: 32, height: 3, backgroundColor: '#C9A84C', borderRadius: 2, marginTop: 3 },
  seeAll: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#C9A84C' },
  loadingDot: { color: '#C9A84C', fontSize: 14, letterSpacing: 4 },

  pillRow: { paddingHorizontal: 18, gap: 8, paddingBottom: 2 },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 18, paddingVertical: 9, borderRadius: 24,
    backgroundColor: 'transparent', borderWidth: 1.5, borderColor: 'rgba(201,168,76,0.3)',
  },
  pillActive: { backgroundColor: '#C9A84C', borderColor: '#C9A84C' },
  pillDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#0d1a2e' },
  pillText: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#C9A84C' },
  pillTextActive: { color: '#0d1a2e' },

  hList: { paddingHorizontal: 18, gap: 14 },

  promoStrip: {
    marginHorizontal: 14, marginTop: 24, borderRadius: 18, padding: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  promoLeft: { gap: 3 },
  promoLabel: { color: '#C9A84C', fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 2 },
  promoHeadline: { color: '#fff', fontSize: 28, fontFamily: 'Inter_700Bold' },
  promoSub: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontFamily: 'Inter_400Regular' },
  promoIcon: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: 'rgba(201,168,76,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },

  grid: { flexDirection: 'row', flexWrap: 'wrap' },
});
