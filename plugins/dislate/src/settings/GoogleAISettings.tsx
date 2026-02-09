import { React } from "@vendetta/metro/common"
import { Forms } from "@vendetta/ui/components"
import { useProxy } from "@vendetta/storage"
import { settings } from ".."

const { FormTextInput, FormRow } = Forms

export default () => {
    useProxy(settings)

    return (
        <FormRow label="Google AI Settings">
            <FormTextInput
                value={settings.googleAIApiKey}
                onChange={(v: string) => (settings.googleAIApiKey = v)}
                placeholder="Enter Google AI API Key"
                spellcheck={false}
                autoCorrect={false}
            />
            <FormTextInput
                value={settings.googleAIModel}
                onChange={(v: string) => (settings.googleAIModel = v)}
                placeholder="Enter Google AI Model (e.g., gemini-pro)"
                spellcheck={false}
                autoCorrect={false}
            />
        </FormRow>
    )
}
