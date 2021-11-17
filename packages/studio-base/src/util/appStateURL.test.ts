// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { toRFC3339String } from "@foxglove/rostime";
import { LayoutID } from "@foxglove/studio-base/index";
import { PlayerURLState } from "@foxglove/studio-base/players/types";
import { encodeAppURLState, parseAppURLState } from "@foxglove/studio-base/util/appStateURL";
import isDesktopApp from "@foxglove/studio-base/util/isDesktopApp";

jest.mock("@foxglove/studio-base/util/isDesktopApp", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockIsDesktop = isDesktopApp as jest.MockedFunction<typeof isDesktopApp>;

function runCommonTests(urlBuilder: () => URL) {
  it("rejects non data state urls", () => {
    expect(parseAppURLState(urlBuilder())).toBeInstanceOf(Error);
  });

  it("parses rosbag data state urls", () => {
    const url = urlBuilder();
    url.searchParams.append("type", "rosbag");
    url.searchParams.append("url", "http://example.com");

    expect(parseAppURLState(url)).toMatchObject({
      type: "rosbag",
      url: "http://example.com",
    });
  });

  it("rejects incomplete state urls", () => {
    const url = urlBuilder();
    url.searchParams.append("type", "foxglove-data-platform");
    url.searchParams.append("start", toRFC3339String({ sec: new Date().getTime(), nsec: 0 }));

    expect(parseAppURLState(url)).toBeInstanceOf(Error);
  });

  it("parses data platform state urls", () => {
    const url = urlBuilder();
    url.searchParams.append("type", "foxglove-data-platform");
    url.searchParams.append("start", toRFC3339String({ sec: new Date().getTime(), nsec: 0 }));
    url.searchParams.append("end", toRFC3339String({ sec: new Date().getTime() + 1000, nsec: 0 }));
    url.searchParams.append("deviceId", "dummy");
    url.searchParams.append("layoutId", "1234");

    expect(parseAppURLState(url)).toMatchObject({
      layoutId: "1234",
      type: "foxglove-data-platform",
    });
  });
}

describe("app state url parser", () => {
  describe("desktop urls", () => {
    beforeEach(() => mockIsDesktop.mockReturnValue(true));

    // Note that this URL is different from actual foxglove URLs because Node's URL parser
    // interprets foxglove:// URLs differently than the browser does.
    runCommonTests(() => new URL("foxglove://host/open"));
  });

  describe("web urls", () => {
    beforeEach(() => mockIsDesktop.mockReturnValue(false));

    runCommonTests(() => new URL("https://studio.foxglove.dev/"));
  });
});

describe("app state encoding", () => {
  const baseURL = () => new URL("http://example.com");

  it("encodes rosbag urls", () => {
    expect(
      encodeAppURLState(baseURL(), {
        layoutId: "123" as LayoutID,
        type: "rosbag",
        url: "http://foxglove.dev/test.bag",
      }).href,
    ).toEqual(
      "http://example.com/?layoutId=123&type=rosbag&url=http%3A%2F%2Ffoxglove.dev%2Ftest.bag",
    );
  });

  it("encodes url based states", () => {
    const states: PlayerURLState[] = [
      { type: "ros1", url: "http://example.com:11311/test.bag" },
      { type: "ros2", url: "http://example.com:11311/test.bag" },
      { type: "rosbag", url: "http://example.com/test.bag" },
      { type: "rosbridge", url: "ws://foxglove.dev:9090/test.bag" },
    ];
    states.forEach((state) => {
      const url = "url" in state ? state.url : "";
      expect(encodeAppURLState(baseURL(), { layoutId: "123" as LayoutID, ...state }).href).toEqual(
        `http://example.com/?layoutId=123&type=${state.type}&url=${encodeURIComponent(url)}`,
      );
    });
  });
});
