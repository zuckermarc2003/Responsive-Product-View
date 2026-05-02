import { AppIcon } from '@/components/AppIcon';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '@/context/CartContext';
import { useLanguage, type Lang } from '@/context/LanguageContext';
import { THEMES, useTheme } from '@/context/ThemeContext';
import { useWishlist } from '@/context/WishlistContext';
import { useColors } from '@/hooks/useColors';

interface SettingRowProps {
  icon: string;
  label: string;
  value?: string;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (v: boolean) => void;
  onPress?: () => void;
  color?: string;
}

function SettingRow({ icon, label, value, toggle, toggleValue, onToggle, onPress, color }: SettingRowProps) {
  const colors = useColors();
  return (
    <Pressable style={rowStyles.row} onPress={onPress} disabled={toggle && !onPress}>
      <View style={[rowStyles.iconBox, { backgroundColor: color ? `${color}18` : colors.secondary }]}>
        <AppIcon name={icon as any} size={18} color={color ?? colors.primary} />
      </View>
      <Text style={[rowStyles.label, { color: colors.foreground }]}>{label}</Text>
      <View style={rowStyles.right}>
        {value && <Text style={[rowStyles.value, { color: colors.mutedForeground }]}>{value}</Text>}
        {toggle && onToggle ? (
          <Switch
            value={toggleValue}
            onValueChange={onToggle}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#fff"
          />
        ) : (
          !toggle && <AppIcon name="chevron-forward" size={16} color={colors.border} />
        )}
      </View>
    </Pressable>
  );
}

const rowStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, gap: 14 },
  iconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  label: { flex: 1, fontSize: 15, fontFamily: 'Inter_500Medium' },
  right: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  value: { fontSize: 14, fontFamily: 'Inter_400Regular' },
});

