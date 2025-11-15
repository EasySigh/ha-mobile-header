import {PagePath} from "../models/common.model";
import {getCachedElement} from "../utils/helpers";
import {
  burgerButton,
  containerCache,
  containerOptions,
  lovelaceButton,
  menuButton
} from "../utils/constants/element-options.constants";
import {waitFor} from "../utils/observer";
import {mhWidget} from "../utils/constants/custom-elements.constants";

interface PageElements {
  container: Element;
  burger: HTMLElement | null;
  lovelaceMenuItem: HTMLElement | null;
}

export async function updatePage(path: PagePath): Promise<void> {
  try {
    const { container, burger, lovelaceMenuItem } = await getElements(path);

    // const mhWidgetElement = container.querySelector('#mh-widget');
    // if (!!mhWidgetElement) {
    //   console.log('Widget already added');
    //   mhWidgetElement.remove();
    //   console.log('after remove()', mhWidgetElement)
    // }

    container.insertAdjacentHTML('beforeend', mhWidget);

    const mhBurger = container.querySelector('#mhBurger');
    mhBurger?.addEventListener('click', () => burger?.click());

    const mhQuickLink = container.querySelector('#mhQuickLink');
    mhQuickLink?.addEventListener('click', () => lovelaceMenuItem?.click());
  } catch (e) {
    console.error(e);
  }
}

async function getElements(pagePath: PagePath): Promise<PageElements> {
  const rootElement = document?.querySelector('home-assistant')?.shadowRoot?.querySelector('home-assistant-main')?.shadowRoot || document.body;
  const sidebarElement = rootElement?.querySelector("ha-sidebar")?.shadowRoot?.querySelector("ha-md-list.ha-scrollbar > ha-md-list-item:nth-child(1)")?.shadowRoot;

  const container = await getCachedElement(containerCache, rootElement, pagePath, containerOptions);
  if (!container) throw new Error("Could not find container.");

  const burger = await waitFor(burgerButton, rootElement, 0) as HTMLElement | null;

  if (!sidebarElement) throw new Error("Could not find sidebar.");
  const lovelaceMenuItem = await waitFor(lovelaceButton, sidebarElement, 0) as HTMLElement | null;

  return { container, burger, lovelaceMenuItem };
}