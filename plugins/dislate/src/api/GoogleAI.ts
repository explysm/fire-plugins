import { settings } from ".." // Assuming settings can be imported here
import { GoogleAIResponse } from "../type"

// This assumes a simple proxy or direct access to Gemini API
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"

const translate = async (text: string, source_lang: string = "auto", target_lang: string, original: boolean = false) => {
    try {
        if (original) return { source_lang, text }

        if (!settings.googleAIApiKey) {
            throw new Error("Google AI API Key is not set in settings.")
        }

        const model = settings.googleAIModel || "gemini-pro"; // Default model

        const response: GoogleAIResponse = await (await fetch(`${API_URL}?key=${settings.googleAIApiKey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            { text: `Translate the following text from ${source_lang} to ${target_lang}. Only return the translated text, without any additional conversational filler.

${text}` }
                        ]
                    }
                ]
            })
        })).json()

        if (response.candidates && response.candidates.length > 0 && response.candidates[0].content?.parts.length > 0) {
            return { source_lang, text: response.candidates[0].content.parts[0].text.trim() }
        } else {
            throw new Error(`Google AI translation failed: ${response.promptFeedback?.blockReason || response.error?.message || "Unknown error"}`)
        }

    } catch (e) {
        throw new Error(`Failed to fetch from Google AI: ${e instanceof Error ? e.message : String(e)}`)
    }
}

export default { translate }
