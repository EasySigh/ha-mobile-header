import {ElOptionsModel, PagePath} from "../models/common.model";
import {waitFor} from "./observer";

export const getUrlPath = () => location.pathname;

export const processedList = new Set<string>([]);
export const saveProcessed = () => processedList.add(getUrlPath());
export const isProcessed = () => processedList.has(getUrlPath());

export const isMobile = () => navigator?.userAgentData?.mobile || window.matchMedia('(max-width: 767px)').matches;
export const canProceed = (path: string) => localStorage.getItem('mh-allowed-pages')?.includes(path) && !isProcessed;


export async function getElement(
  elementCache: Map<string, WeakRef<Element>>,
  rootElement: ShadowRoot | Element,
  pagePath: PagePath,
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