import { AppIcon } from '@/components/AppIcon';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
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

interface FormValues {
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

// ── Individual text field (fully self-contained, no parent dependency) ────────
function InputField({
  label,
  icon,
  placeholder,
  keyboardType,
  autoCapitalize,
  onChangeText,
  defaultValue = '',
  colors,
}: {
  label: string;
  icon: string;
  placeholder?: string;
  keyboardType?: any;
  autoCapitalize?: any;
  onChangeText: (v: string) => void;
  defaultValue?: string;
  colors: any;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={inputFieldS.wrap}>
      <Text style={[inputFieldS.label, { color: colors.mutedForeground }]}>{label}</Text>
      <View style={[
        inputFieldS.inputWrap,
        { backgroundColor: colors.card, borderColor: focused ? '#4facff' : colors.border },
      ]}>
        <AppIcon name={icon as any} size={17} color={focused ? '#4facff' : colors.mutedForeground} />
        <TextInput
          style={[inputFieldS.input, { color: colors.foreground }]}
          defaultValue={defaultValue}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.mutedForeground}
          keyboardType={keyboardType ?? 'default'}
          autoCapitalize={autoCapitalize ?? 'words'}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>
    </View>
  );
}
const inputFieldS = StyleSheet.create({
  wrap: { gap: 5 },
  label: { fontSize: 11, fontFamily: 'Inter_700Bold', letterSpacing: 0.8, textTransform: 'uppercase' },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12,
  },
  input: { flex: 1, fontSize: 14, fontFamily: 'Inter_400Regular', padding: 0 },
});

// ── City picker ───────────────────────────────────────────────────────────────
function CityPicker({
  value, onSelect, colors,
}: { value: string; onSelect: (c: string) => void; colors: any }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const filtered = useMemo(
    () => MOROCCAN_CITIES.filter(c => c.toLowerCase().includes(query.toLowerCase())),
    [query],
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
          <Text style={[pickerS.val, { color: value ? colors.foreground : colors.mutedForeground }]} numberOfLines={1}>
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
            <ScrollView
              style={pickerS.scrollView}
              nestedScrollEnabled
              showsVerticalScrollIndicator
              keyboardShouldPersistTaps="handled"
            >
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
}
const pickerS = StyleSheet.create({
  wrap: { gap: 5 },
  label: { fontSize: 11, fontFamily: 'Inter_700Bold', letterSpacing: 0.8, textTransform: 'uppercase' },
  btn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12,
  },
  val: { flex: 1, fontSize: 14, fontFamily: 'Inter_400Regular' },
  backdrop: {
    position: 'absolute', top: -1000, left: 0, right: 0, bottom: -1000,
    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 20, paddingBottom: 40, maxHeight: 500,
  },
  sheetTitle: { fontSize: 17, fontFamily: 'Inter_700Bold', marginBottom: 14, textAlign: 'center' },
  search: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 10,
  },
  searchInput: { flex: 1, fontSize: 14, fontFamily: 'Inter_400Regular', padding: 0 },
  scrollView: { flex: 1, minHeight: 200 },
  cityRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, paddingHorizontal: 4, borderBottomWidth: 1,
  },
  cityText: { fontSize: 15, fontFamily: 'Inter_500Medium' },
});

// ── Step1Form — completely self-contained, parent only reads via ref ───────────
// This is the KEY fix: typing updates ONLY internal state → parent never re-renders
export interface Step1FormHandle {
  validate: () => boolean;
  getValues: () => FormValues;
}

