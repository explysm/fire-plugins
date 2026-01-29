import { plugin } from "@vendetta";
import { useProxy } from "@vendetta/storage";
import { React } from "@vendetta/metro/common";
import { NavigationNative } from "@vendetta/metro/common";
import { findByProps } from "@vendetta/metro";
import {
  Stack,
  TableRowGroup,
  TableRow,
  TableSwitchRow,
  TableCheckboxRow,
  ScrollView,
} from "./pages/components/TableComponents";

// Import pages
import LastFmSettingsPage from "./pages/LastFmSettingsPage";
import LibreFmSettingsPage from "./pages/LibreFmSettingsPage";
import ListenBrainzSettingsPage from "./pages/ListenBrainzSettingsPage";
import TraktSettingsPage from "./pages/TraktSettingsPage";
import DisplaySettingsPage from "./pages/DisplaySettingsPage";
import RPCCustomizationSettingsPage from "./pages/RPCCustomizationSettingsPage";
import IgnoreListSettingsPage from "./pages/IgnoreListSettingsPage";
import LoggingSettingsPage from "./pages/LoggingSettingsPage";

import { ServiceType } from "../../defs";

// Storage defaults
plugin.storage.username ??= "";
plugin.storage.apiKey ??= "";
plugin.storage.appName ??= "Music";
plugin.storage.timeInterval ??= 5;
plugin.storage.showTimestamp ??= true;
plugin.storage.listeningTo ??= true;
plugin.storage.verboseLogging ??= false;
plugin.storage.service ??= "lastfm";
plugin.storage.librefmUsername ??= "";
plugin.storage.librefmApiKey ??= "";
plugin.storage.listenbrainzUsername ??= "";
plugin.storage.listenbrainzToken ??= "";
plugin.storage.traktUsername ??= "";
plugin.storage.traktClientId ??= "";
plugin.storage.traktAccessToken ??= "";
plugin.storage.addToSidebar ??= true;
plugin.storage.showLargeText ??= true;
plugin.storage.ignoreList ??= [];
plugin.storage.showAlbumInTooltip ??= true;
plugin.storage.showDurationInTooltip ??= true;

export const getStorage = (k: string, fallback?: any) =>
  plugin.storage[k] ?? fallback;
export const setStorage = (k: string, v: any) => (plugin.storage[k] = v);

// Integrated ServiceFactory
class ServiceFactory {
  static getServiceDisplayName(service: ServiceType): string {
    switch (service) {
      case "lastfm":
        return "Last.fm";
      case "librefm":
        return "Libre.fm";
      case "listenbrainz":
        return "ListenBrainz";
      case "trakt":
        return "Trakt";
      default:
        return "Unknown";
    }
  }

  static async testService(service: ServiceType): Promise<boolean> {
    try {
      switch (service) {
        case "lastfm":
          return await this.testLastFmConnection();
        case "librefm":
          return await this.testLibreFmConnection();
        case "listenbrainz":
          return await this.testListenBrainzConnection();
        case "trakt":
          return await this.testTraktConnection();
        default:
          return false;
      }
    } catch (error) {
      console.error(`Error testing ${service}:`, error);
      return false;
    }
  }

  private static async testLastFmConnection(): Promise<boolean> {
    const username = getStorage("username");
    const apiKey = getStorage("apiKey");
    if (!username || !apiKey) return false;
    try {
      const response = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${username}&api_key=${apiKey}&format=json`,
      );
      const data = await response.json();
      return !data.error;
    } catch (error) {
      console.error("Last.fm connection test failed:", error);
      return false;
    }
  }

  private static async testLibreFmConnection(): Promise<boolean> {
    const username = getStorage("librefmUsername");
    const apiKey = getStorage("librefmApiKey");
    if (!username || !apiKey) return false;
    try {
      const response = await fetch(
        `https://libre.fm/2.0/?method=user.getinfo&user=${username}&api_key=${apiKey}&format=json`,
      );
      const data = await response.json();
      return !data.error;
    } catch (error) {
      console.error("Libre.fm connection test failed:", error);
      return false;
    }
  }

  private static async testListenBrainzConnection(): Promise<boolean> {
    const username = getStorage("listenbrainzUsername");
    const token = getStorage("listenbrainzToken");
    if (!username) return false;
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["Authorization"] = `Token ${token}`;
      const response = await fetch(
        `https://api.listenbrainz.org/1/user/${username}/listen-count`,
        { headers },
      );
      return response.status === 200;
    } catch (error) {
      console.error("ListenBrainz connection test failed:", error);
      return false;
    }
  }

  private static async testTraktConnection(): Promise<boolean> {
    const username = getStorage("traktUsername");
    const clientId = getStorage("traktClientId");
    const token = getStorage("traktAccessToken");
    if (!username || !clientId) return false;
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "trakt-api-version": "2",
        "trakt-api-key": clientId,
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const response = await fetch(
        `https://api.trakt.tv/users/${username}`,
        { headers },
      );
      return response.status === 200;
    } catch (error) {
      console.error("Trakt connection test failed:", error);
      return false;
    }
  }
}

export const serviceFactory = ServiceFactory;

