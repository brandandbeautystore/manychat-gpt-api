export default async function handler(req, res) {
  try {
    const { message } = req.body;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-5.3-codex",
        input: `You are a helpful skincare sales agent. Answer in Bangla. Keep it short and friendly.\nUser: ${message}`
      })
    });

    const data = await response.json();

    const reply = data.output[0].content[0].text;

    res.status(200).json({ reply });

  } catch (error) {
    res.status(500).json({ reply: "Sorry, ekta problem hoise. abar try korun." });
  }
}