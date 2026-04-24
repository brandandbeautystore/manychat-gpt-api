export const products = [
  {
    name: "Acne Control Facewash",
    category: "Facewash",
    concerns: ["acne", "pimple", "oily skin"],
    price: 550,
    stock: 18,
  },
  {
    name: "Niacinamide + Zinc Serum",
    category: "Serum",
    concerns: ["oily skin", "acne", "pores"],
    price: 850,
    stock: 12,
  },
  {
    name: "Kojic Acid Daily Facewash",
    category: "Facewash",
    concerns: ["pigmentation", "dark spot", "melasma", "brightening"],
    price: 600,
    stock: 7,
  },
  {
    name: "Ketoconazole Shampoo",
    category: "Haircare",
    concerns: ["dandruff", "itchy scalp"],
    price: 750,
    stock: 5,
  },
];

export const orders = [
  {
    orderId: "BNB1001",
    phone: "01700000001",
    customer: "Rahim",
    status: "Confirmed",
    courier: "Steadfast",
    tracking: "In transit",
    cod: 1450,
  },
  {
    orderId: "BNB1002",
    phone: "01800000002",
    customer: "Mim",
    status: "Delivered",
    courier: "Pathao",
    tracking: "Delivered",
    cod: 850,
  },
];

export const deliveryRules = {
  dhaka: {
    charge: 60,
    time: "1-2 din",
  },
  outside: {
    charge: 120,
    time: "2-4 din",
  },
};