// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { PaletteOptions } from "@mui/material/styles";

type CustomPaletteOptions = {
  name: string;
};

export const dark: PaletteOptions & CustomPaletteOptions = {
  name: "dark",
  mode: "dark",
  primary: { main: "#6f3be8" },
  secondary: { main: "#8B67E9" },
  background: {
    default: "#121212",
    paper: "#1E1E1E",
  },
  grey: {
    50: "#121212",
    100: "#1E1E1E",
    200: "#222222",
    300: "#272727",
    400: "#2C2C2C",
    500: "#2E2E2E",
    600: "#333333",
    700: "#353535",
    800: "#383838",
    900: "#454545",
    A100: "#616161",
    A200: "#303030",
    A400: "#aaaaaa",
    A700: "#d5d5d5",
  },
};

export const light: PaletteOptions & CustomPaletteOptions = {
  name: "light",
  mode: "light",
  primary: { main: "#6f3be8" },
  secondary: { main: "#8b65e4" },
  text: {
    primary: "#393939",
    secondary: "#39393999",
  },
  grey: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#eeeeee",
    300: "#e0e0e0",
    400: "#bdbdbd",
    500: "#9e9e9e",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
    A100: "#d5d5d5",
    A200: "#aaaaaa",
    A400: "#303030",
    A700: "#616161",
  },
};
