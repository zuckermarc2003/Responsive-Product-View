import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Lang = 'fr' | 'ar';

const FR = {
  // Tabs
  tabHome: 'Accueil',
  tabCatalog: 'Boutique',
  tabCart: 'Panier',
  tabWishlist: 'Favoris',
  tabProfile: 'Profil',

  // Home
  newCollection: 'NOUVELLE COLLECTION',
  heroCta: 'Été 2025',
  heroSub: "Jusqu'à 45% de réduction",
  discover: 'Découvrir',
  categories: 'Catégories',
  newArrivals: 'Nouveautés',
  seeAll: 'Voir tout',
  onSale: 'En Promotion',
  allProducts: 'Tous les Produits',
  salesBanner: "Soldes — Jusqu'à 45% sur les chaussures",

  // Categories
  catAll: 'Tout',
  catShoe: 'Chaussures',
  catSandal: 'Sandales',
  catShirt: 'Chemises',
  catPant: 'Pantalons',
  promos: 'Promos',

  // Catalog
  catalogue: 'Catalogue',
  sort: 'Trier',
  searchPlaceholder: 'Rechercher un produit...',
  sortDefault: 'Par défaut',
  sortPriceAsc: 'Prix croissant',
  sortPriceDesc: 'Prix décroissant',
  sortRating: 'Mieux notés',
  productCount: (n: number) => `${n} produit${n > 1 ? 's' : ''}`,
  noProducts: 'Aucun produit trouvé',
  trySearch: 'Essayez un autre terme de recherche',
  connectionError: 'Erreur de connexion',
  loadingError: 'Impossible de charger les produits.',
  retry: 'Réessayer',

  // Product detail
  addToCart: 'Ajouter',
  addedToCart: 'Ajouté !',
  inStock: 'En stock',
  outOfStock: 'Rupture de stock',
  selectSize: 'Choisir une taille',
  description: 'Description',
  reviews: 'Avis',
  related: 'Produits similaires',
  selectSizeAlert: 'Veuillez choisir une taille',
  addedAlert: 'ajouté au panier',

  // Cart
  myCart: 'Mon Panier',
  emptyCart: 'Votre panier est vide',
  emptyCartSub: 'Parcourez notre boutique et ajoutez vos articles favoris',
  browseShop: 'Parcourir',
  placeOrder: 'Commander',
  total: 'Total',
  clearCart: 'Vider',
  clearCartConfirm: 'Vider le panier ?',
  clearCartMessage: 'Tous les articles seront supprimés.',
  cancel: 'Annuler',
  confirm: 'Confirmer',
  free: 'Gratuite',
  delivery: 'Livraison',
  estimatedDelivery: 'Livraison estimée',
  days: 'jours',

  // Wishlist
  myWishlist: 'Mes Favoris',
  emptyWishlist: 'Aucun favori',
  emptyWishlistSub: 'Ajoutez des produits à vos favoris',
  removeFromWishlist: 'Retirer des favoris',
  addToCartBtn: 'Ajouter au panier',

  // Profile
  profileTitle: 'Profil',
  clientName: 'Client AL-FIRDAOUS',
  welcome: 'Bienvenue dans notre boutique',
  store: 'Boutique',
  deliveryRow: 'Livraison Maroc',
  nationwide: 'Nationwide',
  hours: 'Horaires',
  hoursVal: '9h–21h',
  contact: 'Contact',
  instagram: 'Instagram',
  preferences: 'Préférences',
  notifications: 'Notifications',
  language: 'Langue',
  langName: 'Français',
  themeSection: 'Thème',
  information: 'Informations',
  terms: "Conditions d'utilisation",
  privacy: 'Politique de confidentialité',
  version: 'Version',
  orders: 'Commandes',
  tagline: 'Qualité & Élégance depuis 2018',
  deliveryAlert: 'Livraison disponible dans tout le Maroc.',
  contactAlert: 'Appelez-nous au +212 600 000 000',
  termsAlert: "Conditions générales d'utilisation de AL-FIRDAOUS STORE.",
  privacyAlert: 'Vos données sont protégées.',
};

