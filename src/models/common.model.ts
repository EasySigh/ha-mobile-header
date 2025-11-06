interface ElementStyleBase {
  element: HTMLElement | Element | null;
}

export interface ElOptionsModel {
  id?: string;
  tagName?: string;
  classNames?: string[];
}

export type ElementStyleModel =
  | (ElementStyleBase & { style: { [key: string]: string }; styles?: string })
  | (ElementStyleBase & { styles: string; style?: { [key: string]: string } });

export enum ActionType {
  duplicate = 'duplicate',
  relocate = 'relocate'
}

export enum PagePath {
  lovelace = 'lovelace',
  energy = 'energy',
  config = 'config/dashboard',
  logbook = 'logbook',
  history = 'history',
  todo = 'todo',
  devtools = 'developer-tools/yaml'
}


export type PageElementNames = 'container' | 'header' | 'tabs' | 'nav' | 'navContainer' | 'tabGroup' | 'burger' | 'meatballs' | 'topBar' | 'barTitle' | 'barActions';
export type LovelacePageElements = 'container' | 'header' | 'tabs' | 'nav' | 'navContainer' | 'tabGroup' | 'burger' | 'meatballs';

export interface PageElements {
  container: HTMLElement;
  header: HTMLElement;
  tabs: HTMLElement;
  nav: HTMLElement;
  navContainer: HTMLElement;
  tabGroup: HTMLElement;
  burger: HTMLElement;
  meatballs: HTMLElement;
  topBar: HTMLElement;
  barTitle: HTMLElement;
  barActions: HTMLElement;
}
