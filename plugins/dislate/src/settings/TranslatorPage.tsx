import { getAssetIDByName } from "@vendetta/ui/assets"
import { React, ReactNative } from "@vendetta/metro/common"
import { Forms } from "@vendetta/ui/components"
import { showToast } from "@vendetta/ui/toasts"
import { useProxy } from "@vendetta/storage"
import { settings } from ".."

const { FormRow } = Forms
const { ScrollView } = ReactNative

export default () => {
    useProxy(settings)
    return (
    <ScrollView style={{ flex: 1 }}>
            <FormRow
                label="DeepL"
                trailing={() => <FormRow.Arrow />}
                onPress={() => {
                    if (settings.translator == 0) return
                    settings.translator = 0
                    showToast(`Saved Translator to DeepL`, getAssetIDByName("check"))
                }}
            />
            <FormRow
                label="Google Translate"
                trailing={() => <FormRow.Arrow />}
                onPress={() => {
                    if (settings.translator == 1) return
                    settings.translator = 1
                    showToast(`Saved Translator to Google Translate`, getAssetIDByName("check"))
                }}
            />
            <FormRow
                label="OpenRouter"
                trailing={() => <FormRow.Arrow />}
                onPress={() => {
                    if (settings.translator == 2) return
                    settings.translator = 2
                    showToast(`Saved Translator to OpenRouter`, getAssetIDByName("check"))
                }}
            />
            <FormRow
                label="Google AI"
                trailing={() => <FormRow.Arrow />}
                onPress={() => {
                    if (settings.translator == 3) return
                    settings.translator = 3
                    showToast(`Saved Translator to Google AI`, getAssetIDByName("check"))
                }}
            />
            <FormRow
                label="ChatGPT"
                trailing={() => <FormRow.Arrow />}
                onPress={() => {
                    if (settings.translator == 4) return
                    settings.translator = 4
                    showToast(`Saved Translator to ChatGPT`, getAssetIDByName("check"))
                }}
            />
    </ScrollView>)
}