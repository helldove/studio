// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
//
// This file incorporates work covered by the following copyright and
// permission notice:
//
//   Copyright 2018-2021 Cruise LLC
//
//   This source code is licensed under the Apache License, Version 2.0,
//   found at http://www.apache.org/licenses/LICENSE-2.0
//   You may not use this file except in compliance with the License.

import { useCallback, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { useShallowMemo } from "@foxglove/hooks";
import HelpInfoContext, {
  IHelpInfo,
  HelpInfo,
} from "@foxglove/studio-base/context/HelpInfoContext";
import { PanelCatalog, PanelInfo } from "@foxglove/studio-base/context/PanelCatalogContext";
import MockCurrentLayoutProvider from "@foxglove/studio-base/providers/CurrentLayoutProvider/MockCurrentLayoutProvider";
import { DEFAULT_HELP_INFO } from "@foxglove/studio-base/providers/HelpInfoProvider";
import PanelSetup from "@foxglove/studio-base/stories/PanelSetup";
import { PanelConfigSchemaEntry } from "@foxglove/studio-base/types/panels";

import HelpSidebar from ".";

export default {
  title: "components/HelpSidebar",
  component: HelpSidebar,
};

const allPanels: readonly PanelInfo[] = [
  { title: "Some Panel", type: "Sample1", module: async () => await new Promise(() => {}) },
  {
    title: "Another Panel",
    type: "Sample2",
    module: async () => await new Promise(() => {}),
    help: <>Another Panel&apos;s help content</>,
  },
];

class MockPanelCatalog implements PanelCatalog {
  async getConfigSchema(type: string): Promise<PanelConfigSchemaEntry<string>[] | undefined> {
    const info = this.getPanelByType(type);
    if (!info) {
      return undefined;
    }
    const module = await info?.module();
    return module.default.configSchema;
  }
  getPanels(): readonly PanelInfo[] {
    return allPanels;
  }
  getPanelByType(type: string): PanelInfo | undefined {
    return allPanels.find((panel) => panel.preconfigured !== true && panel.type === type);
  }
}

function MockHelpInfoProvider({
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

export function Home(): JSX.Element {
  return (
    <div style={{ margin: 30, height: 400 }}>
      <DndProvider backend={HTML5Backend}>
        <MockHelpInfoProvider isEmpty={true}>
          <MockCurrentLayoutProvider>
            <PanelSetup
              panelCatalog={new MockPanelCatalog()}
              fixture={{ topics: [], datatypes: new Map(), frame: {}, layout: "Sample2!4co6n9d" }}
              omitDragAndDrop
            >
              <HelpSidebar />
            </PanelSetup>
          </MockCurrentLayoutProvider>
        </MockHelpInfoProvider>
      </DndProvider>
    </div>
  );
}

export function PanelView(): JSX.Element {
  return (
    <div style={{ margin: 30, height: 400 }}>
      <DndProvider backend={HTML5Backend}>
        <MockHelpInfoProvider>
          <MockCurrentLayoutProvider>
            <PanelSetup
              panelCatalog={new MockPanelCatalog()}
              fixture={{ topics: [], datatypes: new Map(), frame: {}, layout: "Sample2!4co6n9d" }}
              omitDragAndDrop
            >
              <HelpSidebar isHomeViewForTests={false} />
            </PanelSetup>
          </MockCurrentLayoutProvider>
        </MockHelpInfoProvider>
      </DndProvider>
    </div>
  );
}