export default function Settings() {
  useProxy(plugin.storage);
  const navigation = NavigationNative.useNavigation();
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  const currentService = getStorage("service") as ServiceType;

  const getCredentialStatus = (service: ServiceType) => {
    switch (service) {
      case "lastfm":
        return getStorage("username") && getStorage("apiKey")
          ? "✅ Configured"
          : "❌ Missing credentials";
      case "librefm":
        return getStorage("librefmUsername") && getStorage("librefmApiKey")
          ? "✅ Configured"
          : "❌ Missing credentials";
      case "listenbrainz":
        return getStorage("listenbrainzUsername")
          ? "✅ Configured"
          : "❌ Missing username";
      case "trakt":
        return getStorage("traktUsername") && getStorage("traktClientId")
          ? "✅ Configured"
          : "❌ Missing credentials";
      default:
        return "❓ Unknown";
    }
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 10 }}>
      <Stack spacing={8}>
        {/* Service Selection */}
        <TableRowGroup title="Active Service">
          <TableRow
            label="Current Service"
            subLabel={
              currentService
                ? `Using: ${serviceFactory.getServiceDisplayName(currentService)}`
                : "No service selected"
            }
          />
          {(["lastfm", "librefm", "listenbrainz", "trakt"] as ServiceType[]).map(
            (service) => (
              <TableCheckboxRow
                key={service}
                label={serviceFactory.getServiceDisplayName(service)}
                subLabel={getCredentialStatus(service)}
                // Single choice logic: check if this matches current service
                checked={currentService === service}
                onPress={() => {
                  // Only update if clicking a service that isn't already selected
                  if (service !== currentService) {
                    setStorage("service", service);
                    forceUpdate();
                  }
                }}
              />
            ),
          )}
        </TableRowGroup>

        {/* Service Configuration */}
        <TableRowGroup title="Service Configuration">
          <TableRow
            label="Last.fm Settings"
            subLabel="Configure Last.fm credentials and options"
            trailing={<TableRow.Arrow />}
            onPress={() =>
              navigation.push("VendettaCustomPage", {
                title: "Last.fm Settings",
                render: LastFmSettingsPage,
              })
            }
          />
          <TableRow
            label="Libre.fm Settings"
            subLabel="Configure Libre.fm credentials and options"
            trailing={<TableRow.Arrow />}
            onPress={() =>
              navigation.push("VendettaCustomPage", {
                title: "Libre.fm Settings",
                render: LibreFmSettingsPage,
              })
            }
          />
          <TableRow
            label="ListenBrainz Settings"
            subLabel="Configure ListenBrainz credentials and options"
            trailing={<TableRow.Arrow />}
            onPress={() =>
              navigation.push("VendettaCustomPage", {
                title: "ListenBrainz Settings",
                render: ListenBrainzSettingsPage,
              })
            }
          />
          <TableRow
            label="Trakt Settings"
            subLabel="Configure Trakt credentials and options"
            trailing={<TableRow.Arrow />}
            onPress={() =>
              navigation.push("VendettaCustomPage", {
                title: "Trakt Settings",
                render: TraktSettingsPage,
              })
            }
          />
        </TableRowGroup>

        {/* Plugin Configuration */}
        <TableRowGroup title="Plugin Configuration">
          <TableRow
            label="Display Settings"
            subLabel="Customize app name and update interval"
            trailing={<TableRow.Arrow />}
            onPress={() =>
              navigation.push("VendettaCustomPage", {
                title: "Display Settings",
                render: DisplaySettingsPage,
              })
            }
          />
          <TableRow
            label="RPC Customization"
            subLabel="Customize Discord rich presence display options"
            trailing={<TableRow.Arrow />}
            onPress={() =>
              navigation.push("VendettaCustomPage", {
                title: "RPC Customization",
                render: RPCCustomizationSettingsPage,
              })
            }
          />
          <TableRow
            label="Ignore List"
            subLabel="Configure apps that should hide your status"
            trailing={<TableRow.Arrow />}
            onPress={() =>
              navigation.push("VendettaCustomPage", {
                title: "Ignore List Settings",
                render: IgnoreListSettingsPage,
              })
            }
          />
          <TableRow
            label="Logging Settings"
            subLabel="Configure logging and debugging options"
            trailing={<TableRow.Arrow />}
            onPress={() =>
              navigation.push("VendettaCustomPage", {
                title: "Logging Settings",
                render: LoggingSettingsPage,
              })
            }
          />
          <TableSwitchRow
            label="Add to Sidebar"
            subLabel="Show plugin in Discord settings"
            value={getStorage("addToSidebar", false)}
            onValueChange={(value: boolean) => {
              setStorage("addToSidebar", value);
              forceUpdate();
            }}
          />
        </TableRowGroup>

        {/* About */}
        <TableRowGroup title="About">
          <TableRow
            label="Multi Scrobbler"
            subLabel="Show off your music status from multiple services"
          />
          <TableRow label="Author" subLabel="kmmiio99o" />
          <TableRow label="Version" subLabel="1.3.2" />
        </TableRowGroup>
      </Stack>
    </ScrollView>
  );
}
