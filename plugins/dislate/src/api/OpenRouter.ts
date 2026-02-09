import { settings } from ".." // Assuming settings can be imported here
import { OpenRouterResponse } from "../type"

const API_URL = "https://openrouter.ai/api/v1/chat/completions"

const translate = async (text: string, source_lang: string = "auto", target_lang: string, original: boolean = false) => {
    try {
        if (original) return { source_lang, text }

        if (!settings.openRouterApiKey) {
            throw new Error("OpenRouter API Key is not set in settings.")
        }

        const model = settings.openRouterModel || "openai/gpt-3.5-turbo"; // Default model

        const response: OpenRouterResponse = await (await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${settings.openRouterApiKey}`,
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
            throw new Error(`OpenRouter translation failed: ${response.error?.message || "Unknown error"}`)
        }

    } catch (e) {
        throw new Error(`Failed to fetch from OpenRouter: ${e instanceof Error ? e.message : String(e)}`)
    }
}

export default { translate }
