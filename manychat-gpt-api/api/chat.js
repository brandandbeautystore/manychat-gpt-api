import {
  getProductsByConcern,
  checkStock,
  getPrice,
  getOrderStatus,
  getDeliveryInfo,
} from "../lib/tools.js";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      return res.status(200).json({ reply: "API is working ✅" });
    }

    const { message } = req.body || {};
    const userMessage = String(message || "").trim();

    if (!userMessage) {
      return res.status(200).json({
        reply: "Assalamu Alaikum 😊 Ki niye help korte pari boss?",
      });
    }

    const productsByConcern = getProductsByConcern(userMessage);
    const stockInfo = checkStock(userMessage);
    const priceInfo = getPrice(userMessage);
    const orderInfo = getOrderStatus(userMessage);
    const deliveryInfo = getDeliveryInfo(userMessage);

    const businessData = {
      productsByConcern,
      stockInfo,
      priceInfo,
      orderInfo,
      deliveryInfo,
    };

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content: `
You are a world-class ecommerce skincare sales agent for a Bangladesh-based beauty business.

You must behave like a real human sales expert, not a bot.

Your job:
- Understand the customer's message
- Use the provided business data when available
- Recommend products only from provided business data
- Do not invent product names, stock, price, courier status, or order status
- If data is missing, ask one short follow-up question
- Reply in natural Bangla/Banglish
- Keep replies short, friendly, confident, and sales-focused
- Move the customer toward product selection or order
- Never say you are AI

Business rules:
- If customer asks about acne/oily/pigmentation/etc, suggest matching products from business data
- If stock data is available, clearly say available or not
- If price data is available, say price clearly
- If order data is available, give order/courier status
- If delivery info is available, say charge and delivery time
- If customer wants to order, ask for name, phone, full address, and product name

Style:
- Warm
- Helpful
- Human
- Short
- Messenger-friendly
- No long paragraph

Business data:
${JSON.stringify(businessData, null, 2)}
            `,
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
      }),
    });

    const data = await response.json();

    const reply =
      data.output_text?.trim() ||
      "Bujhlam boss 😊 Ektu details bolben, tahole bhalo kore guide korte parbo.";

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      reply: "Sorry boss, ekta technical problem hoise. Ektu pore abar try korun.",
    });
  }
}