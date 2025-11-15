import { ElOptionsModel } from "../../models/common.model";

// Cached elements
export const containerCache = new Map<string, WeakRef<Element>>();
export const headerCache = new Map<string, WeakRef<Element>>();

// Lovelace (dashboard) elements options
export const lovelaceContainerOption: ElOptionsModel[] = [{ tagName: 'hui-view-container', id: 'view' }];
export const lovelaceHeaderOption: ElOptionsModel[] = [{ tagName: 'div', className: 'header' }];
export const lovelaceTabsOption: ElOptionsModel[] = [{ tagName: '', className: 'tabs' }];
export const lovelaceNavOption: ElOptionsModel[] = [{ tagName: '', className: 'nav' }];
export const lovelaceNavArrowsOption: ElOptionsModel[] = [{ tagName: 'wa-button', className: 'scroll-button' }];
export const lovelaceTabGroupOption: ElOptionsModel[] = [{ tagName: 'ha-tab-group', className: '' }];
export const lovelaceBurgerOption: ElOptionsModel[] = [{ tagName: 'ha-menu-button', className: '' }];
export const lovelaceMeatballsOption: ElOptionsModel[] = [{ tagName: 'ha-button-menu', className: '' }];

// Other pages elements options
export const containerOptions: ElOptionsModel[] = [{ tagName: 'ha-config-section' }];
export const menuButton: ElOptionsModel[] = [{ tagName: 'ha-menu-button' }];
export const burgerButton: ElOptionsModel[] = [{ tagName: 'button', className: 'mdc-icon-button' }];
export const lovelaceButton: ElOptionsModel[] = [{ tagName: 'a', className: 'list-item', id: 'item' }];
