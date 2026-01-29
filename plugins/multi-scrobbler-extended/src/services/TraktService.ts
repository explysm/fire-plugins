import { Track } from "../../../defs";
import { currentSettings } from "..";
import Constants from "../constants";
import { BaseService } from "./BaseService";

interface TraktWatchingResponse {
  expires_at: string;
  started_at: string;
  action: string;
  type: "movie" | "episode";
  movie?: {
    title: string;
    year: number;
    ids: {
      trakt: number;
      slug: string;
      imdb: string;
      tmdb: number;
    };
  };
  show?: {
    title: string;
    year: number;
    ids: {
      trakt: number;
      slug: string;
      tvdb: number;
      imdb: string;
      tmdb: number;
    };
  };
  episode?: {
    season: number;
    number: number;
    title: string;
    ids: {
      trakt: number;
      tvdb: number;
      imdb: string;
      tmdb: number;
    };
  };
}

interface TraktHistoryResponse {
  id: number;
  watched_at: string;
  action: string;
  type: "movie" | "episode";
  movie?: {
    title: string;
    year: number;
  };
  show?: {
    title: string;
  };
  episode?: {
    season: number;
    number: number;
    title: string;
  };
}

export class TraktService extends BaseService {
  getServiceName(): string {
    return "Trakt";
  }

  protected logVerbose(...args: any[]): void {
    if (currentSettings.verboseLogging) {
      console.log(`[${this.getServiceName()}] Verbose:`, ...args);
    }
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "trakt-api-version": "2",
      "trakt-api-key": currentSettings.traktClientId,
    };

    if (currentSettings.traktAccessToken) {
      headers["Authorization"] = `Bearer ${currentSettings.traktAccessToken}`;
    }

    return headers;
  }

  async validateCredentials(): Promise<boolean> {
    try {
      const username = currentSettings.traktUsername;
      const clientId = currentSettings.traktClientId;

      if (!username || !clientId) {
        throw new Error("Username or Client ID not set for Trakt");
      }

      const url = `${Constants.SERVICES.trakt.baseUrl}/users/${encodeURIComponent(username)}`;
      await this.makeRequest(url, { headers: this.getHeaders() });

      this.log("Credentials validation successful");
      return true;
    } catch (error) {
      this.logError("Credentials validation failed:", error);
      return false;
    }
  }

  async fetchLatestScrobble(): Promise<Track> {
    try {
      const username = currentSettings.traktUsername;
      if (!username) {
        throw new Error("Username not set for Trakt");
      }

      this.logVerbose("Fetching latest activity for user:", username);

      // Check if currently watching
      const watchingUrl = `${Constants.SERVICES.trakt.baseUrl}/users/${encodeURIComponent(username)}/watching`;
      
      let watchingData: TraktWatchingResponse | null = null;
      try {
          const response = await fetch(watchingUrl, {
              headers: this.getHeaders()
          });
          
          if (response.status === 200) {
              watchingData = await response.json();
          } else if (response.status !== 204) {
              this.logVerbose(`Watching API returned status ${response.status}`);
          }
      } catch (error) {
          this.logVerbose("Failed to fetch watching status:", error);
      }

      if (watchingData) {
          this.logVerbose("User is currently watching:", watchingData);
          return this.mapWatchingToTrack(watchingData);
      }

      // If not watching, fetch history
      const historyUrl = `${Constants.SERVICES.trakt.baseUrl}/users/${encodeURIComponent(username)}/history?limit=1`;
      const historyData: TraktHistoryResponse[] = await this.makeRequest(historyUrl, {
          headers: this.getHeaders()
      });

      if (!historyData || historyData.length === 0) {
          throw new Error("No history found");
      }

      const latestHistory = historyData[0];
      this.logVerbose("Latest history item:", latestHistory);
      return this.mapHistoryToTrack(latestHistory);

    } catch (error) {
      this.logError("Failed to fetch latest activity:", error);
      throw error;
    }
  }

  private mapWatchingToTrack(watching: TraktWatchingResponse): Track {
      const isEpisode = watching.type === "episode";
      const name = isEpisode 
          ? watching.episode?.title || `Episode ${watching.episode?.number}`
          : watching.movie?.title || "Unknown Movie";
      
      const artist = isEpisode
          ? watching.show?.title || "Unknown Show"
          : `Movie (${watching.movie?.year || "Unknown Year"})`;

      const album = isEpisode
          ? `Season ${watching.episode?.season}, Episode ${watching.episode?.number}`
          : "";

      const from = Math.floor(new Date(watching.started_at).getTime() / 1000);
      const to = Math.floor(new Date(watching.expires_at).getTime() / 1000);
      const duration = to - from;

      return {
          name,
          artist,
          album,
          albumArt: null, // Trakt API doesn't provide easy image URLs without Fanart.tv or TMDB
          url: `https://trakt.tv/users/${currentSettings.traktUsername}`,
          date: "now",
          nowPlaying: true,
          loved: false,
          from,
          to,
          duration
      };
  }

  private mapHistoryToTrack(history: TraktHistoryResponse): Track {
    const isEpisode = history.type === "episode";
    const name = isEpisode 
        ? history.episode?.title || `Episode ${history.episode?.number}`
        : history.movie?.title || "Unknown Movie";
    
    const artist = isEpisode
        ? history.show?.title || "Unknown Show"
        : `Movie (${history.movie?.year || "Unknown Year"})`;

    const album = isEpisode
        ? `Season ${history.episode?.season}, Episode ${history.episode?.number}`
        : "";

    const timestamp = Math.floor(new Date(history.watched_at).getTime() / 1000);

    return {
        name,
        artist,
        album,
        albumArt: null,
        url: `https://trakt.tv/users/${currentSettings.traktUsername}`,
        date: history.watched_at,
        nowPlaying: false,
        loved: false,
        from: timestamp,
        to: null,
        duration: null
    };
  }
}
