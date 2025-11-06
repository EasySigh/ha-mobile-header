import {canProceed, getUrlPath, saveProcessed} from "./utils/helpers";
import {
  containerCache,
  headerCache,
  lovelaceHeaderOption, lovelaceContainerOption, lovelaceTabsOption, lovelaceNavOption, lovelaceNavArrowsOption,
  lovelaceTabGroupOption, lovelaceBurgerOption, lovelaceMeatballsOption
} from "./utils/elements.constants";
import {waitFor} from "./utils/observer";
import {ElOptionsModel, PagePath} from "./models/common.model";
import {
  lovelaceBurgerStyle,
  lovelaceContainerStyle,
  lovelaceHeaderStyle, lovelaceMeatballsStyle, lovelaceNavArrowsStyle,
  lovelaceNavStyle, lovelaceTabGroupStyles, lovelaceTabsStyle
} from "./utils/styles/styles.constants";
import {updateLovelace} from "./pages/lovelace.handler";

export const hambStart = () => {
  // @ts-ignore
  navigation.addEventListener("navigate", () => {
    const path = getUrlPath() as PagePath;
    if (canProceed(path)) void runForCurrentPath(path);
  });
}

async function runForCurrentPath(path: PagePath): Promise<void> {
  if (path === PagePath.lovelace) void updateLovelace(path)
  else updatePage(path);

  // todo - add custom button
}

function updatePage(path: PagePath): void {
  console.log('Update page', path);
}