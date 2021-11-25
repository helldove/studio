// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { useCallback, useRef } from "react";

import { useShallowMemo } from "@foxglove/hooks";
import HelpInfoContext, {
  IHelpInfo,
  HelpInfo,
} from "@foxglove/studio-base/context/HelpInfoContext";
import { DEFAULT_HELP_INFO } from "@foxglove/studio-base/providers/HelpInfoProvider";

export default function MockHelpInfoProvider({
  isEmpty,
  children,
}: {
  isEmpty?: boolean;
  children: React.ReactNode;
}): JSX.Element {
  const isHelpInfoSet = isEmpty == undefined ? false : isEmpty;
  const helpInfo = useRef<HelpInfo>(
    isHelpInfoSet ? DEFAULT_HELP_INFO : { title: "Some title", content: <>Some help content</> },
  );
  const helpInfoListeners = useRef(new Set<(_: HelpInfo) => void>());

  const getHelpInfo = useCallback((): HelpInfo => helpInfo.current, []);
  const setHelpInfo = useCallback((info: HelpInfo): void => {
    helpInfo.current = info;
    for (const listener of [...helpInfoListeners.current]) {
      listener(helpInfo.current);
    }
  }, []);

  const value: IHelpInfo = useShallowMemo({
    getHelpInfo,
    setHelpInfo,
    addHelpInfoListener: useCallback(() => {}, []),
    removeHelpInfoListener: useCallback(() => {}, []),
  });

  return <HelpInfoContext.Provider value={value}>{children}</HelpInfoContext.Provider>;
}
