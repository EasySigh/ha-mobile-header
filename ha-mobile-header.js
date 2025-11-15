"use strict";
(() => {
  // src/utils/dom-traverser.ts
  function domTraverser(options, root = document) {
    const matches = (el) => {
      return options.map((option) => {
        const { tagName, className, id } = option;
        const isTagOk = tagName ? el.tagName.toLowerCase() === tagName.toLowerCase() : true;
        const isClassOk = className ? el.classList.contains(className) : true;
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
      let done = false;
      const finish = (el) => {
        if (done) return;
        done = true;
        mo.disconnect();
        clearTimeout(tid);
        resolve(el);
      };
      const mo = new MutationObserver(() => {
        console.log("Detected DOM change. Attempting to find element.");
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
  var isProcessed = (path) => processedList.has(path || getUrlPath());
  var isMobile = () => navigator?.userAgentData?.mobile || window.matchMedia("(max-width: 767px)").matches;
  var canProceed = (path) => !isProcessed(path);
  var markAsStyled = (element) => element.setAttribute("mh-styled", "true");
  var isStyled = (element) => element.getAttribute("mh-styled") !== null;
  async function getCachedElement(elementCache, rootElement, pagePath, elementOptions) {
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

  // src/utils/constants/element-options.constants.ts
  var containerCache = /* @__PURE__ */ new Map();
  var headerCache = /* @__PURE__ */ new Map();
  var lovelaceContainerOption = [{ tagName: "hui-view-container", id: "view" }];
  var lovelaceHeaderOption = [{ tagName: "div", className: "header" }];
  var lovelaceTabsOption = [{ tagName: "", className: "tabs" }];
  var lovelaceNavOption = [{ tagName: "", className: "nav" }];
  var lovelaceNavArrowsOption = [{ tagName: "wa-button", className: "scroll-button" }];
  var lovelaceTabGroupOption = [{ tagName: "ha-tab-group", className: "" }];
  var lovelaceBurgerOption = [{ tagName: "ha-menu-button", className: "" }];
  var lovelaceMeatballsOption = [{ tagName: "ha-button-menu", className: "" }];
  var containerOptions = [{ tagName: "ha-config-section" }];
  var burgerButton = [{ tagName: "button", className: "mdc-icon-button" }];
  var lovelaceButton = [{ tagName: "a", className: "list-item", id: "item" }];

  // src/utils/styles/styles.constants.ts
  var lovelaceMatBtnStyle = {
    borderRadius: "calc(var(--header-height) / 2)",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    backdropFilter: "blur(2px)"
  };
  var lovelaceContainerStyle = {
    paddingTop: "env(safe-area-inset-top)",
    paddingBottom: "calc(var(--header-height) + env(safe-area-inset-bottom) + 1em)"
  };
  var lovelaceHeaderStyle = {
    top: "unset !important",
    bottom: "1em",
    backgroundColor: "transparent",
    boxShadow: "none",
    backdropFilter: "none"
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
    filter: brightness(0.5);
  }
`;

  // src/pages/lovelace.handler.ts
  async function updateLovelace(pagePath) {
    try {
      const elementStylesList = await getStyleList(pagePath);
      if (!elementStylesList?.length) return;
      const header = elementStylesList.find((el) => el?.elementName === "header")?.element;
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
  async function getStyleList(pagePath) {
    const { container, header, tabs, nav, navArrows, tabGroup, burger, meatballs } = await getElements(pagePath);
    return [
      {
        element: container,
        style: lovelaceContainerStyle
      },
      {
        element: header,
        elementName: "header",
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
  async function getElements(pagePath) {
    const rootElement = document?.querySelector("home-assistant")?.shadowRoot?.querySelector("home-assistant-main")?.shadowRoot || document.body;
    const container = await getCachedElement(containerCache, rootElement, pagePath, lovelaceContainerOption);
    if (!container) throw new Error("Could not find container.");
    const header = await getCachedElement(headerCache, rootElement, pagePath, lovelaceHeaderOption);
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
      meatballs
    };
  }
  function applyStyles(elList) {
    elList.forEach(({ element, styles, style: customStyle }) => {
      if (element && styles) {
        const elStyle = document.createElement("style");
        elStyle.textContent = styles;
        element.appendChild(elStyle);
      }
      if (element && customStyle) Object.entries(customStyle).forEach(([key, value]) => element.style[key] = value);
      if (element) markAsStyled(element);
    });
  }

  // src/utils/constants/custom-elements.constants.ts
  var mhButtonStyles = `
  border-radius: 50%;
  padding: 12px;
  height: 48px;
  width: 48px;
  border: none;
  fill: white;
  background-color: transparent;
`;
  var mhWidgetStyles = `
  position: fixed;
  left: 1em;
  bottom: calc(var(--header-height) + env(safe-area-inset-bottom));
  border-radius: 24px;
  display: flex;
  backdrop-filter: blur(1px);
  background-color: rgba(0,0,0,.6);
`;
  var mhBurgerBtnElement = `
  <button style="${mhButtonStyles}" id="mhBurger">  
    <svg preserveAspectRatio="xMidYMid meet" focusable="false" role="img" aria-hidden="true" viewBox="0 0 24 24">
      <g>
        <!--?lit$578148190$-->
        <path class="primary-path" d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"></path>
        <!--?lit$578148190$-->
      </g>
    </svg>
  </button>
`;
  var mhBackBtnElement = `
  <button style="${mhButtonStyles}" id="mhBurger">  
    <svg preserveAspectRatio="xMidYMid meet" focusable="false" role="img" aria-hidden="true" viewBox="0 0 24 24">
      <g>
        <!--?lit$207365439$-->
        <path class="primary-path" d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"></path>
        <!--?lit$207365439$-->
      </g>
    </svg>
  </button>
`;
  var mhQuickLinkBtnElement = `
  <button style="${mhButtonStyles}" id="mhQuickLink">
    <svg preserveAspectRatio="xMidYMid meet" focusable="false" role="img" aria-hidden="true" viewBox="0 0 24 24">
      <g>
        <!--?lit$760676018$-->
        <path class="primary-path" d="M13,3V9H21V3M13,21H21V11H13M3,21H11V15H3M3,13H11V3H3V13Z"></path>
        <!--?lit$760676018$-->
      </g>
   </svg>
  </button>
`;
  var mhWidget = (isBurgerType) => `
  <div style="${mhWidgetStyles}" id="mh-widget">
    ${isBurgerType ? mhBurgerBtnElement : mhBackBtnElement}

    ${mhQuickLinkBtnElement}
  </div>
`;

  // src/pages/common.handler.ts
  async function updatePage(path) {
    try {
      const { container, burger, lovelaceMenuItem } = await getElements2(path);
      container.insertAdjacentHTML("beforeend", mhWidget);
      const mhBurger = container.querySelector("#mhBurger");
      mhBurger?.addEventListener("click", () => burger?.click());
      const mhQuickLink = container.querySelector("#mhQuickLink");
      mhQuickLink?.addEventListener("click", () => lovelaceMenuItem?.click());
    } catch (e) {
      console.error(e);
    }
  }
  async function getElements2(pagePath) {
    const rootElement = document?.querySelector("home-assistant")?.shadowRoot?.querySelector("home-assistant-main")?.shadowRoot || document.body;
    const sidebarElement = rootElement?.querySelector("ha-sidebar")?.shadowRoot?.querySelector("ha-md-list.ha-scrollbar > ha-md-list-item:nth-child(1)")?.shadowRoot;
    const container = await getCachedElement(containerCache, rootElement, pagePath, containerOptions);
    if (!container) throw new Error("Could not find container.");
    const burger = await waitFor(burgerButton, rootElement, 0);
    if (!sidebarElement) throw new Error("Could not find sidebar.");
    const lovelaceMenuItem = await waitFor(lovelaceButton, sidebarElement, 0);
    return { container, burger, lovelaceMenuItem };
  }

  // src/utils/constants/common.constants.ts
  var allowedPages = ["/energy", "/config/dashboard", "/logbook", "/history", "/todo", "/developer-tools/yaml"];

  // src/ha-mobile-header.ts
  var hambStart = () => {
    const path = getUrlPath();
    if (canProceed(path)) void runForCurrentPath(path);
    navigation.addEventListener("navigate", (data) => {
      if (!data) return;
      const path2 = new URL(data?.destination?.url)?.pathname;
      if (canProceed(path2)) void runForCurrentPath(path2);
    });
  };
  async function runForCurrentPath(path) {
    console.log("runForCurrentPath", path);
    if (path.includes("lovelace" /* lovelace */)) void updateLovelace(path);
    else if (allowedPages.includes(path)) void updatePage(path);
  }

  // src/index.ts
  if (isMobile()) hambStart();
})();
