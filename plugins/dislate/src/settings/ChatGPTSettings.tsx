import { React } from "@vendetta/metro/common"
import { Forms } from "@vendetta/ui/components"
import { useProxy } from "@vendetta/storage"
import { settings } from ".."

const { FormTextInput, FormRow } = Forms

export default () => {
    useProxy(settings)

    return (
        <FormRow label="ChatGPT Settings">
            <FormTextInput
                value={settings.chatGPTApiKey}
                onChange={(v: string) => (settings.chatGPTApiKey = v)}
                placeholder="Enter ChatGPT API Key"
                spellcheck={false}
                autoCorrect={false}
            />
            <FormTextInput
                value={settings.chatGPTModel}
                onChange={(v: string) => (settings.chatGPTModel = v)}
                placeholder="Enter ChatGPT Model (e.g., gpt-3.5-turbo)"
                spellcheck={false}
                autoCorrect={false}
            />
        </FormRow>
    )
}
