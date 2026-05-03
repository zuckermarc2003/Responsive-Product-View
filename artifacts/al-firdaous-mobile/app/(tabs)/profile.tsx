import { AppIcon } from '@/components/AppIcon';
import { useCart } from '@/context/CartContext';
import { useLanguage, type Lang } from '@/context/LanguageContext';
import { THEMES, useTheme } from '@/context/ThemeContext';
import { useWishlist } from '@/context/WishlistContext';
import { useColors } from '@/hooks/useColors';
import { LinearGradient } from 'expo-linear-gradient';
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

function StatBox({ value, label, isDark }: { value: number | string; label: string; isDark: boolean }) {
  return (
    <View style={statStyles.box}>
      <Text style={statStyles.val}>{value}</Text>
      <Text style={[statStyles.lbl, { color: isDark ? '#64748b' : '#6b7280' }]}>{label}</Text>
    </View>
  );
}
const statStyles = StyleSheet.create({
  box: { alignItems: 'center', flex: 1, gap: 3 },
  val: { fontSize: 22, fontFamily: 'Inter_700Bold', color: '#C9A84C' },
  lbl: { fontSize: 11, fontFamily: 'Inter_500Medium' },
});

function InfoRow({
  icon, label, value, iconColor, onPress, rightEl, isDark,
}: {
  icon: string; label: string; value?: string;
  iconColor?: string; onPress?: () => void; rightEl?: React.ReactNode; isDark: boolean;
}) {
  const textCol = isDark ? '#f9fafb' : '#111827';
  const mutedCol = isDark ? '#64748b' : '#6b7280';
  const ic = iconColor ?? '#C9A84C';
  return (
    <Pressable style={infoStyles.row} onPress={onPress}>
      <View style={[infoStyles.iconWrap, { backgroundColor: `${ic}18` }]}>
        <AppIcon name={icon as any} size={18} color={ic} />
      </View>
      <Text style={[infoStyles.label, { color: textCol }]}>{label}</Text>
      <View style={infoStyles.right}>
        {value && <Text style={[infoStyles.value, { color: mutedCol }]}>{value}</Text>}
        {rightEl}
        {!rightEl && onPress && <AppIcon name="chevron-forward" size={15} color={mutedCol} />}
      </View>
    </Pressable>
  );
}
const infoStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 15, gap: 14 },
  iconWrap: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  label: { flex: 1, fontSize: 15, fontFamily: 'Inter_500Medium' },
  right: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  value: { fontSize: 13, fontFamily: 'Inter_400Regular' },
});

function SectionCard({ title, children, isDark }: { title: string; children: React.ReactNode; isDark: boolean }) {
  const cardBg = isDark ? '#141424' : '#fff';
  const borderCol = isDark ? '#1e293b' : '#f0f0f0';
  const mutedCol = isDark ? '#64748b' : '#6b7280';
  return (
    <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
      <Text style={[sectionStyles.title, { color: mutedCol }]}>{title}</Text>
      <View style={[sectionStyles.card, { backgroundColor: cardBg, borderColor: borderCol }]}>
        {children}
      </View>
    </View>
  );
}
const sectionStyles = StyleSheet.create({
  title: { fontSize: 11, fontFamily: 'Inter_700Bold', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8, paddingLeft: 2 },
  card: { borderRadius: 18, borderWidth: 1, overflow: 'hidden' },
});

