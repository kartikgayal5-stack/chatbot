export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'No message received' });
  }

  try {
    const result = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + process.env.GEMINI_API_KEY,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }]
        })
      }
    );

    const data = await result.json();

    if (!data || !data.candidates || !data.candidates[0].content.parts[0].text) {
      return res.status(500).json({ error: 'Invalid response from Gemini' });
    }

    res.status(200).json({ reply: data.candidates[0].content.parts[0].text });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
}
