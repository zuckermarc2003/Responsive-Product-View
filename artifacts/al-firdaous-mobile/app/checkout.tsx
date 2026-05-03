import { AppIcon } from '@/components/AppIcon';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useColors } from '@/hooks/useColors';
import { getFinalPrice } from '@/constants/data';

// ── Moroccan cities ──────────────────────────────────────────────────────────
const MOROCCAN_CITIES = [
  'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Agadir', 'Tanger', 'Meknès',
  'Oujda', 'Kénitra', 'Tétouan', 'El Jadida', 'Béni Mellal', 'Nador', 'Safi',
  'Khouribga', 'Mohammédia', 'Settat', 'Khémisset', 'Berrechid', 'Larache',
  'Ksar el-Kébir', 'Taza', 'Errachidia', 'Guelmim', 'Ouarzazate',
];

type Step = 1 | 2 | 3;
type PaymentMethod = 'cod' | null;

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
}

interface FieldErrors {
  firstName?: string;
  lastName?: string;
  phone?: string;
  city?: string;
  address?: string;
}

// ── Step indicator ────────────────────────────────────────────────────────────
function StepDot({ n, current }: { n: number; current: Step }) {
  const done = current > n;
  const active = current === n;
  return (
    <View style={[
      stepDotS.circle,
      active && stepDotS.active,
      done && stepDotS.done,
    ]}>
      {done
        ? <AppIcon name="checkmark" size={13} color="#fff" />
        : <Text style={[stepDotS.num, (active || done) && stepDotS.numActive]}>{n}</Text>}
    </View>
  );
}
const stepDotS = StyleSheet.create({
  circle: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)',
  },
  active: { backgroundColor: '#4facff', borderWidth: 0 },
  done: { backgroundColor: '#10b981', borderWidth: 0 },
  num: { fontSize: 12, fontFamily: 'Inter_700Bold', color: 'rgba(255,255,255,0.4)' },
  numActive: { color: '#fff' },
});

// ── Form field ─────────────────────────────────────────────────────────────────
const Field = React.memo(({
  label, icon, value, onChangeText, placeholder, keyboardType, error,
  autoCapitalize,
}: {
  label: string; icon: string; value: string; onChangeText: (v: string) => void;
  placeholder?: string; keyboardType?: any; error?: string; autoCapitalize?: any;
}) => {
  const colors = useColors();
  const [focused, setFocused] = useState(false);
  return (
    <View style={fieldS.wrap}>
      <Text style={[fieldS.label, { color: colors.mutedForeground }]}>{label}</Text>
      <View style={[
        fieldS.inputWrap,
        { backgroundColor: colors.card, borderColor: colors.border },
        focused && { borderColor: '#4facff', shadowColor: '#4facff', shadowOpacity: 0.15, shadowRadius: 6, shadowOffset: { width: 0, height: 0 } },
        !!error && { borderColor: '#ef4444' },
      ]}>
        <AppIcon name={icon as any} size={17} color={focused ? '#4facff' : colors.mutedForeground} />
        <TextInput
          style={[fieldS.input, { color: colors.foreground }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.mutedForeground}
          keyboardType={keyboardType ?? 'default'}
          autoCapitalize={autoCapitalize ?? 'words'}
          selectTextOnFocus={false}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>
      {!!error && <Text style={fieldS.error}>{error}</Text>}
    </View>
  );
});
const fieldS = StyleSheet.create({
  wrap: { gap: 5 },
  label: { fontSize: 11, fontFamily: 'Inter_700Bold', letterSpacing: 0.8, textTransform: 'uppercase' },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12,
  },
  input: { flex: 1, fontSize: 14, fontFamily: 'Inter_400Regular', padding: 0 },
  error: { fontSize: 11, fontFamily: 'Inter_600SemiBold', color: '#ef4444' },
});

