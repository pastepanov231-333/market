import type { CartItem, CartTotals, SellerCartGroup } from "@/ui/state/types";

const DELIVERY_FEE = 99;

export function getTotalQty(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.qty, 0);
}

export function getGroupedBySeller(items: CartItem[]): SellerCartGroup[] {
  const groupsMap = new Map<string, SellerCartGroup>();
  for (const item of items) {
    const existing = groupsMap.get(item.sellerId);
    if (!existing) {
      groupsMap.set(item.sellerId, {
        sellerId: item.sellerId,
        sellerName: item.sellerName,
        items: [item],
        subtotal: item.priceSnapshot * item.qty,
        itemsCount: item.qty,
      });
    } else {
      existing.items.push(item);
      existing.subtotal += item.priceSnapshot * item.qty;
      existing.itemsCount += item.qty;
    }
  }
  return Array.from(groupsMap.values());
}

export function getCartTotals(items: CartItem[], promoCode: string, tips: number): CartTotals {
  const subtotal = items.reduce((sum, i) => sum + i.priceSnapshot * i.qty, 0);
  const deliveryFee = subtotal > 0 ? DELIVERY_FEE : 0;
  const discount = promoCode.trim() ? Math.min(100, subtotal * 0.1) : 0;

  return {
    subtotal,
    deliveryFee,
    discount,
    tips,
    grandTotal: Math.max(0, subtotal + deliveryFee - discount + tips),
  };
}

