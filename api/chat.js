export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "No message received" });
  }

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: message }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!data || !data.candidates || !data.candidates[0].content.parts[0].text) {
      return res.status(500).json({ error: "Invalid response from Gemini" });
    }

    const aiReply = data.candidates[0].content.parts[0].text;

    res.status(200).json({ reply: aiReply });

  } catch (err) {
    console.error("Gemini API ERROR:", err);
    res.status(500).json({ error: "Server Error" });
  }
}
