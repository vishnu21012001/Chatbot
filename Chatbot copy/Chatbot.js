const incomingMessageImage = "images/chameleon (2).png";
const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const optionsButton = document.querySelector('.options-button');
const optionsContainer = document.querySelector('.options-container');
const option1Button = document.getElementById('option1');
const option2Button = document.getElementById('option2');
const option3Button = document.getElementById('option3');
const sendButton = document.getElementById('send-btn');
const quickOptionsContainer = document.querySelector('.quick-options');


option1Button.addEventListener('click', () => {
    const response = "Learn About our Projects";
    simulateTyping(response);
    sendButton.click();
    quickOptionsContainer.style.display = 'none';
});

option2Button.addEventListener('click', () => {
    const response = "Support Us";
    simulateTyping(response);
    sendButton.click();
    quickOptionsContainer.style.display = 'none';
});

option3Button.addEventListener('click', () => {

    const response = "I have another Question";
    simulateTyping(response);
    sendButton.click();
    quickOptionsContainer.style.display = 'none';
});

function simulateTyping(message) {

    chatInput.value = message;
    const inputEvent = new Event('input', {
        bubbles: true,
        cancelable: true,
    });
    chatInput.dispatchEvent(inputEvent);
}


optionsButton.addEventListener('click', () => {
    optionsContainer.style.display = optionsContainer.style.display === 'block' ? 'none' : 'block';
});

// Close options when clicking outside of it
document.addEventListener('click', (event) => {
    if (!optionsButton.contains(event.target) && !optionsContainer.contains(event.target)) {
        optionsContainer.style.display = 'none';
    }
});


let userMessage = null;
const API_KEY = "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"; // API key 
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {

    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);

    let chatContent;

    if (className === "outgoing") {
        chatContent = `<p></p>`;
    } else if (className === "incoming") {

        chatContent = `<img src="images/chameleon (2).png" alt="Incoming Message Icon"><p></p>`;
    }

    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}


const generateResponse = (chatElement) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = chatElement.querySelector("p");
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sk - VzbwSd4rKhlLjmQjU1ULT3BlbkFJUWMb9AQFtpdVVemcYmMX}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userMessage }],
        })
    }


    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content.trim();
    }).catch(() => {
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong. Please try again.";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));

    // Adding image icon to the incoming message
    const imageElement = document.createElement("img");
    imageElement.src = incomingMessageImage;
    imageElement.alt = "Incoming Message Image";
    imageElement.classList.add("incoming-image");
    chatElement.insertBefore(imageElement, messageElement);

    const existingImage = chatElement.querySelector(".incoming-image");

    if (existingImage) {
        chatElement.replaceChild(imageElement, existingImage);
    } else {
        // Otherwise, append the image before the message element
        chatElement.insertBefore(imageElement, messageElement);
    }
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // input textarea and its height
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}
// height of the input textarea
chatInput.addEventListener("input", () => {

    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));