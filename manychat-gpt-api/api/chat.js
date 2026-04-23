export default async function handler(req, res) {
  try {
    // Browser test
    if (req.method === "GET") {
      return res.status(200).json({ reply: "API is working ✅" });
    }

    const { message } = req.body || {};

    if (!message || !String(message).trim()) {
      return res.status(200).json({ reply: "Apni ki jante chan bolun 😊" });
    }

    const prompt = `You are a professional skincare sales agent for a Bangladesh-based beauty ecommerce business.

Rules:
- Always reply in natural Bangla or Banglish.
- Be warm, helpful, and sales-oriented, but never pushy.
- Keep replies short, clear, and conversational.
- First understand the customer's need.
- If the customer mentions a skin concern, recommend suitable product types.
- If the customer is unclear, ask 1 short follow-up question.
- If the customer asks price, delivery, or order-related questions, answer simply.
- If exact product info is not available, do not invent product names. Instead suggest the right type of product and ask a clarifying question.
- Try to move the conversation toward product recommendation or order intent.
- Never say you are an AI unless asked.
- Avoid long paragraphs.
- Sound like a smart ecommerce sales assistant.

Examples of good style:
- "Apnar skin ta oily na dry?"
- "Acne-prone skin hole gentle facewash + niacinamide type serum bhalo hote pare."
- "Apni chaile ami concern onujayi suggest korte pari 😊"
- "Dhaka te delivery charge alada, outside Dhaka alada."

User message: ${message}`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: prompt,
      }),
    });

    const data = await response.json();

    const reply =
      data.output?.[0]?.content?.[0]?.text?.trim() ||
      "Dhonnobad message korar jonno 😊 Apnar concern ta ektu bolben?";

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      reply: "Sorry boss, ekta technical problem hoise. Ektu pore abar try korun.",
    });
  }
}