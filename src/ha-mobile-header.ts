import {canProceed, getUrlPath} from "./utils/helpers";
import {PagePath} from "./models/common.model";
import {updateLovelace} from "./pages/lovelace.handler";
import {updatePage} from "./pages/common.handler";
import {allowedPages} from "./utils/constants/common.constants";

export const hambStart = () => {
  const path = getUrlPath() as PagePath;
  if (canProceed(path)) void runForCurrentPath(path);

  // @ts-ignore
  navigation.addEventListener("navigate", (data) => {
    if (!data) return;
    const path = new URL(data?.destination?.url)?.pathname as PagePath;
    if (canProceed(path)) void runForCurrentPath(path);
  });
}

async function runForCurrentPath(path: PagePath): Promise<void> {
  console.log('runForCurrentPath', path);

  if (path.includes(PagePath.lovelace)) void updateLovelace(path)
  else if (allowedPages.includes(path)) void updatePage(path);
}
