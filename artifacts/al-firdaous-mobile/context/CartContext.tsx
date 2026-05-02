import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { CartContextType, CartItem, Product } from '@/types';

const CART_KEY = '@firdaous_cart';

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(CART_KEY).then(data => {
      if (data) setItems(JSON.parse(data));
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((product: Product, size: string) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.selectedSize === size);
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id && i.selectedSize === size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, quantity: 1, selectedSize: size }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string, size: string) => {
    setItems(prev => prev.filter(i => !(i.product.id === productId && i.selectedSize === size)));
  }, []);

  const updateQuantity = useCallback((productId: string, size: string, qty: number) => {
    if (qty <= 0) {
      setItems(prev => prev.filter(i => !(i.product.id === productId && i.selectedSize === size)));
    } else {
      setItems(prev =>
        prev.map(i =>
          i.product.id === productId && i.selectedSize === size ? { ...i, quantity: qty } : i
        )
      );
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total = useMemo(() =>
    items.reduce((sum, item) => {
      const price = item.product.promo > 0
        ? item.product.price * (1 - item.product.promo / 100)
        : item.product.price;
      return sum + price * item.quantity;
    }, 0),
    [items]
  );

  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
