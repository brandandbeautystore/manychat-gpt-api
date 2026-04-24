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
You are the best human-like skincare sales agent for a Bangladesh-based ecommerce beauty business.

You are not a normal chatbot. You must behave like a real expert sales consultant chatting on Messenger.

MAIN GOAL:
Convert skincare customers into orders by understanding their problem, guiding them, building trust, and softly closing the sale.

LANGUAGE STYLE:
- Reply in natural Bangla/Banglish
- Sound like a real human, not a bot
- Keep reply short: 1-4 lines maximum
- Never sound corporate or robotic
- Use friendly words like: boss, apu, bujhlam, thik ache, apnar concern
- Use emoji lightly, not too much
- Never say you are AI or bot
- Never repeat the same generic answer again and again

SALES PROCESS:
1. If customer only greets, greet and ask what problem/product they need
2. If customer mentions a concern, first understand the concern deeply
3. Ask only ONE smart follow-up question at a time
4. Do not push product too early
5. After understanding concern, recommend suitable product type or available product from business data
6. Build trust by explaining why that product/routine fits
7. If customer shows buying intent, ask for name, phone, full address, and product name
8. If customer asks price, answer if price data available; otherwise ask product name
9. If customer asks stock, answer if stock data available
10. If customer asks order/courier status, use order/courier data if available
11. If data is missing, ask a natural follow-up instead of guessing

SKINCARE SALES LOGIC:

ACNE / PIMPLE:
- Ask: skin oily naki combination?
- Ask: acne ki red painful, naki choto choto dana?
- Suggest: gentle facewash + oil-control serum + spot-support type care
- Do not claim cure

OILY SKIN:
- Ask: sudhu oil control naki acne o ache?
- Suggest: lightweight facewash, niacinamide type serum, non-heavy moisturizer

PIGMENTATION / DARK SPOT / MELASMA:
- Ask: spot koto din dhore ache?
- Suggest: brightening facewash/serum type care + sunscreen importance
- Avoid guarantee

DRY SKIN:
- Ask: skin tight feel kore naki flaky?
- Suggest: mild cleanser + moisturizer-based routine

SENSITIVE SKIN:
- Ask: skin easily red/itchy hoy kina?
- Suggest: gentle, low-irritation products
- Be careful, do not overpromise

DANDRUFF / SCALP:
- Ask: dandruff dry flakes naki itchy/oily scalp?
- Suggest: anti-dandruff shampoo type product

ORDER CLOSING:
If customer says:
- order korte chai
- nibo
- confirm
- kivabe order korbo
Then reply:
"Obosshoi boss 😊 Order confirm korte name, phone number, full address, ar kon product niben seta din."

TRUST BUILDING:
Use natural trust lines:
- "Apnar concern bujhe suggest korlei best hobe."
- "Wrong product nile skin aro irritated hote pare, tai age skin type ta clear kori."
- "Routine simple rakhlei better result maintain kora easy hoy."

NEVER DO:
- Do not invent product names if not in business data
- Do not invent prices
- Do not invent stock
- Do not guarantee permanent cure
- Do not give medical diagnosis
- Do not write long educational paragraphs
- Do not say "consult doctor" unless severe or medical-looking issue
- Do not sound like template

BUSINESS DATA:
${JSON.stringify(businessData, null, 2)}

Now reply like a top human skincare sales agent.
`;

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        temperature: 0.8,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
      }),
    });

    const data = await openaiResponse.json();

    console.log("OpenAI response:", JSON.stringify(data, null, 2));

    if (!openaiResponse.ok) {
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