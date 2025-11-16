import {ElOptionsModel} from "../models/common.model";
import {waitFor} from "./observer";

export const getUrlPath = () => formatPath(location.pathname);
export let isLovelaceProcessed: boolean = false;
export const saveProcessed = () => isLovelaceProcessed = true;
// export const processedList = new Set<string>([]);
// export const saveProcessed = () => processedList.add(getUrlPath());
// export const isProcessed = (path?: string) => processedList.has(path || getUrlPath());

export const isMobile = () => navigator?.userAgentData?.mobile || window.matchMedia('(max-width: 767px)').matches;
// export const canProceed = (path: string) => !isProcessed(path);
// export const canProceed = (path: string) => !isProcessed(path);
// export const canProceed = (path: string) => !localStorage.getItem('mh-excluded-pages')?.includes(path) && !isProcessed();
export const markAsStyled = (element: HTMLElement | Element) => element.setAttribute('mh-styled', 'true');
export const isStyled = (element: HTMLElement | Element) => element.getAttribute('mh-styled') !== null;

export async function getCachedElement(
  elementCache: Map<string, WeakRef<Element>>,
  rootElement: ShadowRoot | Element,
  pagePath: string,
  elementOptions: ElOptionsModel[]
): Promise<Element | null> {
  const cachedElement = elementCache.get(pagePath)?.deref();
  const element = cachedElement ?? (await waitFor(elementOptions, rootElement));

  if (!element) logError(`Cannot find element for path, ${pagePath}`);
  if (element) elementCache.set(pagePath, new WeakRef(element));

  return element;
}

export function logError(error: string): void {
  console.error('[HA Mobile header] Script execution has been stopped.');
  console.info(`[HA Mobile header] ${error}`);
}

export function formatPath(path: string): string {
  if (!path) return '';
  return path.replace(/^\/|\/$/g, "");
}