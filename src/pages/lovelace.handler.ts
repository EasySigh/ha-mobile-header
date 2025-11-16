import {ElementStyleModel} from "../models/common.model";
import {
  lovelaceBurgerOption,
  lovelaceContainerOption,
  lovelaceHeaderOption,
  lovelaceMeatballsOption,
  lovelaceNavArrowsOption,
  lovelaceNavOption,
  lovelaceTabGroupOption,
  lovelaceTabsOption
} from "../utils/constants/element-options.constants";
import {waitFor} from "../utils/observer";
import {
  lovelaceBurgerStyle,
  lovelaceContainerStyle,
  lovelaceHeaderStyle,
  lovelaceMeatballsStyle,
  lovelaceNavArrowsStyle,
  lovelaceNavStyle,
  lovelaceTabGroupStyles,
  lovelaceTabsStyle
} from "../utils/styles/styles.constants";
import {isStyled, markAsStyled, saveProcessed} from "../utils/helpers";

export async function updateLovelace(): Promise<void> {
  try {
    const elementStylesList = await getStyleList();
    if (!elementStylesList?.length) return;

    // If header was already styled, save page as processed and stop process.
    const header = elementStylesList.find(el => el?.elementName === 'header')?.element;
    if (header && isStyled(header)) {
      saveProcessed();
      return;
    }

    applyStyles(elementStylesList);
    saveProcessed();
  } catch (e) {
    console.error(e);
  }
}

async function getStyleList(): Promise<ElementStyleModel[]> {
  const { container, header, tabs, nav, navArrows, tabGroup, burger, meatballs } = await getElements();

  return [
    {
      element: container,
      style: lovelaceContainerStyle,
    },
    {
      element: header,
      elementName: 'header',
      style: lovelaceHeaderStyle
    },
    {
      element: tabs,
      style: lovelaceTabsStyle
    },
    {
      element: nav,
      style: lovelaceNavStyle
    },
    {
      element: navArrows,
      style: lovelaceNavArrowsStyle
    },
    {
      element: tabGroup,
      styles: lovelaceTabGroupStyles
    },
    {
      element: burger,
      style: lovelaceBurgerStyle
    },
    {
      element: meatballs,
      style: lovelaceMeatballsStyle
    }
  ];
}

async function getElements(): Promise<{ [key: string]: Element | null }> {
  const rootElement = document?.querySelector('home-assistant')?.shadowRoot?.querySelector('home-assistant-main')?.shadowRoot || document.body;

  const container = await waitFor(lovelaceContainerOption, rootElement);
  if (!container) throw new Error("Could not find container.");

  const header = await waitFor(lovelaceHeaderOption, rootElement);
  if (!header) throw new Error("Could not find header");

  const tabs = await waitFor(lovelaceTabsOption, header, 0);
  const nav = await waitFor(lovelaceNavOption, header, 0);
  const navArrows = await waitFor(lovelaceNavArrowsOption, header, 0);
  const tabGroup = await waitFor(lovelaceTabGroupOption, header, 0);
  const burger = await waitFor(lovelaceBurgerOption, header, 0);
  const meatballs = await waitFor(lovelaceMeatballsOption, header, 0);

  return {
    container,
    header,
    tabs,
    nav,
    navArrows,
    tabGroup,
    burger,
    meatballs,
  }
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

    if (element) markAsStyled(element);
  });
}