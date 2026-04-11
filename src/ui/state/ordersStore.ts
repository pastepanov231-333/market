import { create } from "zustand";
import type { CartTotals, Order, OrderStatus, PaymentMethod, SellerCartGroup } from "@/ui/state/types";

type CreateOrderPayload = {
  paymentMethod: PaymentMethod;
  totals: CartTotals;
  groupedBySeller: SellerCartGroup[];
};

type OrdersState = {
  orders: Order[];
  createOrder: (payload: CreateOrderPayload) => Order;
  completeOrder: (id: string) => void;
  cancelOrder: (id: string) => void;
  getOrderById: (id?: string) => Order | undefined;
  byStatus: (status: "all" | OrderStatus) => Order[];
};

function formatDate(date: Date): string {
  return date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],

  createOrder: ({ paymentMethod, totals, groupedBySeller }) => {
    const id = String(Date.now());
    const nextNumber = String(get().orders.length + 1001);
    const order: Order = {
      id,
      number: nextNumber,
      date: formatDate(new Date()),
      status: "active",
      paymentMethod,
      totals,
      items: groupedBySeller.flatMap((g) => g.items),
      subOrders: groupedBySeller.map((g, idx) => ({
        id: `${id}-${idx + 1}`,
        sellerId: g.sellerId,
        sellerName: g.sellerName,
        items: g.items,
        subtotal: g.subtotal,
        itemsCount: g.itemsCount,
      })),
    };
    set((state) => ({ orders: [order, ...state.orders] }));
    return order;
  },

  completeOrder: (id) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? { ...o, status: "completed" } : o)),
    })),

  cancelOrder: (id) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? { ...o, status: "cancelled" } : o)),
    })),

  getOrderById: (id) => get().orders.find((o) => o.id === id || o.number === id),

  byStatus: (status) => {
    if (status === "all") return get().orders;
    return get().orders.filter((o) => o.status === status);
  },
}));

