// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import {
  IDataSourceFactory,
  DataSourceFactoryInitializeArgs,
} from "@foxglove/studio-base/context/PlayerSelectionContext";
import { PromptOptions } from "@foxglove/studio-base/hooks/usePrompt";
import RosbridgePlayer from "@foxglove/studio-base/players/RosbridgePlayer";
import { Player } from "@foxglove/studio-base/players/types";
import { parseInputUrl } from "@foxglove/studio-base/util/url";

class RosbridgeDataSourceFactory implements IDataSourceFactory {
  id = "rosbridge-websocket";
  displayName = "Rosbridge (ROS 1 & 2)";
  iconName: IDataSourceFactory["iconName"] = "Flow";

  promptOptions(previousValue?: string): PromptOptions {
    return {
      title: "Rosbridge connection",
      placeholder: "ws://localhost:9090",
      initialValue: previousValue ?? "ws://localhost:9090",
      transformer: (str) => {
        const result = parseInputUrl(str, "http:", {
          "http:": { protocol: "ws:", port: 9090 },
          "https:": { protocol: "wss:", port: 9090 },
          "ws:": { port: 9090 },
          "wss:": { port: 9090 },
          "ros:": { protocol: "ws:", port: 9090 },
        });
        if (result == undefined) {
          throw new Error("Invalid rosbridge WebSocket URL. Use the ws:// or wss:// protocol.");
        }
        return result;
      },
    };
  }

  initialize(args: DataSourceFactoryInitializeArgs): Player | undefined {
    const url = args.url;
    if (!url) {
      return;
    }

    return new RosbridgePlayer({
      url,
      metricsCollector: args.metricsCollector,
    });
  }
}

export default RosbridgeDataSourceFactory;
