import {ElementStyleModel, PagePath} from "../models/common.model";
import {
  containerCache,
  headerCache, lovelaceBurgerOption,
  lovelaceContainerOption,
  lovelaceHeaderOption, lovelaceMeatballsOption, lovelaceNavArrowsOption, lovelaceNavOption, lovelaceTabGroupOption,
  lovelaceTabsOption
} from "../utils/elements.constants";
import {waitFor} from "../utils/observer";
import {
  lovelaceBurgerStyle,
  lovelaceContainerStyle,
  lovelaceHeaderStyle, lovelaceMeatballsStyle, lovelaceNavArrowsStyle,
  lovelaceNavStyle, lovelaceTabGroupStyles, lovelaceTabsStyle
} from "../utils/styles/styles.constants";
import {getElement, saveProcessed} from "../utils/helpers";

export async function updateLovelace(pagePath: PagePath): Promise<void> {
  try {
    const elementStylesList = await getStyleList(pagePath);
    if (!elementStylesList) return;

    applyStyles(elementStylesList);
    saveProcessed();
  } catch (e) {
    console.error(e);
  }
}

async function getStyleList(pagePath: PagePath): Promise<ElementStyleModel[]> {
  const rootElement = document?.querySelector('home-assistant')?.shadowRoot?.querySelector('home-assistant-main')?.shadowRoot || document.body;

  const container = await getElement(containerCache, rootElement, pagePath, lovelaceContainerOption);
  if (!container) throw new Error("Could not find container.");

  const header = await getElement(headerCache, container, pagePath, lovelaceHeaderOption);
  if (!header) throw new Error("Could not find header");

  const tabs = await waitFor(lovelaceTabsOption, container);
  const nav = await waitFor(lovelaceNavOption, container);
  const navContainer = await waitFor(lovelaceNavArrowsOption, container);
  const tabGroup = await waitFor(lovelaceTabGroupOption, container);
  const burger = await waitFor(lovelaceBurgerOption, container);
  const meatballs = await waitFor(lovelaceMeatballsOption, container);

  return [
    {
      element: container,
      style: lovelaceContainerStyle,
    },
    {
      element: header,
      style: lovelaceHeaderStyle
    },
    {
      element: tabs,
      style: lovelaceNavStyle
    },
    {
      element: nav,
      style: lovelaceBurgerStyle
    },
    {
      element: navContainer,
      style: lovelaceMeatballsStyle
    },
    {
      element: tabGroup,
      style: lovelaceTabsStyle
    },
    {
      element: burger,
      style: lovelaceNavArrowsStyle
    },
    {
      element: meatballs,
      styles: lovelaceTabGroupStyles
    }
  ];
}

function applyStyles(elList: ElementStyleModel[]): void {
  elList.forEach(({ element, styles, style: customStyle }) => {
    if (element && styles) {
      const elStyle = document.createElement('style');
      elStyle.textContent = styles;
      element.appendChild(elStyle);
    }

    if (element && customStyle) Object.entries(customStyle)
      .forEach(([key, value]) => (element as HTMLElement).style[(key as any)] = value);
  });
}