import { MenuBarExtra, Icon, openCommandPreferences, launchCommand, LaunchType } from "@raycast/api";
import { getItemInput, getOpenLinkApp } from "./hooks/hooks";
import React from "react";
import { ItemInput } from "./utils/input-utils";
import { OpenLinkApplication } from "./types/types";
import { actionOnApplicationItem, upBrowserRank } from "./utils/open-link-utils";

export default function OpenLinkInSpecificBrowser() {
  const { itemInput } = getItemInput(0);
  const { buildInApps, customApps, loading } = getOpenLinkApp(itemInput, 0);

  return (
    <MenuBarExtra
      isLoading={loading}
      tooltip={"Open Link in Specific Browser"}
      icon={{
        source: {
          light: "open-link-menu-bar-icon.png",
          dark: "open-link-menu-bar-icon@dark.png",
        },
      }}
    >
      {customApps.length !== 0 && (
        <MenuBarExtra.Section title="Favorites">
          {customApps.map((browser) => (
            <OpenLinkAppMenuBarItem
              key={browser.path}
              openLinkApplication={browser}
              openLinkApplications={customApps}
              itemInput={itemInput}
              isCustom={true}
            />
          ))}
        </MenuBarExtra.Section>
      )}
      {buildInApps.length !== 0 && (
        <MenuBarExtra.Section title="Recommended">
          {buildInApps.map((browser) => (
            <OpenLinkAppMenuBarItem
              key={browser.path}
              openLinkApplication={browser}
              openLinkApplications={customApps}
              itemInput={itemInput}
              isCustom={false}
            />
          ))}
        </MenuBarExtra.Section>
      )}
      <MenuBarExtra.Section>
        <MenuBarExtra.Item
          title={"Add Favorite App"}
          icon={Icon.Star}
          onAction={() => {
            launchCommand({
              name: "open-link-in-specific-browser",
              type: LaunchType.UserInitiated,
              context: { foo: "bar" },
            }).then();
          }}
          shortcut={{ modifiers: ["cmd"], key: "s" }}
        />
      </MenuBarExtra.Section>
      <MenuBarExtra.Section>
        <MenuBarExtra.Item
          title={"Preferences"}
          icon={Icon.Gear}
          onAction={() => {
            openCommandPreferences().then();
          }}
          shortcut={{ modifiers: ["cmd"], key: "," }}
        />
      </MenuBarExtra.Section>
    </MenuBarExtra>
  );
}

function OpenLinkAppMenuBarItem(props: {
  openLinkApplication: OpenLinkApplication;
  openLinkApplications: OpenLinkApplication[];
  itemInput: ItemInput;
  isCustom: boolean;
}) {
  const { openLinkApplication, openLinkApplications, itemInput, isCustom } = props;
  return (
    <MenuBarExtra.Item
      title={openLinkApplication.name}
      icon={{ fileIcon: openLinkApplication.path }}
      onAction={async () => {
        isCustom && (await upBrowserRank(itemInput, openLinkApplication, openLinkApplications));
        await actionOnApplicationItem(itemInput, openLinkApplication, () => null);
      }}
    />
  );
}
