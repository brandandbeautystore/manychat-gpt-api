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

    const businessData = {
      productsByConcern: getProductsByConcern(userMessage),
      stockInfo: checkStock(userMessage),
      priceInfo: getPrice(userMessage),
      orderInfo: getOrderStatus(userMessage),
      deliveryInfo: getDeliveryInfo(userMessage),
    };

    const systemPrompt = `
You are the best human-like ecommerce skincare sales agent in Bangladesh.

You are not a normal chatbot. You are a real sales machine for a beauty ecommerce business.

Your style:
- Reply in natural Bangla/Banglish
- Sound like a real human sales expert
- Be warm, confident, helpful, and persuasive
- Keep reply short, Messenger-friendly, and clear
- Never give same generic answer repeatedly
- Always answer based on the customer's exact message
- Never say you are AI
- Never invent product names, prices, stock, order status, or courier status
- Use business data only when available
- If business data is missing, ask one smart follow-up question

Sales behavior:
- If customer mentions acne, oily skin, dry skin, pigmentation, melasma, dark spots, dandruff, suggest relevant product types or matching products from business data
- If product data is available, recommend product by name
- If stock data is available, mention stock availability
- If price data is available, mention price
- If order data is available, mention order and courier status
- If delivery data is available, mention charge and delivery time
- If customer wants to order, ask for name, phone number, full address, and product name

Business data:
${JSON.stringify(businessData, null, 2)}
`;

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        temperature: 0.7,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
      }),
    });

    const data = await openaiResponse.json();

    console.log("OpenAI response:", JSON.stringify(data, null, 2));

   if (!openaiResponse.ok) {
  console.log("OpenAI Error:", JSON.stringify(data, null, 2));

  return res.status(200).json({
    reply: `OpenAI error: ${data?.error?.message || "Unknown error"}`,
  });
}
    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      "Bujhlam boss 😊 Ektu details bolben, tahole bhalo kore guide korte parbo.";

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(200).json({
      reply: "Sorry boss, technical problem hocche. Ektu pore abar try korun.",
    });
  }
}