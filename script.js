async function sendMessage() {
    const input = document.getElementById("user-input");
    const text = input.value.trim();
    if (text === "") return;

    appendMessage(text, "user");
    input.value = "";

    try {
        const response = await fetch("/api/gemini", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
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

    const messageElement = document.createElement("div");
    messageElement.classList.add("message");

    if (sender === "user") {
        messageElement.classList.add("user-message");
    } else {
        messageElement.classList.add("bot-message");
    }

    messageElement.textContent = text;
    chatContainer.appendChild(messageElement);

    // Auto scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}
