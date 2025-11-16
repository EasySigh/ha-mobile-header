import { ElOptionsModel } from "../../models/common.model";

// Lovelace (dashboard) elements options
export const lovelaceContainerOption: ElOptionsModel[] = [{ tagName: 'hui-view-container', id: 'view' }];
export const lovelaceHeaderOption: ElOptionsModel[] = [{ tagName: 'div', className: 'header' }];
export const lovelaceTabsOption: ElOptionsModel[] = [{ className: 'tabs' }];
export const lovelaceNavOption: ElOptionsModel[] = [{ className: 'nav' }];
export const lovelaceNavArrowsOption: ElOptionsModel[] = [{ tagName: 'wa-button', className: 'scroll-button' }];
export const lovelaceTabGroupOption: ElOptionsModel[] = [{ tagName: 'ha-tab-group', className: '' }];
export const lovelaceBurgerOption: ElOptionsModel[] = [{ tagName: 'ha-menu-button', className: '' }];
export const lovelaceMeatballsOption: ElOptionsModel[] = [{ tagName: 'ha-button-menu', className: '' }];
