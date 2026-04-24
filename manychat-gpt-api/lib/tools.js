import { products, orders, deliveryRules } from "./mockData.js";

export function getProductsByConcern(message) {
  const text = message.toLowerCase();

  const matched = products.filter((product) =>
    product.concerns.some((concern) => text.includes(concern.toLowerCase()))
  );

  return matched.length ? matched : [];
}

export function checkStock(message) {
  const text = message.toLowerCase();

  const matchedProduct = products.find((product) =>
    text.includes(product.name.toLowerCase())
  );

  if (!matchedProduct) return null;

  return {
    name: matchedProduct.name,
    stock: matchedProduct.stock,
    available: matchedProduct.stock > 0,
  };
}

export function getPrice(message) {
  const text = message.toLowerCase();

  const matchedProduct = products.find((product) =>
    text.includes(product.name.toLowerCase())
  );

  if (!matchedProduct) return null;

  return {
    name: matchedProduct.name,
    price: matchedProduct.price,
  };
}

export function getOrderStatus(message) {
  const text = message.toLowerCase();

  const matchedOrder = orders.find(
    (order) =>
      text.includes(order.orderId.toLowerCase()) ||
      text.includes(order.phone)
  );

  return matchedOrder || null;
}

export function getDeliveryInfo(message) {
  const text = message.toLowerCase();

  if (text.includes("dhaka")) {
    return deliveryRules.dhaka;
  }

  if (
    text.includes("outside") ||
    text.includes("ctg") ||
    text.includes("chittagong") ||
    text.includes("sylhet") ||
    text.includes("rajshahi")
  ) {
    return deliveryRules.outside;
  }

  return null;
}