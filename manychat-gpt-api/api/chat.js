export default async function handler(req, res) {
  try {
    // GET request handle (browser test)
    if (req.method === "GET") {
      return res.status(200).json({ reply: "API is working ✅" });
    }

    const { message } = req.body || {};

    if (!message) {
      return res.status(200).json({ reply: "message dao" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: `You are a skincare sales agent. Answer in Bangla.\nUser: ${message}`
      })
    });

    const data = await response.json();

    const reply =
      data.output?.[0]?.content?.[0]?.text ||
      "Sorry, bujhte parini. abar bolo.";

    res.status(200).json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Server error" });
  }
}