function Divider({ isDark }: { isDark: boolean }) {
  return <View style={{ height: 1, backgroundColor: isDark ? '#1e293b' : '#f0f0f0', marginLeft: 70 }} />;
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { itemCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { t, lang, setLang } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const isDark = colors.background === '#0f172a';
  const bg = isDark ? '#0a0a14' : '#f8f7f4';
  const cardBg = isDark ? '#141424' : '#fff';
  const textCol = isDark ? '#f9fafb' : '#111827';
  const mutedCol = isDark ? '#64748b' : '#6b7280';
  const borderCol = isDark ? '#1e293b' : '#f0f0f0';

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      {/* ── Header ── */}
      <LinearGradient
        colors={isDark ? ['#0a0a14', '#0d1a2e'] : ['#0d1a2e', '#0d2244']}
        style={[styles.header, { paddingTop: topPad + 10 }]}
      >
        <View>
          <Text style={styles.headerEyebrow}>AL-FIRDAOUS STORE</Text>
          <Text style={styles.headerTitle}>Mon Profil</Text>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Profile Card ── */}
        <View style={[styles.profileCard, { backgroundColor: cardBg, borderColor: borderCol }]}>
          {/* Avatar */}
          <LinearGradient colors={['#C9A84C', '#e8c96d']} style={styles.avatarRing}>
            <View style={[styles.avatarInner, { backgroundColor: cardBg }]}>
              <AppIcon name="person" size={34} color="#C9A84C" />
            </View>
          </LinearGradient>
          <Text style={[styles.profileName, { color: textCol }]}>{t.clientName}</Text>
          <Text style={[styles.profileSub, { color: mutedCol }]}>{t.welcome}</Text>

          {/* Stats */}
          <View style={[styles.statsRow, { borderColor: borderCol }]}>
            <StatBox value={itemCount} label={t.tabCart} isDark={isDark} />
            <View style={[styles.statDivider, { backgroundColor: borderCol }]} />
            <StatBox value={wishlistItems.length} label={t.tabWishlist} isDark={isDark} />
            <View style={[styles.statDivider, { backgroundColor: borderCol }]} />
            <StatBox value={0} label={t.orders} isDark={isDark} />
          </View>
        </View>

        {/* ── Store Info ── */}
        <SectionCard title={t.store} isDark={isDark}>
          <InfoRow icon="location-outline" label={t.deliveryRow} value={t.nationwide} onPress={() => Alert.alert(t.deliveryRow, t.deliveryAlert)} isDark={isDark} />
          <Divider isDark={isDark} />
          <InfoRow icon="time-outline" label={t.hours} value={t.hoursVal} isDark={isDark} />
          <Divider isDark={isDark} />
          <InfoRow icon="call-outline" label={t.contact} value="+212 600 000 000" onPress={() => Alert.alert(t.contact, t.contactAlert)} isDark={isDark} />
          <Divider isDark={isDark} />
          <InfoRow icon="logo-instagram" label={t.instagram} value="@alfirdaousstore" iconColor="#E1306C" onPress={() => {}} isDark={isDark} />
        </SectionCard>

        {/* ── Preferences ── */}
        <SectionCard title={t.preferences} isDark={isDark}>
          <InfoRow
            icon="notifications-outline"
            label={t.notifications}
            isDark={isDark}
            rightEl={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: borderCol, true: '#C9A84C' }}
                thumbColor="#fff"
              />
            }
          />
          <Divider isDark={isDark} />
          <InfoRow icon="language-outline" label={t.language} value={t.langName} onPress={() => setLang(lang === 'fr' ? 'ar' : 'fr')} isDark={isDark} />
        </SectionCard>

        {/* ── Theme ── */}
        <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
          <Text style={[sectionStyles.title, { color: mutedCol }]}>{t.themeSection}</Text>
          <View style={[sectionStyles.card, { backgroundColor: cardBg, borderColor: borderCol }]}>
            {THEMES.map((th, i) => (
              <Pressable
                key={th.id}
                style={[
                  styles.themeRow,
                  i < THEMES.length - 1 && { borderBottomWidth: 1, borderBottomColor: borderCol },
                  theme.id === th.id && { backgroundColor: isDark ? '#0d1a2e' : '#f8f5ed' },
                ]}
                onPress={() => setTheme(th.id)}
              >
                <View style={[styles.themeSwatch, { backgroundColor: th.primary }]} />
                <Text style={[styles.themeLabel, { color: textCol }]}>{th.label}</Text>
                <Text style={[styles.themeSub, { color: mutedCol }]}>{th.primary}</Text>
                {theme.id === th.id && <AppIcon name="checkmark-circle" size={20} color="#C9A84C" />}
              </Pressable>
            ))}
          </View>
        </View>

        {/* ── Legal ── */}
        <SectionCard title={t.information} isDark={isDark}>
          <InfoRow icon="document-text-outline" label={t.terms} onPress={() => Alert.alert(t.terms, t.termsAlert)} isDark={isDark} />
          <Divider isDark={isDark} />
          <InfoRow icon="shield-outline" label={t.privacy} onPress={() => Alert.alert(t.privacy, t.privacyAlert)} isDark={isDark} />
          <Divider isDark={isDark} />
          <InfoRow icon="information-circle-outline" label={t.version} value="1.0.0" isDark={isDark} />
        </SectionCard>

        {/* ── Brand footer ── */}
        <View style={styles.footer}>
          <LinearGradient colors={['#0d1a2e', '#1a3050']} style={styles.footerCard}>
            <Image
              source={{ uri: 'https://www.alfirdaousstore.com/assets/WHITE%20FIRDAOUS%20STORE-DgnBjEdy.png' }}
              style={styles.footerLogo}
              resizeMode="contain"
            />
            <View style={styles.footerDivider} />
            <Text style={styles.footerTagline}>{t.tagline}</Text>
          </LinearGradient>
        </View>

        <View style={{ height: bottomPad + 90 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: 18, paddingHorizontal: 18,
  },
  headerEyebrow: { color: '#C9A84C', fontSize: 9, fontFamily: 'Inter_700Bold', letterSpacing: 2, marginBottom: 3 },
  headerTitle: { color: '#fff', fontSize: 26, fontFamily: 'Inter_700Bold' },

  profileCard: {
    margin: 16, borderRadius: 22, padding: 24, alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 14, elevation: 6,
  },
  avatarRing: { width: 82, height: 82, borderRadius: 41, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  avatarInner: { width: 70, height: 70, borderRadius: 35, alignItems: 'center', justifyContent: 'center' },
  profileName: { fontSize: 19, fontFamily: 'Inter_700Bold' },
  profileSub: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 3 },
  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: 22, width: '100%',
    borderTopWidth: 1, paddingTop: 18,
  },
  statDivider: { width: 1, height: 34 },

  themeRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 15, gap: 12 },
  themeSwatch: { width: 28, height: 28, borderRadius: 14 },
  themeLabel: { flex: 1, fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  themeSub: { fontSize: 12, fontFamily: 'Inter_400Regular' },

  footer: { marginHorizontal: 16, marginBottom: 8 },
  footerCard: { borderRadius: 18, padding: 22, alignItems: 'center', gap: 12 },
  footerLogo: { width: 170, height: 38 },
  footerDivider: { width: 40, height: 1, backgroundColor: 'rgba(201,168,76,0.35)' },
  footerTagline: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: 'Inter_400Regular' },
});