// ── City picker modal ─────────────────────────────────────────────────────────
const CityPicker = React.memo(({
  value, onSelect, colors,
}: { value: string; onSelect: (c: string) => void; colors: any }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const filtered = MOROCCAN_CITIES.filter(c =>
    c.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <View style={pickerS.wrap}>
        <Text style={[pickerS.label, { color: colors.mutedForeground }]}>VILLE</Text>
        <Pressable
          style={[pickerS.btn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => setOpen(true)}
        >
          <AppIcon name="location-outline" size={17} color={colors.mutedForeground} />
          <Text style={[pickerS.val, { color: value ? colors.foreground : colors.mutedForeground }]}>
            {value || 'Sélectionner une ville...'}
          </Text>
          <AppIcon name="chevron-down" size={16} color={colors.mutedForeground} />
        </Pressable>
      </View>

      {open && (
        <Pressable style={pickerS.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={[pickerS.sheet, { backgroundColor: colors.card }]} onPress={e => e.stopPropagation()}>
            <Text style={[pickerS.sheetTitle, { color: colors.foreground }]}>Choisir une ville</Text>
            <View style={[pickerS.search, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <AppIcon name="search-outline" size={16} color={colors.mutedForeground} />
              <TextInput
                style={[pickerS.searchInput, { color: colors.foreground }]}
                placeholder="Rechercher..."
                placeholderTextColor={colors.mutedForeground}
                value={query}
                onChangeText={setQuery}
                autoFocus
              />
            </View>
            <ScrollView style={pickerS.scrollView} nestedScrollEnabled showsVerticalScrollIndicator={true}>
              {filtered.map(city => (
                <Pressable
                  key={city}
                  style={[
                    pickerS.cityRow,
                    { borderBottomColor: colors.border },
                    value === city && { backgroundColor: colors.secondary },
                  ]}
                  onPress={() => { onSelect(city); setOpen(false); setQuery(''); }}
                >
                  <Text style={[pickerS.cityText, { color: colors.foreground }]}>{city}</Text>
                  {value === city && <AppIcon name="checkmark" size={16} color="#4facff" />}
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      )}
    </>
  );
});
const pickerS = StyleSheet.create({
  wrap: { gap: 5 },
  label: { fontSize: 11, fontFamily: 'Inter_700Bold', letterSpacing: 0.8, textTransform: 'uppercase' },
  btn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12,
  },
  val: { flex: 1, fontSize: 14, fontFamily: 'Inter_400Regular' },
  backdrop: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 20, paddingBottom: 40, height: '80%',
  },
  sheetTitle: { fontSize: 17, fontFamily: 'Inter_700Bold', marginBottom: 14, textAlign: 'center' },
  search: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 10,
  },
  searchInput: { flex: 1, fontSize: 14, fontFamily: 'Inter_400Regular', padding: 0 },
  scrollView: { maxHeight: 400, flex: 1 },
  cityRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, paddingHorizontal: 4, borderBottomWidth: 1,
  },
  cityText: { fontSize: 15, fontFamily: 'Inter_500Medium' },
});

// ── Step 1 Form (memoized to prevent re-renders) ──────────────────────────────
const Step1Form = React.memo(({
  form, setFirstName, setLastName, setEmail, setPhone, setCity, setAddress, colors, styles,
}: any) => (
  <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardStep}>ÉTAPE 1 / 2</Text>
      <Text style={styles.cardTitle}>Informations de livraison</Text>
    </View>
    <View style={styles.cardBody}>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Field
            label="Prénom"
            icon="person-outline"
            value={form.firstName}
            onChangeText={setFirstName}
            placeholder="Mohamed"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Field
            label="Nom"
            icon="person-outline"
            value={form.lastName}
            onChangeText={setLastName}
            placeholder="Alami"
          />
        </View>
      </View>

      <Field
        label="Email (optionnel)"
        icon="mail-outline"
        value={form.email}
        onChangeText={setEmail}
        placeholder="email@exemple.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Field
        label="Téléphone"
        icon="call-outline"
        value={form.phone}
        onChangeText={setPhone}
        placeholder="+212 6XX XXX XXX"
        keyboardType="phone-pad"
        autoCapitalize="none"
      />

      <CityPicker
        value={form.city}
        onSelect={setCity}
        colors={colors}
      />

      <Field
        label="Adresse complète"
        icon="home-outline"
        value={form.address}
        onChangeText={setAddress}
        placeholder="Rue, quartier, numéro..."
      />
    </View>
  </View>
));

// ── Main component ────────────────────────────────────────────────────────────
export default function CheckoutScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { items, total, clearCart } = useCart();
  const { t } = useLanguage();

  const [step, setStep] = useState<Step>(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [policiesAccepted, setPoliciesAccepted] = useState(false);
  const [form, setForm] = useState<FormData>({
    firstName: '', lastName: '', email: '', phone: '', city: '', address: '',
  });
  const [errors, setErrors] = useState<FieldErrors>({});

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const setFirstName = useCallback((v: string) => setForm(f => ({ ...f, firstName: v })), []);
  const setLastName = useCallback((v: string) => setForm(f => ({ ...f, lastName: v })), []);
  const setEmail = useCallback((v: string) => setForm(f => ({ ...f, email: v })), []);
  const setPhone = useCallback((v: string) => setForm(f => ({ ...f, phone: v })), []);
  const setAddress = useCallback((v: string) => setForm(f => ({ ...f, address: v })), []);
  const setCity = useCallback((v: string) => setForm(f => ({ ...f, city: v })), []);

  function validateStep1(): boolean {
    const e: FieldErrors = {};
    if (!form.firstName.trim()) e.firstName = 'Requis';
    if (!form.lastName.trim()) e.lastName = 'Requis';
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 9)
      e.phone = 'Numéro invalide';
    if (!form.city) e.city = 'Requis';
    if (!form.address.trim()) e.address = 'Requis';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNextStep() {
    if (step === 1) {
      if (!validateStep1()) return;
      setStep(2);
    } else if (step === 2) {
      if (!paymentMethod) {
        Alert.alert('Paiement', 'Veuillez choisir un mode de paiement.');
        return;
      }
      if (!policiesAccepted) {
        Alert.alert('Conditions', 'Veuillez accepter les conditions générales.');
        return;
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setStep(3);
      clearCart();
    }
  }

  const styles = makeStyles(colors, topPad, bottomPad);

  // ── Step 3: Success screen ─────────────────────────────────────────────────
  if (step === 3) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { backgroundColor: '#0f1c35' }]}>
          <View style={styles.headerLeft}>
            <View style={[stepDotS.circle, stepDotS.done]}>
              <AppIcon name="checkmark" size={13} color="#fff" />
            </View>
            <Text style={styles.headerTitle}>Commande confirmée</Text>
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.successScroll}>
          <View style={styles.successIconWrap}>
            <View style={styles.successCircle}>
              <AppIcon name="checkmark" size={44} color="#fff" />
            </View>
          </View>
          <Text style={[styles.successTitle, { color: colors.foreground }]}>
            Merci pour votre commande !
          </Text>
          <Text style={[styles.successSub, { color: colors.mutedForeground }]}>
            Notre équipe vous contactera au{'\n'}
            <Text style={{ color: colors.primary, fontFamily: 'Inter_700Bold' }}>{form.phone}</Text>
            {'\n'}pour confirmer la livraison à {form.city}.
          </Text>

          {/* ── Summary card ── */}
          <View style={[styles.successCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.successCardRow}>
              <Text style={[styles.successCardLabel, { color: colors.mutedForeground }]}>Client</Text>
              <Text style={[styles.successCardVal, { color: colors.foreground }]}>
                {form.firstName} {form.lastName}
              </Text>
            </View>
            <View style={[styles.successDivider, { backgroundColor: colors.border }]} />
            <View style={styles.successCardRow}>
              <Text style={[styles.successCardLabel, { color: colors.mutedForeground }]}>Adresse</Text>
              <Text style={[styles.successCardVal, { color: colors.foreground }]} numberOfLines={2}>
                {form.address}, {form.city}
              </Text>
            </View>
            <View style={[styles.successDivider, { backgroundColor: colors.border }]} />
            <View style={styles.successCardRow}>
              <Text style={[styles.successCardLabel, { color: colors.mutedForeground }]}>Paiement</Text>
              <Text style={[styles.successCardVal, { color: colors.foreground }]}>
                {paymentMethod === 'cod' ? 'Cash à la livraison' : 'En ligne'}
              </Text>
            </View>
            <View style={[styles.successDivider, { backgroundColor: colors.border }]} />
            <View style={styles.successCardRow}>
              <Text style={[styles.successCardLabel, { color: colors.mutedForeground }]}>Total payé</Text>
              <Text style={[styles.successCardVal, { color: colors.primary, fontSize: 17 }]}>
                {total.toFixed(2)} MAD
              </Text>
            </View>
          </View>

          <View style={[styles.successNote, { backgroundColor: colors.secondary }]}>
            <AppIcon name="time-outline" size={16} color={colors.primary} />
            <Text style={[styles.successNoteText, { color: colors.primary }]}>
              Livraison estimée : 2 – 5 jours ouvrables
            </Text>
          </View>

          <Pressable
            style={[styles.confirmBtn, { backgroundColor: colors.primary }]}
            onPress={() => router.replace('/(tabs)/')}
          >
            <AppIcon name="home-outline" size={18} color="#fff" />
            <Text style={styles.confirmBtnText}>Retour à l'accueil</Text>
          </Pressable>

          <View style={{ height: bottomPad + 20 }} />
        </ScrollView>
      </View>
    );
  }

  // ── Step 1 & 2 ─────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      {/* ── Dark header with step indicators ── */}
      <View style={[styles.header, { backgroundColor: '#0f1c35' }]}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => step === 1 ? router.back() : setStep(1)}>
            <AppIcon name="arrow-back" size={22} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>Commande</Text>
        </View>
        {/* Step indicators */}
        <View style={styles.stepRow}>
          <StepDot n={1} current={step} />
          <View style={[styles.stepLine, step > 1 && styles.stepLineDone]} />
          <StepDot n={2} current={step} />
          <View style={[styles.stepLine, step > 2 && styles.stepLineDone]} />
          <StepDot n={3} current={step} />
        </View>
        {/* Total badge */}
        <View style={styles.totalBadge}>
          <Text style={styles.totalBadgeText}>{total.toFixed(0)} MAD</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={topPad + 60}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Info alert ── */}
          <View style={styles.alert}>
            <AppIcon name="information-circle-outline" size={18} color="#4facff" />
            <Text style={styles.alertText}>
              {step === 1
                ? 'Remplissez vos informations de livraison pour continuer.'
                : 'Choisissez votre mode de paiement et confirmez.'}
            </Text>
          </View>

          {step === 1 ? (
            /* ── STEP 1: Delivery form ── */
            <Step1Form
              form={form}
              setFirstName={setFirstName}
              setLastName={setLastName}
              setEmail={setEmail}
              setPhone={setPhone}
              setCity={setCity}
              setAddress={setAddress}
              colors={colors}
              styles={styles}
            />
          ) : (
            /* ── STEP 2: Payment + summary ── */
            <>
              {/* ── Delivery summary (locked) ── */}
              <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardStep}>ÉTAPE 1 — VALIDÉE</Text>
                    <Text style={styles.cardTitle}>Livraison</Text>
                  </View>
                  <Pressable
                    style={styles.editBtn}
                    onPress={() => setStep(1)}
                  >
                    <AppIcon name="create-outline" size={15} color="#fff" />
                    <Text style={styles.editBtnText}>Modifier</Text>
                  </Pressable>
                </View>
                <View style={styles.summaryConfirm}>
                  <AppIcon name="checkmark-circle" size={20} color="#10b981" />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.confirmedName, { color: colors.foreground }]}>
                      {form.firstName} {form.lastName}
                    </Text>
                    <Text style={[styles.confirmedDetail, { color: colors.mutedForeground }]}>
                      {form.phone}  •  {form.city}
                    </Text>
                    <Text style={[styles.confirmedDetail, { color: colors.mutedForeground }]} numberOfLines={1}>
                      {form.address}
                    </Text>
                  </View>
                </View>
              </View>

              {/* ── Payment method ── */}
              <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardStep}>ÉTAPE 2 / 2</Text>
                  <Text style={styles.cardTitle}>Mode de paiement</Text>
                </View>
                <View style={styles.cardBody}>
                  {/* COD */}
                  <Pressable
                    style={[
                      styles.payMethod,
                      { borderColor: colors.border },
                      paymentMethod === 'cod' && styles.payMethodActive,
                    ]}
                    onPress={() => setPaymentMethod('cod')}
                  >
                    <View style={[
                      styles.payIconWrap,
                      { backgroundColor: colors.secondary },
                      paymentMethod === 'cod' && { backgroundColor: 'rgba(79,172,255,0.12)' },
                    ]}>
                      <AppIcon name="cash-outline" size={26} color={paymentMethod === 'cod' ? '#4facff' : colors.mutedForeground} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.payMethodTitle, { color: colors.foreground }]}>
                        Cash à la livraison
                      </Text>
                      <Text style={[styles.payMethodSub, { color: colors.mutedForeground }]}>
                        Paiement à la réception du colis
                      </Text>
                    </View>
                    <View style={[
                      styles.payCheck,
                      { borderColor: colors.border },
                      paymentMethod === 'cod' && styles.payCheckActive,
                    ]}>
                      {paymentMethod === 'cod' && <View style={styles.payCheckDot} />}
                    </View>
                  </Pressable>

                  {/* Online (disabled for now) */}
                  <View style={[styles.payMethod, styles.payMethodDisabled, { borderColor: colors.border }]}>
                    <View style={[styles.payIconWrap, { backgroundColor: colors.secondary }]}>
                      <AppIcon name="card-outline" size={26} color={colors.border} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.payMethodTitle, { color: colors.border }]}>
                        Paiement en ligne
                      </Text>
                      <Text style={[styles.payMethodSub, { color: colors.border }]}>
                        Bientôt disponible
                      </Text>
                    </View>
                    <View style={[styles.comingSoon, { borderColor: colors.border }]}>
                      <Text style={[styles.comingSoonText, { color: colors.mutedForeground }]}>Bientôt</Text>
                    </View>
                  </View>

                  {/* Policies checkbox */}
                  <Pressable style={styles.policies} onPress={() => setPoliciesAccepted(v => !v)}>
                    <View style={[
                      styles.checkbox,
                      { borderColor: colors.border },
                      policiesAccepted && styles.checkboxChecked,
                    ]}>
                      {policiesAccepted && <AppIcon name="checkmark" size={12} color="#fff" />}
                    </View>
                    <Text style={[styles.policiesText, { color: colors.mutedForeground }]}>
                      J'accepte les{' '}
                      <Text style={{ color: '#4facff', fontFamily: 'Inter_600SemiBold' }}>
                        conditions générales
                      </Text>
                      {' '}et la{' '}
                      <Text style={{ color: '#4facff', fontFamily: 'Inter_600SemiBold' }}>
                        politique de confidentialité
                      </Text>
                      {' '}d'AL-FIRDAOUS STORE.
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* ── Order summary ── */}
              <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Récapitulatif</Text>
                </View>
                <View style={styles.cardBody}>
                  {items.map(item => {
                    const price = getFinalPrice(item.product.price, item.product.promo);
                    return (
                      <View key={`${item.product.id}-${item.selectedSize}`} style={styles.orderItem}>
                        <Image source={{ uri: item.product.image }} style={styles.orderItemImg} />
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.orderItemName, { color: colors.foreground }]} numberOfLines={1}>
                            {item.product.name}
                          </Text>
                          <Text style={[styles.orderItemMeta, { color: colors.mutedForeground }]}>
                            Taille {item.selectedSize} × {item.quantity}
                          </Text>
                        </View>
                        <Text style={[styles.orderItemPrice, { color: colors.primary }]}>
                          {(price * item.quantity).toFixed(2)} MAD
                        </Text>
                      </View>
                    );
                  })}
                  <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Livraison</Text>
                    <Text style={[styles.summaryValue, { color: '#10b981' }]}>Gratuite</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={[styles.totalLabel, { color: colors.foreground }]}>Total</Text>
                    <Text style={[styles.totalValue, { color: colors.primary }]}>
                      {total.toFixed(2)} MAD
                    </Text>
                  </View>
                </View>
              </View>
            </>
          )}

          <View style={{ height: bottomPad + 90 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Sticky bottom button ── */}
      <View style={[styles.stickyBottom, { paddingBottom: bottomPad + 12, backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <Pressable
          style={[styles.nextBtn, { backgroundColor: colors.primary }]}
          onPress={handleNextStep}
        >
          {step === 1 ? (
            <>
              <Text style={styles.nextBtnText}>Continuer vers le paiement</Text>
              <AppIcon name="arrow-forward" size={18} color="#fff" />
            </>
          ) : (
            <>
              <AppIcon name="bag-check-outline" size={20} color="#fff" />
              <Text style={styles.nextBtnText}>Confirmer la commande — {total.toFixed(2)} MAD</Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const makeStyles = (colors: ReturnType<typeof useColors>, topPad: number, bottomPad: number) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },

    // Header
    header: {
      paddingTop: topPad + 10, paddingBottom: 14, paddingHorizontal: 16,
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6,
      elevation: 8,
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    headerTitle: { fontSize: 17, fontFamily: 'Inter_700Bold', color: '#fff' },
    stepRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    stepLine: { width: 24, height: 2, borderRadius: 1, backgroundColor: 'rgba(255,255,255,0.15)' },
    stepLineDone: { backgroundColor: '#10b981' },
    totalBadge: { backgroundColor: '#4facff', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5 },
    totalBadgeText: { fontSize: 13, fontFamily: 'Inter_700Bold', color: '#fff' },

    scroll: { padding: 16, gap: 14 },

    // Alert
    alert: {
      flexDirection: 'row', alignItems: 'center', gap: 10,
      backgroundColor: 'rgba(79,172,255,0.08)',
      borderWidth: 1, borderColor: 'rgba(79,172,255,0.3)',
      borderLeftWidth: 4, borderLeftColor: '#4facff',
      borderRadius: 10, padding: 12,
    },
    alertText: { flex: 1, fontSize: 13, fontFamily: 'Inter_500Medium', color: colors.foreground },

    // Card
    card: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
    cardHeader: {
      backgroundColor: '#0f1c35',
      paddingHorizontal: 20, paddingVertical: 16,
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    },
    cardStep: { fontSize: 10, fontFamily: 'Inter_700Bold', color: '#4facff', letterSpacing: 1, marginBottom: 3 },
    cardTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#fff' },
    cardBody: { padding: 16, gap: 14 },
    row: { flexDirection: 'row', gap: 10 },

    editBtn: {
      flexDirection: 'row', alignItems: 'center', gap: 5,
      backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.4)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6,
    },
    editBtnText: { fontSize: 13, fontFamily: 'Inter_700Bold', color: '#fff' },

    // Step 1 locked summary
    summaryConfirm: {
      flexDirection: 'row', alignItems: 'flex-start', gap: 12,
      padding: 16,
    },
    confirmedName: { fontSize: 15, fontFamily: 'Inter_700Bold' },
    confirmedDetail: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 2 },

    // Payment methods
    payMethod: {
      flexDirection: 'row', alignItems: 'center', gap: 14,
      borderWidth: 1.5, borderRadius: 12, padding: 14,
    },
    payMethodActive: { borderColor: '#4facff', backgroundColor: 'rgba(79,172,255,0.05)' },
    payMethodDisabled: { opacity: 0.5 },
    payIconWrap: { width: 50, height: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    payMethodTitle: { fontSize: 15, fontFamily: 'Inter_700Bold' },
    payMethodSub: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
    payCheck: {
      width: 22, height: 22, borderRadius: 11, borderWidth: 2,
      alignItems: 'center', justifyContent: 'center',
    },
    payCheckActive: { borderColor: '#4facff' },
    payCheckDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#4facff' },
    comingSoon: {
      borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4,
    },
    comingSoonText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },

    // Policies
    policies: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
    checkbox: {
      width: 20, height: 20, borderRadius: 5, borderWidth: 2,
      alignItems: 'center', justifyContent: 'center', marginTop: 1, flexShrink: 0,
    },
    checkboxChecked: { backgroundColor: '#4facff', borderColor: '#4facff' },
    policiesText: { flex: 1, fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 20 },

    // Order summary
    orderItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    orderItemImg: { width: 52, height: 52, borderRadius: 8 },
    orderItemName: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
    orderItemMeta: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
    orderItemPrice: { fontSize: 14, fontFamily: 'Inter_700Bold' },
    summaryDivider: { height: 1, marginVertical: 4 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    summaryLabel: { fontSize: 14, fontFamily: 'Inter_400Regular' },
    summaryValue: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
    totalLabel: { fontSize: 16, fontFamily: 'Inter_700Bold' },
    totalValue: { fontSize: 20, fontFamily: 'Inter_700Bold' },

    // Sticky bottom
    stickyBottom: {
      borderTopWidth: 1, paddingTop: 12, paddingHorizontal: 16,
    },
    nextBtn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: 10, borderRadius: 14, paddingVertical: 16,
      shadowColor: '#4facff', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 12,
      elevation: 6,
    },
    nextBtnText: { fontSize: 15, fontFamily: 'Inter_700Bold', color: '#fff' },

    // Success screen
    successScroll: { alignItems: 'center', padding: 24 },
    successIconWrap: { marginTop: 24, marginBottom: 20 },
    successCircle: {
      width: 96, height: 96, borderRadius: 48,
      backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center',
      shadowColor: '#10b981', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 16,
      elevation: 10,
    },
    successTitle: { fontSize: 24, fontFamily: 'Inter_700Bold', textAlign: 'center', marginBottom: 12 },
    successSub: { fontSize: 15, fontFamily: 'Inter_400Regular', textAlign: 'center', lineHeight: 24, marginBottom: 24 },
    successCard: {
      width: '100%', borderRadius: 16, borderWidth: 1,
      padding: 16, gap: 2, marginBottom: 14,
    },
    successCardRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
    successCardLabel: { fontSize: 13, fontFamily: 'Inter_400Regular' },
    successCardVal: { fontSize: 14, fontFamily: 'Inter_600SemiBold', textAlign: 'right', flex: 1, marginLeft: 16 },
    successDivider: { height: 1 },
    successNote: {
      width: '100%', flexDirection: 'row', alignItems: 'center', gap: 8,
      borderRadius: 10, padding: 12, marginBottom: 24,
    },
    successNoteText: { flex: 1, fontSize: 13, fontFamily: 'Inter_500Medium' },
    confirmBtn: {
      width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: 10, borderRadius: 14, paddingVertical: 16,
    },
    confirmBtnText: { fontSize: 15, fontFamily: 'Inter_700Bold', color: '#fff' },
  });
