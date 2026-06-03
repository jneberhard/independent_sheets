'use client';

import { createContext, useContext, useSyncExternalStore } from 'react';

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  stock: number;
  imageUrl?: string;
  categories?: { category: { name: string } }[];
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  isHydrated: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const getServerSnapshot = () => '[]';

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const cartString = useSyncExternalStore(
    (callback) => {
      window.addEventListener('storage', callback);
      return () => window.removeEventListener('storage', callback);
    },
    () => localStorage.getItem('cart') || '[]',
    getServerSnapshot
  );

  let cart: CartItem[] = [];
  try {
    cart = JSON.parse(cartString);
  } catch (e) {
    console.error("Failed to parse cart items", e);
  }

  const saveCart = (newCart: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('storage'));
  };

  const isHydrated = typeof window !== 'undefined';

  const addToCart = (item: CartItem) => {
    const exists = cart.find(p => p.id === item.id);
    const newCart = exists
      ? cart.map(p => p.id === item.id ? { ...p, quantity: p.quantity + item.quantity } : p)
      : [...cart, item];
    saveCart(newCart);
  };

  const removeFromCart = (id: string) => {
    saveCart(cart.filter(p => p.id !== id));
  };

  const increaseQuantity = (id: string) => {
    saveCart(cart.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  };

  const decreaseQuantity = (id: string) => {
    saveCart(cart.map(item => item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item));
  };

  const clearCart = () => saveCart([]);
  const cartCount = isHydrated ? cart.reduce((sum, item) => sum + item.quantity, 0) : 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        cartCount,
        increaseQuantity,
        decreaseQuantity,
        isHydrated
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};