function ThemeSelector() {
  const colors = useColors();
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();
  return (
    <View style={[themeStyles.section, { marginHorizontal: 16, marginBottom: 12 }]}>
      <Text style={[themeStyles.title, { color: colors.foreground }]}>{t.themeSection}</Text>
      <View style={[themeStyles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {THEMES.map((th, i) => (
          <Pressable
            key={th.id}
            style={[
              themeStyles.row,
              i < THEMES.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
            ]}
            onPress={() => setTheme(th.id)}
          >
            <View style={[themeStyles.swatch, { backgroundColor: th.primary }]} />
            <Text style={[themeStyles.label, { color: colors.foreground }]}>{th.label}</Text>
            <Text style={[themeStyles.sub, { color: colors.mutedForeground }]}>{th.primary}</Text>
            {theme.id === th.id && (
              <AppIcon name="checkmark-circle" size={20} color={th.primary} />
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const themeStyles = StyleSheet.create({
  section: {},
  title: { fontSize: 13, fontFamily: 'Inter_600SemiBold', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.8, opacity: 0.6 },
  card: { borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  swatch: { width: 28, height: 28, borderRadius: 14 },
  label: { flex: 1, fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  sub: { fontSize: 12, fontFamily: 'Inter_400Regular' },
});

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { items: cartItems, itemCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { t, lang, setLang } = useLanguage();
  const [notifications, setNotifications] = useState(true);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;
  const styles = makeStyles(colors, topPad, bottomPad);

  function toggleLanguage() {
    setLang(lang === 'fr' ? 'ar' : 'fr');
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t.profileTitle}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Avatar / Stats ── */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <AppIcon name="person" size={36} color={colors.primary} />
          </View>
          <Text style={styles.profileName}>{t.clientName}</Text>
          <Text style={styles.profileEmail}>{t.welcome}</Text>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{itemCount}</Text>
              <Text style={styles.statLabel}>{t.tabCart}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{wishlistItems.length}</Text>
              <Text style={styles.statLabel}>{t.tabWishlist}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>{t.orders}</Text>
            </View>
          </View>
        </View>

        {/* ── Store Info ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.store}</Text>
          <View style={styles.sectionCard}>
            <SettingRow
              icon="location-outline"
              label={t.deliveryRow}
              value={t.nationwide}
              onPress={() => Alert.alert(t.deliveryRow, t.deliveryAlert)}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="time-outline"
              label={t.hours}
              value={t.hoursVal}
              onPress={() => {}}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="call-outline"
              label={t.contact}
              value="+212 600 000 000"
              onPress={() => Alert.alert(t.contact, t.contactAlert)}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="logo-instagram"
              label={t.instagram}
              value="@alfirdaousstore"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* ── Preferences ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.preferences}</Text>
          <View style={styles.sectionCard}>
            <SettingRow
              icon="notifications-outline"
              label={t.notifications}
              toggle
              toggleValue={notifications}
              onToggle={setNotifications}
            />
            <View style={styles.divider} />
            {/* Language toggle — tapping cycles FR ↔ AR */}
            <SettingRow
              icon="language-outline"
              label={t.language}
              value={t.langName}
              onPress={toggleLanguage}
            />
          </View>
        </View>

        {/* ── Theme ── */}
        <ThemeSelector />

        {/* ── Legal ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.information}</Text>
          <View style={styles.sectionCard}>
            <SettingRow
              icon="document-text-outline"
              label={t.terms}
              onPress={() => Alert.alert(t.terms, t.termsAlert)}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="shield-outline"
              label={t.privacy}
              onPress={() => Alert.alert(t.privacy, t.privacyAlert)}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="information-circle-outline"
              label={t.version}
              value="1.0.0"
            />
          </View>
        </View>

        {/* ── Brand footer ── */}
        <View style={styles.brandFooter}>
          <View style={styles.brandLogoBox}>
            <Image
              source={{ uri: 'https://www.alfirdaousstore.com/assets/WHITE%20FIRDAOUS%20STORE-DgnBjEdy.png' }}
              style={styles.brandLogoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.brandTagline}>{t.tagline}</Text>
        </View>

        <View style={{ height: bottomPad + 80 }} />
      </ScrollView>
    </View>
  );
}

const makeStyles = (colors: ReturnType<typeof useColors>, topPad: number, bottomPad: number) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: topPad + 12,
      paddingBottom: 14,
      paddingHorizontal: 16,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', color: colors.foreground },
    profileCard: {
      backgroundColor: colors.card,
      margin: 16,
      borderRadius: 20,
      padding: 24,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 6,
    },
    avatar: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: colors.secondary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
      borderWidth: 3,
      borderColor: colors.primary,
    },
    profileName: { fontSize: 18, fontFamily: 'Inter_700Bold', color: colors.foreground },
    profileEmail: { fontSize: 13, fontFamily: 'Inter_400Regular', color: colors.mutedForeground, marginTop: 2 },
    statsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 20,
      width: '100%',
      justifyContent: 'space-around',
    },
    stat: { alignItems: 'center', gap: 2 },
    statValue: { fontSize: 20, fontFamily: 'Inter_700Bold', color: colors.primary },
    statLabel: { fontSize: 11, fontFamily: 'Inter_500Medium', color: colors.mutedForeground },
    statDivider: { width: 1, height: 32, backgroundColor: colors.border },
    section: { marginHorizontal: 16, marginBottom: 16 },
    sectionTitle: {
      fontSize: 13,
      fontFamily: 'Inter_700Bold',
      color: colors.mutedForeground,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 8,
      paddingLeft: 4,
    },
    sectionCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 3,
      overflow: 'hidden',
    },
    divider: { height: 1, backgroundColor: colors.border, marginLeft: 66 },
    brandFooter: { alignItems: 'center', gap: 10, paddingVertical: 24 },
    brandLogoBox: {
      backgroundColor: colors.primary,
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    brandLogoImage: { width: 160, height: 36 },
    brandTagline: { fontSize: 12, fontFamily: 'Inter_400Regular', color: colors.mutedForeground },
  });
