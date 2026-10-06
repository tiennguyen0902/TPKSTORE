import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, Product } from "../types";
import { api } from "../services/api";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  shippingFee: number;
  isFreeShipping: boolean;
  freeShippingThreshold: number;
  total: number;
  isLoading: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const freeShippingThreshold = 500000;

  const refreshCart = async () => {
    if (!user) {
      // Local storage cart for unauthenticated users
      const saved = localStorage.getItem("store_ai_local_cart");
      if (saved) {
        try {
          setItems(JSON.parse(saved));
        } catch {
          setItems([]);
        }
      }
      return;
    }

    try {
      setIsLoading(true);
      // Đồng bộ giỏ hàng local lên server nếu khách vừa đăng nhập
      const saved = localStorage.getItem("store_ai_local_cart");
      if (saved) {
        try {
          const localItems: CartItem[] = JSON.parse(saved);
          for (const li of localItems) {
            if (li.productId) {
              await api.addToCart(li.productId, li.quantity || 1).catch(() => {});
            }
          }
          localStorage.removeItem("store_ai_local_cart");
        } catch (e) {
          console.warn("Could not sync local cart to server:", e);
        }
      }

      const cartData = await api.getCart();
      setItems(cartData.items || []);
    } catch (err) {
      console.warn("Could not fetch server cart, using local state:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [user]);

  const subtotal = items.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingFee = subtotal > 0 ? (isFreeShipping ? 0 : 30000) : 0;
  const total = subtotal + shippingFee;
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const addToCart = async (product: Product, quantity: number = 1) => {
    const qtyText = quantity > 1 ? `${quantity}x ` : "";
    if (user) {
      try {
        await api.addToCart(product.id, quantity);
        await refreshCart();
        showToast(`Đã thêm ${qtyText}"${product.name}" vào giỏ hàng thành công!`, "success");
        return;
      } catch (err) {
        console.warn("Server add to cart failed, using local update:", err);
      }
    }

    // Local cart fallback
    setItems(prev => {
      const existing = prev.find(i => i.productId === product.id);
      let updated;
      if (existing) {
        updated = prev.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + quantity } : i);
      } else {
        const newItem: CartItem = {
          id: `ci_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          cartId: "local_cart",
          productId: product.id,
          product,
          quantity
        };
        updated = [...prev, newItem];
      }
      localStorage.setItem("store_ai_local_cart", JSON.stringify(updated));
      return updated;
    });

    showToast(`Đã thêm ${qtyText}"${product.name}" vào giỏ hàng thành công!`, "success");
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (!cartItemId) return;

    if (user) {
      try {
        await api.updateCartQuantity(cartItemId, quantity);
        await refreshCart();
        return;
      } catch (err) {
        console.warn("Server update quantity failed:", err);
      }
    }

    setItems(prev => {
      let updated;
      if (quantity <= 0) {
        updated = prev.filter(i => i && i.id !== cartItemId && i.productId !== cartItemId);
      } else {
        updated = prev.map(i => (i && (i.id === cartItemId || i.productId === cartItemId)) ? { ...i, quantity } : i);
      }
      localStorage.setItem("store_ai_local_cart", JSON.stringify(updated));
      return updated;
    });
  };

  const removeItem = async (cartItemId: string) => {
    if (!cartItemId) return;

    if (user) {
      try {
        await api.removeCartItem(cartItemId);
        await refreshCart();
        return;
      } catch (err) {
        console.warn("Server remove item failed:", err);
      }
    }

    setItems(prev => {
      const updated = prev.filter(i => i && i.id !== cartItemId && i.productId !== cartItemId);
      localStorage.setItem("store_ai_local_cart", JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = async () => {
    if (user) {
      try {
        await api.clearCart();
        await refreshCart();
        return;
      } catch (err) {
        console.warn("Server clear cart failed:", err);
      }
    }

    setItems([]);
    localStorage.removeItem("store_ai_local_cart");
  };

  return (
    <CartContext.Provider value={{
      items,
      itemCount,
      subtotal,
      shippingFee,
      isFreeShipping,
      freeShippingThreshold,
      total,
      isLoading,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      refreshCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
