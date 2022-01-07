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

import { PointCloud2 } from "@foxglove/studio-base/types/Messages";

// ts-prune-ignore-next
export const POINT_CLOUD_MESSAGE: PointCloud2 = {
  fields: [
    {
      name: "x",
      offset: 0,
      datatype: 7,
      count: 1,
    },
    {
      name: "y",
      offset: 4,
      datatype: 7,
      count: 1,
    },
    {
      name: "z",
      offset: 8,
      datatype: 7,
      count: 1,
    },
    {
      name: "rgb",
      offset: 16,
      datatype: 7,
      count: 1,
    },
  ],
  type: 102,
  pose: {
    position: { x: 0, y: 0, z: 0 },
    orientation: { x: 0, y: 0, z: 0, w: 0 },
  },
  header: {
    seq: 0,
    frame_id: "root_frame_id",
    stamp: {
      sec: 10,
      nsec: 10,
    },
  },
  height: 1,
  is_bigendian: false,
  is_dense: 1,
  point_step: 32,
  row_step: 32,
  width: 2,
  data: new Uint8Array([
    // point 1
    // x
    125, 236, 11, 197,
    // y
    118, 102, 48, 196,
    // z
    50, 194, 23, 192,
    // ?
    0, 0, 128, 63,
    // rgb (abgr ordering)
    0, 255, 225, 127,
    // ?
    254, 127, 0, 0, 16, 142, 140, 0, 161, 254, 127, 0,
    // point 2
    // x
    125, 236, 11, 197,
    // y
    118, 102, 48, 196,
    // z
    50, 194, 23, 192,
    // ?
    0, 0, 128, 63,
    // rgb (abgr ordering)
    0, 255, 255, 127,
    // ?
    254, 127, 0, 0, 16, 142, 140, 0, 161, 254, 127, 0,
    // point 3
    // x
    118, 102, 48, 196,
    // y
    125, 236, 11, 197,
    // z
    50, 194, 23, 192,
    // ?
    0, 0, 128, 63,
    // rgb (abgr ordering)
    0, 127, 255, 127,
    // ?
    254, 127, 0, 0, 16, 142, 140, 0, 161, 254, 127, 8,
  ]),
};

// ts-prune-ignore-next
export const POINT_CLOUD_WITH_ADDITIONAL_FIELDS: PointCloud2 = {
  fields: [
    {
      name: "x",
      offset: 0,
      datatype: 7,
      count: 1,
    },
    {
      name: "y",
      offset: 4,
      datatype: 7,
      count: 1,
    },
    {
      name: "z",
      offset: 8,
      datatype: 7,
      count: 1,
    },
    {
      name: "foo",
      offset: 12,
      datatype: 2,
      count: 1,
    },
    {
      name: "bar",
      offset: 13,
      datatype: 4,
      count: 1,
    },
    {
      name: "baz",
      offset: 15,
      datatype: 5,
      count: 1,
    },
    {
      name: "foo16_some_really_really_long_name",
      offset: 19,
      datatype: 3,
      count: 1,
    },
  ],
  type: 102,
  pose: {
    position: { x: 0, y: 0, z: 0 },
    orientation: { x: 0, y: 0, z: 0, w: 0 },
  },
  header: {
    seq: 0,
    frame_id: "root_frame_id",
    stamp: {
      sec: 10,
      nsec: 10,
    },
  },
  height: 1,
  is_bigendian: false,
  is_dense: 1,
  point_step: 21,
  row_step: 21,
  width: 2,
  data: new Uint8Array([
    0, //   1, start of point 1
    0, //   2
    0, //   3
    0, //   4, x: float32 = 0
    0, //   5
    0, //   6
    128, // 7
    63, //  8, y: float32 = 1
    0, //   9
    0, //   10
    0, //   11
    64, //  12, z: float32 =  2
    7, //   13, foo: uint8 = 7
    6, //   14
    0, //   15, bar: uint16 = 6
    5, //   16
    0, //   17
    0, //   18
    0, //   19, baz: int32 = 5
    9, //   20
    1, //   21, foo16: int16 = 265
    // ---------- another row
    0, //   22, start of point 2
    0, //   23
    0, //   24
    0, //   25 x: float32 = 0
    0, //   26
    0, //   27
    128, // 28
    63, //  29 y: float32 = 1
    0, //   30
    0, //   31
    0, //   32
    64, //  33, z: float32 =  2
    9, //   34, foo: uint8 = 9
    8, //   35
    0, //   36, bar: uint16 = 8
    7, //   37
    0, //   38
    0, //   39
    0, //   40, baz: int32 = 7
    2, //   41
    0, //   42, foo16: int16 = 2
  ]),
};
