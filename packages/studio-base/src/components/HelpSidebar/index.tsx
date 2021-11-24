// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { Stack, useTheme, Text, Link, ITheme, ITextStyles, ILinkStyles } from "@fluentui/react";
import ChevronLeftIcon from "@mdi/svg/svg/chevron-left.svg";
import { useMemo, useState, useEffect } from "react";
import { useUnmount } from "react-use";

import Icon from "@foxglove/studio-base/components/Icon";
import KeyboardShortcutHelp from "@foxglove/studio-base/components/KeyboardShortcut.help.md";
import MesssagePathSyntaxHelp from "@foxglove/studio-base/components/MessagePathSyntax/index.help.md";
import { SidebarContent } from "@foxglove/studio-base/components/SidebarContent";
import TextContent from "@foxglove/studio-base/components/TextContent";
import { useSelectedPanels } from "@foxglove/studio-base/context/CurrentLayoutContext";
import { PanelInfo, usePanelCatalog } from "@foxglove/studio-base/context/PanelCatalogContext";
import isDesktopApp from "@foxglove/studio-base/util/isDesktopApp";

const appLinks = [
  { title: "Message path syntax", content: MesssagePathSyntaxHelp },
  { title: "Keyboard shortcuts", content: KeyboardShortcutHelp },
];

const resourceLinks = [
  ...(isDesktopApp() ? [] : [{ title: "Desktop app", url: "https://foxglove.dev/download" }]),
  { title: "Read docs", url: "https://foxglove.dev/docs" },
  { title: "Join our community", url: "https://foxglove.dev/community" },
];

const productLinks = [
  { title: "Foxglove Studio", url: "https://foxglove.dev/studio" },
  { title: "Foxglove Data Platform", url: "https://foxglove.dev/data-platform" },
];

const legalLinks = [
  { title: "License", url: "https://foxglove.dev/legal/studio-license" },
  { title: "Privacy", url: "https://foxglove.dev/legal/privacy" },
];

const useComponentStyles = (theme: ITheme) =>
  useMemo(
    () => ({
      subheader: {
        root: {
          ...theme.fonts.xSmall,
          display: "block",
          textTransform: "uppercase",
          color: theme.palette.neutralSecondaryAlt,
          letterSpacing: "0.025em",
        },
      } as Partial<ITextStyles>,
      link: {
        root: {
          ...theme.fonts.smallPlus,
          fontSize: 13,
        } as Partial<ILinkStyles>,
      },
    }),
    [theme],
  );

