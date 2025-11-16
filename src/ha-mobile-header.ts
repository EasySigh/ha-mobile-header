import {formatPath, getUrlPath, isLovelaceProcessed} from "./utils/helpers";
import {updateLovelace} from "./pages/lovelace.handler";
import {updatePage} from "./pages/common.handler";
import {allowedPages} from "./utils/constants/paths.constants";

let lastPath = '';

export const hambStart = () => {
  const path = getUrlPath();
  void runForCurrentPath(path);

  // @ts-ignore
  navigation.addEventListener("navigate", (data) => {
    if (!data) return;

    const path = formatPath(new URL(data?.destination?.url)?.pathname);
    if (path === lastPath) return;
    lastPath = path;
    void runForCurrentPath(path);
  });
}

async function runForCurrentPath(path: string): Promise<void> {
  const oldMHWidget = document.body.querySelector('#mhWidget');
  if (!!oldMHWidget) oldMHWidget.remove();

  if (path.includes('lovelace') && !isLovelaceProcessed) void updateLovelace()
  else if (allowedPages.includes(path)) void updatePage(path);
}
