// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { useEffect } from "react";

import Log from "@foxglove/log";
import {
  MessagePipelineContext,
  useMessagePipeline,
} from "@foxglove/studio-base/components/MessagePipeline";
import {
  useCurrentLayoutActions,
  useCurrentLayoutSelector,
} from "@foxglove/studio-base/context/CurrentLayoutContext";
import { usePlayerSelection } from "@foxglove/studio-base/context/PlayerSelectionContext";
import useDeepMemo from "@foxglove/studio-base/hooks/useDeepMemo";
import { encodeAppURLState, parseAppURLState } from "@foxglove/studio-base/util/appURLState";
import isDesktopApp from "@foxglove/studio-base/util/isDesktopApp";

const selectUrlState = (ctx: MessagePipelineContext) => ctx.playerState.urlState;

const log = Log.getLogger(__filename);

/**
 * Syncs our current player, layout and other state with the address bar.
 */
export function useStateLocationSynchronization(deepLinks: string[]): void {
  const urlState = useMessagePipeline(selectUrlState);
  const layoutId = useCurrentLayoutSelector((layout) => layout.selectedLayout?.id);
  const stableUrlState = useDeepMemo(urlState);
  const { selectSource } = usePlayerSelection();
  const { setSelectedLayoutId } = useCurrentLayoutActions();

  // Serialize changes of current app state into address bar.
  useEffect(() => {
    if (isDesktopApp()) {
      return;
    }

    // Clear query params if we don't have a valid state.
    if (!stableUrlState) {
      const url = new URL(window.location.href);
      url.searchParams.forEach((_v, k) => url.searchParams.delete(k));
      window.history.replaceState(undefined, "", url.href);
      return;
    }

    const url = encodeAppURLState(new URL(window.location.href), {
      layoutId,
      ...stableUrlState,
    });

    window.history.replaceState(undefined, "", url.href);
  }, [layoutId, stableUrlState]);

  // Load app state from deeplink url if present.
  useEffect(() => {
    const firstLink = deepLinks[0];
    if (firstLink == undefined) {
      return;
    }

    try {
      const appUrlState = parseAppURLState(new URL(firstLink));
      if (appUrlState == undefined) {
        return;
      }
      if (appUrlState instanceof Error) {
        log.error(appUrlState);
        return;
      }

      if (appUrlState.type === "foxglove-data-platform") {
        selectSource(appUrlState.type, appUrlState.options);
      } else if (
        appUrlState.type === "ros1-remote-bagfile" ||
        appUrlState.type === "rosbridge-websocket"
      ) {
        selectSource(appUrlState.type, appUrlState);
      }

      if (appUrlState.layoutId != undefined) {
        setSelectedLayoutId(appUrlState.layoutId);
      }
    } catch (err) {
      log.error(err);
    }
  }, [deepLinks, selectSource, setSelectedLayoutId]);
}
