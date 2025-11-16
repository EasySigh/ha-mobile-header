import {Nullable} from "../models/common.model";

export const getUrlPath = () => formatPath(location.pathname);
export let isLovelaceProcessed: boolean = false;
export const saveProcessed = () => isLovelaceProcessed = true;

export const isMobile = () => navigator?.userAgentData?.mobile || window.matchMedia('(max-width: 767px)').matches;
export const markAsStyled = (element: HTMLElement | Element) => element.setAttribute('mh-styled', 'true');
export const isStyled = (element: HTMLElement | Element) => element.getAttribute('mh-styled') !== null;

export function formatPath(path: string): string {
  if (!path) return '';
  return path.replace(/^\/|\/$/g, "");
}

export function getBurgerVariants(): Nullable<HTMLElement>[] {
  return [
    document?.querySelector("body > home-assistant")?.shadowRoot?.querySelector("home-assistant-main")?.shadowRoot?.querySelector("ha-drawer > partial-panel-resolver > ha-panel-config > ha-config-dashboard")?.shadowRoot?.querySelector("ha-top-app-bar-fixed > ha-menu-button")?.shadowRoot?.querySelector("ha-icon-button")?.shadowRoot?.querySelector("mwc-icon-button")?.shadowRoot?.querySelector("button"),
    document?.querySelector("body > home-assistant")?.shadowRoot?.querySelector("home-assistant-main")?.shadowRoot?.querySelector("ha-drawer > partial-panel-resolver > ha-panel-todo")?.shadowRoot?.querySelector("ha-two-pane-top-app-bar-fixed > ha-menu-button")?.shadowRoot?.querySelector("ha-icon-button")?.shadowRoot?.querySelector("mwc-icon-button")?.shadowRoot?.querySelector("button"),
    document?.querySelector("body > home-assistant")?.shadowRoot?.querySelector("home-assistant-main")?.shadowRoot?.querySelector("ha-drawer > partial-panel-resolver > ha-panel-developer-tools")?.shadowRoot?.querySelector("div > div > ha-menu-button")?.shadowRoot?.querySelector("ha-icon-button")?.shadowRoot?.querySelector("mwc-icon-button")?.shadowRoot?.querySelector("button"),
    document?.querySelector("body > home-assistant")?.shadowRoot?.querySelector("home-assistant-main")?.shadowRoot?.querySelector("ha-drawer > partial-panel-resolver > ha-panel-energy")?.shadowRoot?.querySelector("div > div > ha-menu-button")?.shadowRoot?.querySelector("ha-icon-button")?.shadowRoot?.querySelector("mwc-icon-button")?.shadowRoot?.querySelector("button"),
  ]
}