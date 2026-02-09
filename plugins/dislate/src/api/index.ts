import DeepL from "./DeepL"
import GTranslate from "./GTranslate"
import OpenRouter from "./OpenRouter"
import GoogleAI from "./GoogleAI"
import ChatGPT from "./ChatGPT"

import { storage } from "@vendetta/plugin"
// Define a default structure for settings if it doesn't exist
// This should match the structure used in other files and what will be managed in the settings UI
export const settings: {
    translator: number;
    target_lang: string;
    immersive_enabled: boolean;
    openRouterApiKey?: string;
    openRouterModel?: string;
    googleAIApiKey?: string;
    googleAIModel?: string;
    chatGPTApiKey?: string;
    chatGPTModel?: string;
} = storage

type TranslateFunction = (text: string, source_lang: string, target_lang: string, original: boolean) => Promise<{ source_lang: string, text: string }>;

const translators: { [key: number]: TranslateFunction } = {
    0: DeepL.translate,
    1: GTranslate.translate,
    2: OpenRouter.translate,
    3: GoogleAI.translate,
    4: ChatGPT.translate,
}

export const translate = async (text: string, source_lang: string = "auto", target_lang: string, original: boolean = false) => {
    const selectedTranslator = translators[settings.translator]

    if (!selectedTranslator) {
        throw new Error("No translator selected or invalid translator ID.")
    }

    return selectedTranslator(text, source_lang, target_lang, original)
}

// Export individual translators for direct access if needed, though the central translate function is preferred.
export {
    DeepL,
    GTranslate,
    OpenRouter,
    GoogleAI,
    ChatGPT
}