const AR: typeof FR = {
  // Tabs
  tabHome: 'الرئيسية',
  tabCatalog: 'المتجر',
  tabCart: 'السلة',
  tabWishlist: 'المفضلة',
  tabProfile: 'الملف',

  // Home
  newCollection: 'مجموعة جديدة',
  heroCta: 'صيف 2025',
  heroSub: 'تخفيضات تصل إلى 45٪',
  discover: 'اكتشف',
  categories: 'الفئات',
  newArrivals: 'وصل حديثاً',
  seeAll: 'عرض الكل',
  onSale: 'تخفيضات',
  allProducts: 'جميع المنتجات',
  salesBanner: 'تخفيضات — حتى 45٪ على الأحذية',

  // Categories
  catAll: 'الكل',
  catShoe: 'أحذية',
  catSandal: 'صنادل',
  catShirt: 'قمصان',
  catPant: 'بناطيل',
  promos: 'عروض',

  // Catalog
  catalogue: 'الكتالوج',
  sort: 'ترتيب',
  searchPlaceholder: 'ابحث عن منتج...',
  sortDefault: 'افتراضي',
  sortPriceAsc: 'السعر تصاعدي',
  sortPriceDesc: 'السعر تنازلي',
  sortRating: 'الأعلى تقييماً',
  productCount: (n: number) => `${n} ${n === 1 ? 'منتج' : 'منتجات'}`,
  noProducts: 'لا توجد منتجات',
  trySearch: 'جرب مصطلحاً آخر',
  connectionError: 'خطأ في الاتصال',
  loadingError: 'تعذر تحميل المنتجات.',
  retry: 'إعادة المحاولة',

  // Product detail
  addToCart: 'أضف للسلة',
  addedToCart: 'تمت الإضافة !',
  inStock: 'متوفر',
  outOfStock: 'غير متوفر',
  selectSize: 'اختر المقاس',
  description: 'الوصف',
  reviews: 'التقييمات',
  related: 'منتجات مشابهة',
  selectSizeAlert: 'الرجاء اختيار المقاس',
  addedAlert: 'أُضيف إلى السلة',

  // Cart
  myCart: 'سلة التسوق',
  emptyCart: 'سلتك فارغة',
  emptyCartSub: 'تصفح متجرنا وأضف منتجاتك المفضلة',
  browseShop: 'تصفح',
  placeOrder: 'طلب',
  total: 'المجموع',
  clearCart: 'إفراغ',
  clearCartConfirm: 'إفراغ السلة؟',
  clearCartMessage: 'سيتم حذف جميع المنتجات.',
  cancel: 'إلغاء',
  confirm: 'تأكيد',
  free: 'مجانية',
  delivery: 'التوصيل',
  estimatedDelivery: 'التوصيل المتوقع',
  days: 'أيام',

  // Wishlist
  myWishlist: 'المفضلة',
  emptyWishlist: 'لا توجد مفضلات',
  emptyWishlistSub: 'أضف المنتجات إلى مفضلتك',
  removeFromWishlist: 'إزالة من المفضلة',
  addToCartBtn: 'أضف للسلة',

  // Profile
  profileTitle: 'الملف الشخصي',
  clientName: 'عميل الفردوس',
  welcome: 'أهلاً بك في متجرنا',
  store: 'المتجر',
  deliveryRow: 'توصيل المغرب',
  nationwide: 'جميع المدن',
  hours: 'ساعات العمل',
  hoursVal: '9ص–9م',
  contact: 'اتصل بنا',
  instagram: 'إنستجرام',
  preferences: 'التفضيلات',
  notifications: 'الإشعارات',
  language: 'اللغة',
  langName: 'العربية',
  themeSection: 'المظهر',
  information: 'المعلومات',
  terms: 'شروط الاستخدام',
  privacy: 'سياسة الخصوصية',
  version: 'الإصدار',
  orders: 'الطلبات',
  tagline: 'جودة وأناقة منذ 2018',
  deliveryAlert: 'التوصيل متاح في جميع أنحاء المغرب.',
  contactAlert: 'اتصل بنا على +212 600 000 000',
  termsAlert: 'الشروط العامة لاستخدام متجر الفردوس.',
  privacyAlert: 'بياناتك محمية لدينا.',
};

export type Translations = typeof FR;

interface LanguageContextType {
  lang: Lang;
  t: Translations;
  setLang: (l: Lang) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('fr');
  const t = lang === 'ar' ? AR : FR;
  const isRTL = lang === 'ar';

  return (
    <LanguageContext.Provider value={{ lang, t, setLang, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
