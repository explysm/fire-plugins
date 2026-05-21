// Profanity Counter (Synchronous Version)
const badWords = ["fuck", "shit", "bitch"]; // Example local list
const lowContent = content.toLowerCase();
let isProfane = false;

for (const word of badWords) {
    if (lowContent.includes(word)) {
        isProfane = true;
        break;
    }
}

if (isProfane) {
    // Increment global counter
    utils.storage.badWords = (utils.storage.badWords || 0) + 1;
    utils.toast("Profanity detected! Total: " + utils.storage.badWords);
    return content + "\n-# ⚠️ Swear count: " + utils.storage.badWords;
}

return content;
