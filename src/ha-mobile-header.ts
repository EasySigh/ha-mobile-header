import {getUrlPath, isLovelaceProcessed} from "./utils/helpers";
import {updateLovelace} from "./pages/lovelace.handler";
import {updatePage} from "./pages/common.handler";
import {allowedPages} from "./utils/constants/paths.constants";

export const hambStart = () => {
  const path = getUrlPath();
  void runForCurrentPath(path);

  // @ts-ignore
  window.addEventListener("popstate", () => {
    // const path = formatPath(new URL(data?.destination?.url)?.pathname);
    const path = getUrlPath();
    void runForCurrentPath(path);
  });
}

async function runForCurrentPath(path: string): Promise<void> {
  const oldMHWidget = document.body.querySelector('#mhWidget');
  if (!!oldMHWidget) oldMHWidget.remove();

  if (path.includes('lovelace') && !isLovelaceProcessed) void updateLovelace()
  else if (allowedPages.includes(path)) void updatePage(path);
}
