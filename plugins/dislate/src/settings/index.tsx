import { getAssetIDByName } from "@vendetta/ui/assets"
import { React, ReactNative, stylesheet, constants, NavigationNative, url } from "@vendetta/metro/common"
import { semanticColors } from "@vendetta/ui"
import { Forms } from "@vendetta/ui/components"
import { manifest } from "@vendetta/plugin"
import { useProxy } from "@vendetta/storage"

import { settings } from ".."
import TargetLang from "./TargetLang"
import TranslatorPage from "./TranslatorPage"
import OpenRouterSettings from "./OpenRouterSettings"
import GoogleAISettings from "./GoogleAISettings"
import ChatGPTSettings from "./ChatGPTSettings"

const { ScrollView, Text } = ReactNative
const { FormRow, FormSwitchRow } = Forms

const styles = stylesheet.createThemedStyleSheet({
    subheaderText: {
        color: semanticColors.HEADER_SECONDARY,
        textAlign: 'center',
        margin: 10,
        marginBottom: 50,
        letterSpacing: 0.25,
        fontFamily: constants.Fonts.PRIMARY_BOLD,
        fontSize: 14
    }
})

const getTranslatorName = (translatorId: number) => {
    switch (translatorId) {
        case 0: return "DeepL";
        case 1: return "Google Translate";
        case 2: return "OpenRouter";
        case 3: return "Google AI";
        case 4: return "ChatGPT";
        default: return "Unknown";
    }
}

export default () => {
    const navigation = NavigationNative.useNavigation()
    useProxy(settings)

    return (
        <ScrollView>
            <FormSwitchRow
                label={"Immersive Translation"}
                subLabel={"Display both original and translation"}
                leading={<FormRow.Icon source={getAssetIDByName("ic_chat_bubble_filled_24px")} />}
                value={settings.immersive_enabled ?? true} // Default enabled
                onValueChange={(v) => {
                    settings.immersive_enabled = v
                }}
            />

            <FormRow
                label={"Translate to"}
                subLabel={settings.target_lang?.toLowerCase()}
                leading={<FormRow.Icon source={getAssetIDByName("ic_activity_24px")} />}
                trailing={() => <FormRow.Arrow />}
                onPress={() => navigation.push("VendettaCustomPage", {
                    title: "Translate to",
                    render: TargetLang,
                })}
            />
            <FormRow
                label={"Translator"}
                subLabel={getTranslatorName(settings.translator)}
                leading={<FormRow.Icon source={getAssetIDByName("ic_locale_24px")} />}
                trailing={() => <FormRow.Arrow />}
                onPress={() => navigation.push("VendettaCustomPage", {
                    title: "Translator",
                    render: TranslatorPage,
                })}
            />

            {(settings.translator === 2 || settings.translator === 3 || settings.translator === 4) && (
                <>
                    <FormRow
                        label="AI Translator Settings"
                        subLabel="Configure API keys and models"
                        leading={<FormRow.Icon source={getAssetIDByName("ic_cog_24px")} />}
                        trailing={() => <FormRow.Arrow />}
                        onPress={() => {
                            let renderComponent;
                            switch (settings.translator) {
                                case 2: renderComponent = OpenRouterSettings; break;
                                case 3: renderComponent = GoogleAISettings; break;
                                case 4: renderComponent = ChatGPTSettings; break;
                                default: return;
                            }
                            navigation.push("VendettaCustomPage", {
                                title: `${getTranslatorName(settings.translator)} Settings`,
                                render: renderComponent,
                            })
                        }}
                    />
                </>
            )}

            <Text style={styles.subheaderText} onPress={() => url.openURL("https://github.com/Rico040/bunny-plugins")}>
                {`Build: (${manifest.hash.substring(0, 7)})`}
            </Text>
        </ScrollView>
    )
}