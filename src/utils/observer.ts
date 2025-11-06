import {ElOptionsModel} from "../models/common.model";
import {domTraverser} from "./dom-traverser";
import {getUrlPath} from "./helpers";

export function waitFor(options: ElOptionsModel[], root?: Node | ShadowRoot, timeoutMs = 5000): Promise<Element | null> {
  return new Promise((resolve) => {
    // 1) мгновенная попытка
    const immediate = domTraverser(options, root);
    if (immediate) return resolve(immediate);

    const sourceUrl = getUrlPath();
    let done = false;

    const finish = (el: Element | null) => {
      if (done) return;

      done = true;
      mo.disconnect();
      clearTimeout(tid);
      resolve(el);
    };

    // 2) наблюдаем за изменениями корня
    const mo = new MutationObserver(() => {
      if (sourceUrl !== getUrlPath()) finish(null);

      const found = domTraverser(options, root);
      if (found) finish(found);
    });

    mo.observe(document.documentElement, { childList: true, subtree: true });

    // 3) таймаут
    const tid = setTimeout(() => finish(null), timeoutMs);
  });
}