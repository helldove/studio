// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

// convert a ROS1 .bag file to an mcap proto file

import { program } from "commander";
import { parse } from "protobufjs";

import { Bag } from "@foxglove/rosbag";
import { FileReader } from "@foxglove/rosbag/node";

import { McapWriter, ChannelInfo, Message } from "../src";

const protoSrc = `
syntax = "proto3";

package foxglove;

// https://foxglove.dev/docs/datatypes/LocationFix
message LocationFix {
    double latitude = 1;
    double longitude = 2;
    double altitude = 3;

    repeated double covariance = 4;
}
`;

const MsgRoot = parse(protoSrc);

async function convert(filePath: string) {
  const mcapFile = new McapWriter();
  await mcapFile.open("/Users/roman/scratch/test.mcap");

  // open a new bag with a speific file reader
  const bag = new Bag(new FileReader(filePath));

  await bag.open();

  const topicToChannelInfoMap = new Map<string, ChannelInfo>();

  const navSatTopics = [];
  for (const [, connection] of bag.connections) {
    if (connection.type === "sensor_msgs/NavSatFix") {
      navSatTopics.push(connection.topic);

      const channelInfo: ChannelInfo = {
        type: "ChannelInfo",
        id: topicToChannelInfoMap.size,
        topic: "/gps",
        encoding: "protobuf",
        schemaName: "foxglove.LocationFix",
        schema: protoSrc,
        data: new ArrayBuffer(0),
      };

      topicToChannelInfoMap.set(connection.topic, channelInfo);
      await mcapFile.write(channelInfo);
    }
  }

  const LocationFix = MsgRoot.root.lookupType("foxglove.LocationFix");

  const mcapMessages: Array<Message> = [];
  await bag.readMessages({ topics: navSatTopics }, (result) => {
    const info = topicToChannelInfoMap.get(result.topic);
    if (!info) {
      return;
    }

    const rosMsg = result.message as {
      latitude: number;
      longitude: number;
      altitude: number;
      position_covariance: Float64Array;
    };
    const protoMsg = LocationFix.create({
      latitude: rosMsg.latitude,
      longitude: rosMsg.longitude,
      altitude: rosMsg.altitude,
      covariance: Array.from(rosMsg.position_covariance),
    });

    const protoMsgBuffer = LocationFix.encode(protoMsg).finish();

    const timestamp = BigInt(result.timestamp.sec) * 1000000000n + BigInt(result.timestamp.nsec);
    const msg: Message = {
      type: "Message",
      channelInfo: info,
      timestamp,
      data: protoMsgBuffer,
    };

    mcapMessages.push(msg);
  });

  for (const msg of mcapMessages) {
    await mcapFile.write(msg);
  }

  await mcapFile.end();
}

program
  .argument("<file...>", "path to .bag file(s)")
  .action(async (files: string[]) => {
    for (const file of files) {
      await convert(file).catch(console.error);
    }
  })
  .parse();
