import {ElOptionsModel, Nullable} from "../models/common.model";
import {domTraverser} from "./dom-traverser";

export function waitFor(options: ElOptionsModel[], root?: Node | ShadowRoot, timeoutMs = 5000): Promise<HTMLElement | null> {
  return new Promise((resolve) => {
    // 1) immediate attempt
    const immediate = domTraverser(options, root);
    if (immediate) return resolve(immediate as HTMLElement);

    let done = false;

    const finish = (el: HTMLElement | null) => {
      if (done) return;

      done = true;
      mo.disconnect();
      clearTimeout(tid);
      resolve(el);
    };

    // 2) tracking DOM changes
    const mo = new MutationObserver(() => {
      const found = domTraverser(options, root);
      if (found) finish(found);
    });

    mo.observe(document.documentElement, { childList: true, subtree: true });

    // 3) timeout
    const tid = setTimeout(() => finish(null), timeoutMs);
  });
}

export function waitForElement(variantsFn: () => Nullable<HTMLElement>[], timeoutMs = 3000): Promise<Nullable<HTMLElement>> {
  return new Promise((resolve) => {
    console.log('-------------------');
    console.log('Variants:');
    console.log(variantsFn().filter(Boolean));
    console.log('-------------------');
    const immediate: Nullable<HTMLElement> = variantsFn().filter(Boolean)[0];
    if (immediate) return resolve(immediate);

    let done = false;

    const finish = (el: Nullable<HTMLElement>) => {
      if (done) return;

      done = true;
      clearInterval(intervalId);
      clearTimeout(tid);
      resolve(el);
    };

    const intervalId = setInterval(() => {
      const found = variantsFn().filter(Boolean)[0];
      if (found) finish(found);
    }, 100);

    const tid = setTimeout(() => finish(null), timeoutMs);
  });
}