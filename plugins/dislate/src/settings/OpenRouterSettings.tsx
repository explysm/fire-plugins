import { React } from "@vendetta/metro/common"
import { Forms } from "@vendetta/ui/components"
import { useProxy } from "@vendetta/storage"
import { settings } from ".."

const { FormTextInput, FormRow } = Forms

export default () => {
    useProxy(settings)

    return (
        <FormRow label="OpenRouter Settings">
            <FormTextInput
                value={settings.openRouterApiKey}
                onChange={(v: string) => (settings.openRouterApiKey = v)}
                placeholder="Enter OpenRouter API Key"
                spellcheck={false}
                autoCorrect={false}
            />
            <FormTextInput
                value={settings.openRouterModel}
                onChange={(v: string) => (settings.openRouterModel = v)}
                placeholder="Enter OpenRouter Model (e.g., openai/gpt-3.5-turbo)"
                spellcheck={false}
                autoCorrect={false}
            />
        </FormRow>
    )
}