const Step1Form = forwardRef<Step1FormHandle, { colors: any }>(
  ({ colors }, ref) => {
    const [city, setCity] = useState('');
    const firstNameRef = useRef('');
    const lastNameRef = useRef('');
    const emailRef = useRef('');
    const phoneRef = useRef('');
    const addressRef = useRef('');
    const [errors, setErrors] = useState<FieldErrors>({});

    useImperativeHandle(ref, () => ({
      validate() {
        const e: FieldErrors = {};
        if (!firstNameRef.current.trim()) e.firstName = 'Requis';
        if (!lastNameRef.current.trim()) e.lastName = 'Requis';
        if (!phoneRef.current.trim() || phoneRef.current.replace(/\D/g, '').length < 9)
          e.phone = 'Numéro invalide';
        if (!city) e.city = 'Requis';
        if (!addressRef.current.trim()) e.address = 'Requis';
        setErrors(e);
        return Object.keys(e).length === 0;
      },
      getValues() {
        return {
          firstName: firstNameRef.current,
          lastName: lastNameRef.current,
          email: emailRef.current,
          phone: phoneRef.current,
          city,
          address: addressRef.current,
        };
      },
    }), [city]);

    return (
      <View style={[formS.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={formS.cardHeader}>
          <Text style={formS.cardStep}>ÉTAPE 1 / 2</Text>
          <Text style={formS.cardTitle}>Informations de livraison</Text>
        </View>
        <View style={formS.cardBody}>
          <View style={formS.row}>
            <View style={{ flex: 1 }}>
              <InputField
                label="Prénom"
                icon="person-outline"
                placeholder="Mohamed"
                onChangeText={v => { firstNameRef.current = v; }}
                colors={colors}
              />
              {!!errors.firstName && <Text style={formS.error}>{errors.firstName}</Text>}
            </View>
            <View style={{ flex: 1 }}>
              <InputField
                label="Nom"
                icon="person-outline"
                placeholder="Alami"
                onChangeText={v => { lastNameRef.current = v; }}
                colors={colors}
              />
              {!!errors.lastName && <Text style={formS.error}>{errors.lastName}</Text>}
            </View>
          </View>

          <InputField
            label="Email (optionnel)"
            icon="mail-outline"
            placeholder="email@exemple.com"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={v => { emailRef.current = v; }}
            colors={colors}
          />

          <View>
            <InputField
              label="Téléphone"
              icon="call-outline"
              placeholder="+212 6XX XXX XXX"
              keyboardType="phone-pad"
              autoCapitalize="none"
              onChangeText={v => { phoneRef.current = v; }}
              colors={colors}
            />
            {!!errors.phone && <Text style={formS.error}>{errors.phone}</Text>}
          </View>

          <View>
            <CityPicker value={city} onSelect={setCity} colors={colors} />
            {!!errors.city && <Text style={formS.error}>{errors.city}</Text>}
          </View>

          <View>
            <InputField
              label="Adresse complète"
              icon="home-outline"
              placeholder="Rue, quartier, numéro..."
              onChangeText={v => { addressRef.current = v; }}
              colors={colors}
            />
            {!!errors.address && <Text style={formS.error}>{errors.address}</Text>}
          </View>
        </View>
      </View>
    );
  },
);
Step1Form.displayName = 'Step1Form';

const formS = StyleSheet.create({
  card: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  cardHeader: {
    backgroundColor: '#0f1c35', paddingHorizontal: 20, paddingVertical: 16,
  },
  cardStep: { fontSize: 10, fontFamily: 'Inter_700Bold', color: '#4facff', letterSpacing: 1, marginBottom: 3 },
  cardTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#fff' },
  cardBody: { padding: 16, gap: 14 },
  row: { flexDirection: 'row', gap: 10 },
  error: { fontSize: 11, fontFamily: 'Inter_600SemiBold', color: '#ef4444', marginTop: 3 },
});

// ── Main component ────────────────────────────────────────────────────────────
export default function CheckoutScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { items, total, clearCart } = useCart();
  const { t } = useLanguage();

  const [step, setStep] = useState<Step>(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [policiesAccepted, setPoliciesAccepted] = useState(false);
  // Confirmed values (only set when step 1 passes validation)
  const [confirmedForm, setConfirmedForm] = useState<FormValues>({
    firstName: '', lastName: '', email: '', phone: '', city: '', address: '',
  });

  const formRef = useRef<Step1FormHandle>(null);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const styles = useMemo(
    () => makeStyles(colors, topPad, bottomPad),
    [colors, topPad, bottomPad],
  );

  function handleNextStep() {
    if (step === 1) {
      const valid = formRef.current?.validate() ?? false;
      if (!valid) return;
      const values = formRef.current!.getValues();
      setConfirmedForm(values);
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
            <Text style={{ color: colors.primary, fontFamily: 'Inter_700Bold' }}>{confirmedForm.phone}</Text>
            {'\n'}pour confirmer la livraison à {confirmedForm.city}.
          </Text>

          <View style={[styles.successCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.successCardRow}>
              <Text style={[styles.successCardLabel, { color: colors.mutedForeground }]}>Client</Text>
              <Text style={[styles.successCardVal, { color: colors.foreground }]}>
                {confirmedForm.firstName} {confirmedForm.lastName}
              </Text>
            </View>
            <View style={[styles.successDivider, { backgroundColor: colors.border }]} />
            <View style={styles.successCardRow}>
              <Text style={[styles.successCardLabel, { color: colors.mutedForeground }]}>Adresse</Text>
              <Text style={[styles.successCardVal, { color: colors.foreground }]} numberOfLines={2}>
                {confirmedForm.address}, {confirmedForm.city}
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
            onPress={() => router.replace('/(tabs)' as any)}
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
      <View style={[styles.header, { backgroundColor: '#0f1c35' }]}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => step === 1 ? router.back() : setStep(1)}>
            <AppIcon name="arrow-back" size={22} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>Commande</Text>
        </View>
        <View style={styles.stepRow}>
          <StepDot n={1} current={step} />
          <View style={[styles.stepLine, step > 1 && styles.stepLineDone]} />
          <StepDot n={2} current={step} />
          <View style={[styles.stepLine, step > 2 && styles.stepLineDone]} />
          <StepDot n={3} current={step} />
        </View>
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
          <View style={styles.alert}>
            <AppIcon name="information-circle-outline" size={18} color="#4facff" />
            <Text style={styles.alertText}>
              {step === 1
                ? 'Remplissez vos informations de livraison pour continuer.'
                : 'Choisissez votre mode de paiement et confirmez.'}
            </Text>
          </View>

          {step === 1 ? (
            <Step1Form ref={formRef} colors={colors} />
          ) : (
            <>
              {/* ── Delivery summary (locked) ── */}
              <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardStep}>ÉTAPE 1 — VALIDÉE</Text>
                    <Text style={styles.cardTitle}>Livraison</Text>
                  </View>
                  <Pressable style={styles.editBtn} onPress={() => setStep(1)}>
                    <AppIcon name="share-outline" size={15} color="#fff" />
                    <Text style={styles.editBtnText}>Modifier</Text>
                  </Pressable>
                </View>
                <View style={styles.summaryConfirm}>
                  <AppIcon name="checkmark-circle" size={20} color="#10b981" />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.confirmedName, { color: colors.foreground }]}>
                      {confirmedForm.firstName} {confirmedForm.lastName}
                    </Text>
                    <Text style={[styles.confirmedDetail, { color: colors.mutedForeground }]}>
                      {confirmedForm.phone}  •  {confirmedForm.city}
                    </Text>
                    <Text style={[styles.confirmedDetail, { color: colors.mutedForeground }]} numberOfLines={1}>
                      {confirmedForm.address}
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
                      <AppIcon name="bag-outline" size={26} color={paymentMethod === 'cod' ? '#4facff' : colors.mutedForeground} />
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

                  <View style={[styles.payMethod, styles.payMethodDisabled, { borderColor: colors.border }]}>
                    <View style={[styles.payIconWrap, { backgroundColor: colors.secondary }]}>
                      <AppIcon name="bag-check-outline" size={26} color={colors.border} />
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

    alert: {
      flexDirection: 'row', alignItems: 'center', gap: 10,
      backgroundColor: 'rgba(79,172,255,0.08)',
      borderWidth: 1, borderColor: 'rgba(79,172,255,0.3)',
      borderLeftWidth: 4, borderLeftColor: '#4facff',
      borderRadius: 10, padding: 12,
    },
    alertText: { flex: 1, fontSize: 13, fontFamily: 'Inter_500Medium', color: colors.foreground },

    card: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
    cardHeader: {
      backgroundColor: '#0f1c35',
      paddingHorizontal: 20, paddingVertical: 16,
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    },
    cardStep: { fontSize: 10, fontFamily: 'Inter_700Bold', color: '#4facff', letterSpacing: 1, marginBottom: 3 },
    cardTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#fff' },
    cardBody: { padding: 16, gap: 14 },

    editBtn: {
      flexDirection: 'row', alignItems: 'center', gap: 5,
      backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.4)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6,
    },
    editBtnText: { fontSize: 13, fontFamily: 'Inter_700Bold', color: '#fff' },

    summaryConfirm: {
      flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 16,
    },
    confirmedName: { fontSize: 15, fontFamily: 'Inter_700Bold' },
    confirmedDetail: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 2 },

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
    comingSoon: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
    comingSoonText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },

    policies: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
    checkbox: {
      width: 20, height: 20, borderRadius: 5, borderWidth: 2,
      alignItems: 'center', justifyContent: 'center', marginTop: 1, flexShrink: 0,
    },
    checkboxChecked: { backgroundColor: '#4facff', borderColor: '#4facff' },
    policiesText: { flex: 1, fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 20 },

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

    stickyBottom: { borderTopWidth: 1, paddingTop: 12, paddingHorizontal: 16 },
    nextBtn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: 10, borderRadius: 14, paddingVertical: 16,
      shadowColor: '#4facff', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 12,
      elevation: 6,
    },
    nextBtnText: { fontSize: 15, fontFamily: 'Inter_700Bold', color: '#fff' },

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
