export type ServiceType = "lastfm" | "librefm" | "listenbrainz" | "trakt";

export interface ServiceConfig {
  name: string;
  baseUrl: string;
  requiresApiKey: boolean;
  requiresToken: boolean;
}

export interface Track {
  name: string;
  artist: string;
  album?: string;
  albumArt?: string;
  url?: string;
  nowPlaying: boolean;
  from?: number;
  to?: number;
  duration?: number;
}

export interface ServiceClient {
  fetchLatestScrobble(): Promise<Track>;
  validateCredentials(): Promise<boolean>;
  getServiceName(): string;
}

export interface LFMSettings {
  username?: string;
  apiKey?: string;
  appName?: string;
  timeInterval?: number;
  showTimestamp?: boolean;
  listeningTo?: boolean;
  showLargeText?: boolean;
  ignoreYouTubeMusic?: boolean;
  verboseLogging?: boolean;
  service?: ServiceType;
  librefmUsername?: string;
  librefmApiKey?: string;
  listenbrainzUsername?: string;
  listenbrainzToken?: string;
  traktUsername?: string;
  traktClientId?: string;
  traktAccessToken?: string;
  addToSidebar?: boolean;
  ignoreList?: string[];
  showAlbumInTooltip?: boolean;
  showDurationInTooltip?: boolean;
  [key: string]: any;
}

export interface Activity {
  name: string;
  type: number;
  flags?: number;
  details?: string;
  state?: string;
  timestamps?: {
    start?: number;
    end?: number;
  };
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
  status_display_type?: number;
  application_id?: string;
}
