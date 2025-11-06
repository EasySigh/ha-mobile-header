import { ElOptionsModel } from "../models/common.model";

// Cached elements
export const containerCache = new Map<string, WeakRef<Element>>();
export const headerCache = new Map<string, WeakRef<Element>>();

// Element Options

// Lovelace (dashboard) elements options
export const lovelaceContainerOption: ElOptionsModel[] = [{ tagName: 'hui-view-container', id: '#view' }];
export const lovelaceHeaderOption: ElOptionsModel[] = [{ tagName: 'div', classNames: ['header'] }];
export const lovelaceTabsOption: ElOptionsModel[] = [{ tagName: '', classNames: ['tabs'] }];
export const lovelaceNavOption: ElOptionsModel[] = [{ tagName: '', classNames: ['nav'] }];
export const lovelaceNavArrowsOption: ElOptionsModel[] = [{ tagName: 'wa-button', classNames: ['scroll-button'] }];
export const lovelaceTabGroupOption: ElOptionsModel[] = [{ tagName: 'ha-tab-group', classNames: [''] }];
export const lovelaceBurgerOption: ElOptionsModel[] = [{ tagName: 'ha-menu-button', classNames: [''] }];
export const lovelaceMeatballsOption: ElOptionsModel[] = [{ tagName: 'ha-button-menu', classNames: [''] }];

// Other pages elements options
export const pageContainersOptions: ElOptionsModel[] = [
  { classNames: ['mdc-top-app-bar--fixed-adjust'] }
];
// export const pageHeaderOptions: ElOptionsModel[] = [
//   { tagName: 'header', classNames: ['mdc-top-app-bar'] }
// ];
