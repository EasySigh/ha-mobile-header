"use strict";
(() => {
  // src/utils/dom-traverser.ts
  function domTraverser(options, root = document) {
    const matches = (el) => {
      return options.map((option) => {
        const { tagName, classNames, id } = option;
        const isTagOk = tagName ? el.tagName.toLowerCase() === tagName.toLowerCase() : true;
        const isClassOk = classNames ? classNames.some((className) => el.classList.contains(className)) : true;
        const isIdOk = id ? el.id.toLowerCase() === id.toLowerCase() : true;
        return isTagOk && isClassOk && isIdOk;
      }).some(Boolean);
    };
    const traverse = (node) => {
      if (node instanceof Element && matches(node)) return node;
      if (node instanceof Element && node.shadowRoot) {
        try {
          const found = traverse(node.shadowRoot);
          if (found) return found;
        } catch (e) {
          console.warn("Cannot access shadowRoot of", node);
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

  // src/utils/observer.ts
  function waitFor(options, root, timeoutMs = 5e3) {
    return new Promise((resolve) => {
      const immediate = domTraverser(options, root);
      if (immediate) return resolve(immediate);
      const sourceUrl = getUrlPath();
      let done = false;
      const finish = (el) => {
        if (done) return;
        done = true;
        mo.disconnect();
        clearTimeout(tid);
        resolve(el);
      };
      const mo = new MutationObserver(() => {
        if (sourceUrl !== getUrlPath()) finish(null);
        const found = domTraverser(options, root);
        if (found) finish(found);
      });
      mo.observe(document.documentElement, { childList: true, subtree: true });
      const tid = setTimeout(() => finish(null), timeoutMs);
    });
  }

  // src/utils/helpers.ts
  var getUrlPath = () => location.pathname;
  var processedList = /* @__PURE__ */ new Set([]);
  var saveProcessed = () => processedList.add(getUrlPath());
  var isProcessed = () => processedList.has(getUrlPath());
  var isMobile = () => navigator?.userAgentData?.mobile || window.matchMedia("(max-width: 767px)").matches;
  var canProceed = (path) => localStorage.getItem("mh-allowed-pages")?.includes(path) && !isProcessed;
  async function getElement(elementCache, rootElement, pagePath, elementOptions) {
    const cachedElement = elementCache.get(pagePath)?.deref();
    const element = cachedElement ?? await waitFor(elementOptions, rootElement);
    if (!element) logError(`Cannot find element for path, ${pagePath}`);
    if (element) elementCache.set(pagePath, new WeakRef(element));
    return element;
  }
  function logError(error) {
    console.error("[HA Mobile header] Script execution has been stopped.");
    console.info(`[HA Mobile header] ${error}`);
  }

  // src/utils/elements.constants.ts
  var containerCache = /* @__PURE__ */ new Map();
  var headerCache = /* @__PURE__ */ new Map();
  var lovelaceContainerOption = [{ tagName: "hui-view-container", id: "#view" }];
  var lovelaceHeaderOption = [{ tagName: "div", classNames: ["header"] }];
  var lovelaceTabsOption = [{ tagName: "", classNames: ["tabs"] }];
  var lovelaceNavOption = [{ tagName: "", classNames: ["nav"] }];
  var lovelaceNavArrowsOption = [{ tagName: "wa-button", classNames: ["scroll-button"] }];
  var lovelaceTabGroupOption = [{ tagName: "ha-tab-group", classNames: [""] }];
  var lovelaceBurgerOption = [{ tagName: "ha-menu-button", classNames: [""] }];
  var lovelaceMeatballsOption = [{ tagName: "ha-button-menu", classNames: [""] }];

  // src/utils/styles/styles.constants.ts
  var lovelaceMatBtnStyle = {
    borderRadius: "calc(var(--header-height) + / 2)",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    backdropFilter: "blur(2px)"
  };
  var lovelaceContainerStyle = {
    paddingTop: "env(safe-area-inset-top)",
    paddingBottom: "calc(var(--header-height) + env(safe-area-inset-bottom) + 1em)"
  };
  var lovelaceHeaderStyle = {
    top: "unset !important",
    bottom: "1em",
    backgroundColor: "transparent !important"
  };
  var lovelaceNavStyle = {
    width: "calc(100% - 3em)",
    margin: "auto"
  };
  var lovelaceBurgerStyle = lovelaceMatBtnStyle;
  var lovelaceMeatballsStyle = lovelaceMatBtnStyle;
  var lovelaceTabsStyle = {
    ...lovelaceMatBtnStyle,
    margin: "auto",
    maxWidth: "fit-content"
  };
  var lovelaceNavArrowsStyle = {
    display: "none !important"
  };
  var lovelaceTabGroupStyles = `
  ha-tab-group-tab[active] {
    border-bottom: none;
  }
  ha-tab-group-tab:not([active]) {
    opacity: 0.6;
  }
`;

  // src/pages/lovelace.handler.ts
  async function updateLovelace(pagePath) {
    try {
      const elementStylesList = await getStyleList(pagePath);
      if (!elementStylesList) return;
      applyStyles(elementStylesList);
      saveProcessed();
    } catch (e) {
      console.error(e);
    }
  }
  async function getStyleList(pagePath) {
    const rootElement = document?.querySelector("home-assistant")?.shadowRoot?.querySelector("home-assistant-main")?.shadowRoot || document.body;
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
        style: lovelaceContainerStyle
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
  function applyStyles(elList) {
    elList.forEach(({ element, styles, style: customStyle }) => {
      if (element && styles) {
        const elStyle = document.createElement("style");
        elStyle.textContent = styles;
        element.appendChild(elStyle);
      }
      if (element && customStyle) Object.entries(customStyle).forEach(([key, value]) => element.style[key] = value);
    });
  }

  // src/ha-mobile-header.ts
  var hambStart = () => {
    navigation.addEventListener("navigate", () => {
      const path = getUrlPath();
      if (canProceed(path)) void runForCurrentPath(path);
    });
  };
  async function runForCurrentPath(path) {
    if (path === "lovelace" /* lovelace */) void updateLovelace(path);
    else updatePage(path);
  }
  function updatePage(path) {
    console.log("Update page", path);
  }

  // src/index.ts
  if (isMobile()) hambStart();
})();
