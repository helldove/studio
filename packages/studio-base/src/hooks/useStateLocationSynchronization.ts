// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { useEffect } from "react";

import {
  MessagePipelineContext,
  useMessagePipeline,
} from "@foxglove/studio-base/components/MessagePipeline";
import { useCurrentLayoutSelector } from "@foxglove/studio-base/context/CurrentLayoutContext";
import useDeepMemo from "@foxglove/studio-base/hooks/useDeepMemo";
import { encodeAppURLState } from "@foxglove/studio-base/util/appStateURL";
import isDesktopApp from "@foxglove/studio-base/util/isDesktopApp";

const selectUrlState = (ctx: MessagePipelineContext) => ctx.playerState.urlState;

/**
 * Syncs our current player, layout and other state with the address bar.
 */
export function useStateLocationSynchronization(): void {
  const urlState = useMessagePipeline(selectUrlState);
  const layoutId = useCurrentLayoutSelector((layout) => layout.selectedLayout?.id);
  const stableUrlState = useDeepMemo(urlState);

  useEffect(() => {
    if (isDesktopApp() || !stableUrlState) {
      return;
    }

    const url = encodeAppURLState(new URL(window.location.href), {
      layoutId,
      ...stableUrlState,
    });

    window.history.replaceState(undefined, "", url.href);
  }, [layoutId, stableUrlState]);
}