export default function HelpSidebar({
  isHomeViewForTests,
  panelTypeForTests = "",
}: React.PropsWithChildren<{
  isHomeViewForTests?: boolean;
  panelTypeForTests?: string;
}>): JSX.Element {
  const theme = useTheme();
  const styles = useComponentStyles(theme);
  const [isHomeView, setIsHomeView] = useState(
    isHomeViewForTests == undefined ? true : isHomeViewForTests,
  );
  const [helpInfo, setHelpInfo] = useState({ title: "", content: "" });
  const { panelDocToDisplay: panelType, setPanelDocToDisplay } = useSelectedPanels();

  const panelCatalog = usePanelCatalog();
  const panelInfo = useMemo(
    () =>
      (panelType ? panelType : panelTypeForTests) != undefined
        ? panelCatalog.getPanelByType(panelType ? panelType : panelTypeForTests)
        : undefined,
    [panelCatalog, panelType, panelTypeForTests],
  );
  const sortByTitle = (a: PanelInfo, b: PanelInfo) =>
    a.title.localeCompare(b.title, undefined, { ignorePunctuation: true, sensitivity: "base" });
  const panels = panelCatalog.getPanels();
  const sortedPanels = [...panels].sort(sortByTitle);

  const displayedTitle = useMemo(() => {
    if (isHomeView) {
      return "Help";
    }
    if (panelInfo?.title) {
      return panelInfo.title;
    }

    return helpInfo.title;
  }, [isHomeView, helpInfo.title, panelInfo?.title]);

  useEffect(() => setIsHomeView(!panelInfo), [setIsHomeView, panelInfo]);

  useUnmount(() => {
    // Automatically deselect the panel we were looking at help content for when the help sidebar closes
    if (panelType != undefined) {
      setPanelDocToDisplay("");
    }
  });

  return (
    <SidebarContent
      leadingItems={
        isHomeView
          ? undefined
          : [
              <Icon
                key="back-arrow"
                size="small"
                style={{ marginRight: "5px" }}
                onClick={() => {
                  setIsHomeView(true);
                  setHelpInfo({ title: "", content: "" });
                  setPanelDocToDisplay("");
                }}
              >
                <ChevronLeftIcon />
              </Icon>,
            ]
      }
      title={displayedTitle}
    >
      <Stack>
        {isHomeView ? (
          <Stack tokens={{ childrenGap: theme.spacing.m }}>
            <Stack.Item>
              <Text styles={styles.subheader}>App</Text>
              <Stack tokens={{ padding: `${theme.spacing.m} 0`, childrenGap: theme.spacing.s1 }}>
                {appLinks.map(({ title, content }) => (
                  <Link
                    key={title}
                    style={{ color: theme.semanticColors.bodyText }}
                    onClick={() => {
                      setIsHomeView(false);
                      setHelpInfo({ title, content });
                    }}
                    styles={styles.link}
                  >
                    {title}
                  </Link>
                ))}
              </Stack>
            </Stack.Item>
            <Stack.Item>
              <Text styles={styles.subheader}>Panels</Text>
              <Stack tokens={{ padding: `${theme.spacing.m} 0`, childrenGap: theme.spacing.s1 }}>
                {sortedPanels.map(({ title, type }) => (
                  <Link
                    key={title}
                    style={{ color: theme.semanticColors.bodyText }}
                    onClick={() => setPanelDocToDisplay(type)}
                    styles={styles.link}
                  >
                    {title}
                  </Link>
                ))}
              </Stack>
            </Stack.Item>

            <Stack.Item>
              <Text styles={styles.subheader}>External Resources</Text>
              <Stack tokens={{ padding: `${theme.spacing.m} 0`, childrenGap: theme.spacing.s1 }}>
                {resourceLinks.map(({ title, url }) => (
                  <Link
                    key={title}
                    style={{ color: theme.semanticColors.bodyText }}
                    href={url}
                    styles={styles.link}
                  >
                    {title}
                  </Link>
                ))}
              </Stack>
            </Stack.Item>

            <Stack.Item>
              <Text styles={styles.subheader}>Products</Text>
              <Stack tokens={{ padding: `${theme.spacing.m} 0`, childrenGap: theme.spacing.s1 }}>
                {productLinks.map(({ title, url }) => (
                  <Link
                    key={title}
                    style={{ color: theme.semanticColors.bodyText }}
                    href={url}
                    styles={styles.link}
                  >
                    {title}
                  </Link>
                ))}
              </Stack>
            </Stack.Item>

            <Stack.Item>
              <Text styles={styles.subheader}>Legal</Text>
              <Stack tokens={{ padding: `${theme.spacing.m} 0`, childrenGap: theme.spacing.s1 }}>
                {legalLinks.map(({ title, url }) => (
                  <Link
                    key={title}
                    style={{ color: theme.semanticColors.bodyText }}
                    href={url}
                    styles={styles.link}
                  >
                    {title}
                  </Link>
                ))}
              </Stack>
            </Stack.Item>
          </Stack>
        ) : (
          <Stack tokens={{ childrenGap: theme.spacing.s2 }}>
            {helpInfo.content ? (
              <TextContent allowMarkdownHtml={true}>{helpInfo.content}</TextContent>
            ) : panelInfo?.help != undefined ? (
              <TextContent allowMarkdownHtml={true}>{panelInfo?.help}</TextContent>
            ) : (
              "Panel does not have any documentation details."
            )}
          </Stack>
        )}
      </Stack>
    </SidebarContent>
  );
}
