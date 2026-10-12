import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  type: "order_success" | "system" | "promo";
  orderId?: string;
  amount?: number;
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  addOrderNotification: (orderData: {
    orderId: string;
    customerName?: string;
    totalAmount: number;
    itemsCount: number;
    paymentMethod: string;
  }) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  playOrderSuccessSound: () => void;
  notifyBrowser: (title: string, body: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const NOTIFS_STORAGE_KEY = "store_ai_notifications_v1";

// Web Audio API: Giai điệu chúc mừng đặt hàng thành công (C5 -> E5 -> G5)
export function playOrderSuccessSound() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // Nốt 1: C5 (523.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(523.25, now);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.3);

    // Nốt 2: E5 (659.25 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(659.25, now + 0.12);
    gain2.gain.setValueAtTime(0.2, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.42);

    // Nốt 3: G5 (783.99 Hz) vang vọng
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = "triangle";
    osc3.frequency.setValueAtTime(783.99, now + 0.24);
    gain3.gain.setValueAtTime(0.25, now + 0.24);
    gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
    osc3.connect(gain3);
    gain3.connect(ctx.destination);
    osc3.start(now + 0.24);
    osc3.stop(now + 0.7);
  } catch (e) {
    // Trình duyệt có thể chặn audio nếu chưa tương tác người dùng
  }
}

// Browser System Notification API (Hiển thị popup notification góc màn hình của OS)
export function notifyBrowser(title: string, body: string) {
  if (typeof window === "undefined" || !("Notification" in window)) return;

  try {
    if (Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=128&auto=format&fit=crop&q=80",
        badge: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=64&auto=format&fit=crop&q=80"
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, {
            body,
            icon: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=128&auto=format&fit=crop&q=80"
          });
        }
      });
    }
  } catch (e) {
    console.warn("Browser Notification API error:", e);
  }
}

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem(NOTIFS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: "welcome_noti",
        title: "Chào mừng bạn đến với SHOPBEE! 🐝",
        message: "Hệ thống mua sắm thiết bị thông minh & bảo hành điện tử chính hãng 12-24 tháng.",
        timestamp: Date.now() - 3600000,
        read: true,
        type: "system"
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(NOTIFS_STORAGE_KEY, JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addOrderNotification = (orderData: {
    orderId: string;
    customerName?: string;
    totalAmount: number;
    itemsCount: number;
    paymentMethod: string;
  }) => {
    const formattedAmount = orderData.totalAmount.toLocaleString("vi-VN") + " đ";
    const paymentText =
      orderData.paymentMethod === "VNPAY"
        ? "Cổng VNPAY"
        : orderData.paymentMethod === "MOMO"
        ? "Ví MoMo"
        : "Thanh toán khi nhận hàng (COD)";

    const newNoti: AppNotification = {
      id: `noti_order_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: "🎉 Đặt hàng thành công!",
      message: `Đơn hàng ${orderData.orderId} (${orderData.itemsCount} sản phẩm, ${formattedAmount} - ${paymentText}) đã được ghi nhận. Đang chuẩn bị giao hàng!`,
      timestamp: Date.now(),
      read: false,
      type: "order_success",
      orderId: orderData.orderId,
      amount: orderData.totalAmount
    };

    setNotifications((prev) => [newNoti, ...prev.slice(0, 29)]);

    // Phát âm thanh chúc mừng
    playOrderSuccessSound();

    // Gửi popup native notification của trình duyệt
    notifyBrowser(
      "SHOPBEE: Đặt hàng thành công! 🎉",
      `Đơn hàng ${orderData.orderId} trị giá ${formattedAmount} đã được tiếp nhận. Cảm ơn bạn đã mua sắm!`
    );
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addOrderNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        playOrderSuccessSound,
        notifyBrowser
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
