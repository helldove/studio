// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { fromRFC3339String } from "@foxglove/rostime";
import { LayoutID } from "@foxglove/studio-base/index";
import { PlayerURLState } from "@foxglove/studio-base/players/types";
import { assertNever } from "@foxglove/studio-base/util/assertNever";
import isDesktopApp from "@foxglove/studio-base/util/isDesktopApp";

export type AppURLState = PlayerURLState & { layoutId: LayoutID | undefined };

/**
 * Encodes app state in a URL's query params.
 *
 * @param url The base URL to encode params into.
 * @param layoutId Optinal layout ID to store in the URL.
 * @param urlState The player state to encode.
 * @returns A url with all app state stored as query pararms.
 */
export function encodeAppURLState(url: URL, urlState: AppURLState): URL {
  // Clear all exisiting params first.
  url.searchParams.forEach((_v, k) => url.searchParams.delete(k));

  if (urlState.layoutId) {
    url.searchParams.set("layoutId", urlState.layoutId);
  }

  if (urlState.type === "ros1-remote-bagfile") {
    // We can't get full paths to local files so only set this for remote files.
    if (urlState.url.startsWith("http")) {
      url.searchParams.set("type", urlState.type);
      url.searchParams.set("url", urlState.url);
    }
  } else if (
    urlState.type === "ros1" ||
    urlState.type === "ros2" ||
    urlState.type === "rosbridge-websockete"
  ) {
    url.searchParams.set("type", urlState.type);
    url.searchParams.set("url", urlState.url);
  } else if (urlState.type === "foxglove-data-platform") {
    url.searchParams.set("type", urlState.type);
    Object.entries(urlState.options).forEach(([k, v]) => {
      url.searchParams.set(k, v);
    });
  } else {
    assertNever(urlState, "Unknown url state.");
  }

  url.searchParams.sort();

  return url;
}

/**
 * Tries to parse a state url into one of the types we know how to open.
 *
 * @param url URL to try to parse.
 * @returns Parsed URL type or undefined if the url is not a foxglove URL.
 */
export function parseAppURLState(url: URL): AppURLState | Error | undefined {
  if (isDesktopApp() && url.protocol !== "foxglove:") {
    return Error("Unknown protocol.");
  }

  if (!isDesktopApp() && url.pathname !== "/") {
    return Error("Unknown path.");
  }

  const type = url.searchParams.get("type");
  if (!type) {
    return undefined;
  }

  const layoutId = url.searchParams.get("layoutId");
  if (type === "ros1-remote-bagfile" || type === "rosbridge-websockete") {
    const resourceUrl = url.searchParams.get("url");
    if (!resourceUrl) {
      return Error(`Missing resource url param in ${url}`);
    } else {
      return {
        layoutId: layoutId ? (layoutId as LayoutID) : undefined,
        type,
        url: resourceUrl,
      };
    }
  } else if (type === "foxglove-data-platform") {
    const start = url.searchParams.get("start") ?? "";
    const end = url.searchParams.get("end") ?? "";
    const seek = url.searchParams.get("seekTo") ?? undefined;
    const deviceId = url.searchParams.get("deviceId");
    if (!deviceId) {
      return Error(`Missing deviceId param in ${url}`);
    }

    if (
      !fromRFC3339String(start) ||
      !fromRFC3339String(end) ||
      (seek && !fromRFC3339String(seek))
    ) {
      return Error(`Missing or invalid timestamp(s) in ${url}`);
    }
    return {
      layoutId: layoutId ? (layoutId as LayoutID) : undefined,
      type: "foxglove-data-platform",
      options: {
        start,
        end,
        seek,
        deviceId,
      },
    };
  } else {
    return Error(`Unknown deep link type ${url}`);
  }
}

/**
 * Tries to parse app url state from the window's current location.
 */
export function windowAppURLState(): AppURLState | Error | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  return parseAppURLState(new URL(window.location.href));
}

/**
 * Checks to see if we have a valid state encoded in the url.
 *
 * @returns True if the window has a valid encoded url state.
 */
export function windowHasValidURLState(): boolean {
  const urlState = windowAppURLState();
  return urlState != undefined && !(urlState instanceof Error);
}
