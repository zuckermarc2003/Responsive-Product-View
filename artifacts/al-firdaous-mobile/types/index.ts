// ── Raw Django API types ───────────────────────────────────

export interface ApiProductStock {
  id: number;
  product: number;
  size: string;
  quantity: number;
  reserved: number;
}

export interface ApiProduct {
  id: number;
  product_type: string;
  category: string;
  ref: string;
  name: string;
  price: number;
  promo: number;
  image: string;
  image1: string;
  image2: string;
  image3: string;
  image4: string;
  newest: boolean;
  stock: ApiProductStock[];
}

export interface ApiReview {
  id: number;
  product: number;
  product_type: string;
  product_id: number;
  name: string;
  email: string;
  review: string;
  stars: number;
  date: string;
}

// ── Normalised app types (used in the UI) ─────────────────

export type ProductType = 'Shoe' | 'Sandal' | 'Shirt' | 'Pant' | string;

export interface ProductStock {
  id: number;
  size: string;
  quantity: number;
  reserved: number;
  availableQty: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  product_type: ProductType;
  ref: string;
  price: number;
  promo: number;
  image: string;
  images: string[];
  sizes: string[];
  stock?: ProductStock[];
  description: string;
  brand: string;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
}

export interface Review {
  id: string;
  author: string;
  email?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface AddReviewPayload {
  product_id: number;
  name: string;
  email: string;
  review: string;
  stars: number;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, size: string) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, qty: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

export interface WishlistContextType {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}
