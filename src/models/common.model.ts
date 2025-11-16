interface ElementStyleBase {
  element: HTMLElement | Element | null;
  elementName?: string;
}

export interface ElOptionsModel {
  id?: string;
  tagName?: string;
  className?: string;
}

export type ElementStyleModel =
  | (ElementStyleBase & { style: { [key: string]: string }; styles?: string })
  | (ElementStyleBase & { styles: string; style?: { [key: string]: string } });

export type Nullable<T> = T | null | undefined;