import { ElOptionsModel } from "../models/common.model";

export function domTraverser(options: ElOptionsModel[], root: Node | ShadowRoot = document): Element | null {
  const matches = (el: Element): boolean => {
    return options.map((option) => {
      const { tagName, className, id } = option;

      const isTagOk = tagName ? el.tagName.toLowerCase() === tagName.toLowerCase() : true;
      const isClassOk = className ? el.classList.contains(className) : true;
      const isIdOk = id ? el.id.toLowerCase() === id.toLowerCase() : true;

      return isTagOk && isClassOk && isIdOk;
    })
      .some(Boolean);
  };

  const traverse = (node: Node | ShadowRoot): Element | null => {
    if (node instanceof Element && matches(node)) return node;

    if (node instanceof Element && node.shadowRoot) {
      try {
        const found = traverse(node.shadowRoot);
        if (found) return found;
      } catch (e) {
        // console.warn('Cannot access shadowRoot of', node);
      }
    }

    for (const child of node.childNodes) {
      const found = traverse(child);
      if (found) return found;
    }

    return null;
  };

  return traverse(root);
}