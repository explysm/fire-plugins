import { settings } from ".." // Assuming settings can be imported here
import { ChatGPTResponse } from "../type"

const API_URL = "https://api.openai.com/v1/chat/completions"

const translate = async (text: string, source_lang: string = "auto", target_lang: string, original: boolean = false) => {
    try {
        if (original) return { source_lang, text }

        if (!settings.chatGPTApiKey) {
            throw new Error("ChatGPT API Key is not set in settings.")
        }

        const model = settings.chatGPTModel || "gpt-3.5-turbo"; // Default model

        const response: ChatGPTResponse = await (await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${settings.chatGPTApiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: "system", content: `You are a highly accurate language translator. Translate the user's message from ${source_lang} to ${target_lang}. Only return the translated text, without any additional conversational filler.` },
                    { role: "user", content: text }
                ]
            })
        })).json()

        if (response.choices && response.choices.length > 0 && response.choices[0].message) {
            return { source_lang, text: response.choices[0].message.content.trim() }
        } else {
            throw new Error(`ChatGPT translation failed: ${response.error?.message || "Unknown error"}`)
        }

    } catch (e) {
        throw new Error(`Failed to fetch from ChatGPT: ${e instanceof Error ? e.message : String(e)}`)
    }
}

export default { translate }
