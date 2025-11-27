async function sendMessage() {
  const input = document.getElementById("user-input");
  const text = input.value.trim();
  if (text === "") return;

  appendMessage(text, "user");
  input.value = "";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await response.json();
    appendMessage(data.reply, "bot");
  } catch (error) {
    appendMessage("Error connecting to AI server.", "bot");
  }
}

function appendMessage(text, sender) {
  const chatContainer = document.getElementById("chat-container");
  const msg = document.createElement("div");
  msg.className = "message " + (sender === "user" ? "user-message" : "bot-message");
  msg.textContent = text;
  chatContainer.appendChild(msg);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function handleKeyPress(event) {
  if (event.key === "Enter") sendMessage();
}
