export type ProductType = 'Shoe' | 'Sandal' | 'Shirt' | 'Pant';

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
  rating: number;
  comment: string;
  date: string;
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
