export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",  // You can change this if you want
        messages: [
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    if (!data || !data.choices) {
      return res.status(500).json({ error: "Invalid response from OpenAI" });
    }

    const aiReply = data.choices[0].message.content;

    res.status(200).json({ reply: aiReply });

  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Server error" });
  }
}
