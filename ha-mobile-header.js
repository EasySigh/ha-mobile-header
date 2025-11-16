"use strict";
(() => {
  // src/utils/helpers.ts
  var getUrlPath = () => formatPath(location.pathname);
  var isLovelaceProcessed = false;
  var saveProcessed = () => isLovelaceProcessed = true;
  var isMobile = () => navigator?.userAgentData?.mobile || window.matchMedia("(max-width: 767px)").matches;
  var markAsStyled = (element) => element.setAttribute("mh-styled", "true");
  var isStyled = (element) => element.getAttribute("mh-styled") !== null;
  function formatPath(path) {
    if (!path) return "";
    return path.replace(/^\/|\/$/g, "");
  }
  function getBurgerVariants() {
    return [
      document?.querySelector("body > home-assistant")?.shadowRoot?.querySelector("home-assistant-main")?.shadowRoot?.querySelector("ha-drawer > partial-panel-resolver > ha-panel-config > ha-config-dashboard")?.shadowRoot?.querySelector("ha-top-app-bar-fixed > ha-menu-button")?.shadowRoot?.querySelector("ha-icon-button")?.shadowRoot?.querySelector("mwc-icon-button")?.shadowRoot?.querySelector("button"),
      document?.querySelector("body > home-assistant")?.shadowRoot?.querySelector("home-assistant-main")?.shadowRoot?.querySelector("ha-drawer > partial-panel-resolver > ha-panel-todo")?.shadowRoot?.querySelector("ha-two-pane-top-app-bar-fixed > ha-menu-button")?.shadowRoot?.querySelector("ha-icon-button")?.shadowRoot?.querySelector("mwc-icon-button")?.shadowRoot?.querySelector("button"),
      document?.querySelector("body > home-assistant")?.shadowRoot?.querySelector("home-assistant-main")?.shadowRoot?.querySelector("ha-drawer > partial-panel-resolver > ha-panel-developer-tools")?.shadowRoot?.querySelector("div > div > ha-menu-button")?.shadowRoot?.querySelector("ha-icon-button")?.shadowRoot?.querySelector("mwc-icon-button")?.shadowRoot?.querySelector("button"),
      document?.querySelector("body > home-assistant")?.shadowRoot?.querySelector("home-assistant-main")?.shadowRoot?.querySelector("ha-drawer > partial-panel-resolver > ha-panel-energy")?.shadowRoot?.querySelector("div > div > ha-menu-button")?.shadowRoot?.querySelector("ha-icon-button")?.shadowRoot?.querySelector("mwc-icon-button")?.shadowRoot?.querySelector("button")
    ];
  }

  // src/utils/constants/element-options.constants.ts
  var lovelaceContainerOption = [{ tagName: "hui-view-container", id: "view" }];
  var lovelaceHeaderOption = [{ tagName: "div", className: "header" }];
  var lovelaceTabsOption = [{ className: "tabs" }];
  var lovelaceNavOption = [{ className: "nav" }];
  var lovelaceNavArrowsOption = [{ tagName: "wa-button", className: "scroll-button" }];
  var lovelaceTabGroupOption = [{ tagName: "ha-tab-group", className: "" }];
  var lovelaceBurgerOption = [{ tagName: "ha-menu-button", className: "" }];
  var lovelaceMeatballsOption = [{ tagName: "ha-button-menu", className: "" }];

  // src/utils/dom-traverser.ts
  function domTraverser(options, root = document.body) {
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
      if (node instanceof HTMLElement && matches(node)) return node;
      if (node instanceof HTMLElement && node.shadowRoot) {
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
        const found = domTraverser(options, root);
        if (found) finish(found);
      });
      mo.observe(document.documentElement, { childList: true, subtree: true });
      const tid = setTimeout(() => finish(null), timeoutMs);
    });
  }
  function waitForElement(variantsFn, timeoutMs = 3e3) {
    return new Promise((resolve) => {
      const immediate = variantsFn().filter(Boolean)[0];
      if (immediate) return resolve(immediate);
      let done = false;
      const finish = (el) => {
        if (done) return;
        done = true;
        clearInterval(intervalId);
        clearTimeout(tid);
        resolve(el);
      };
      const intervalId = setInterval(() => {
        const found = variantsFn().filter(Boolean)[0];
        if (found) finish(found);
      }, 100);
      const tid = setTimeout(() => finish(null), timeoutMs);
    });
  }

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
  async function updateLovelace() {
    try {
      const elementStylesList = await getStyleList();
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
  async function getStyleList() {
    const { container, header, tabs, nav, navArrows, tabGroup, burger, meatballs } = await getElements();
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
  async function getElements() {
    const rootElement = document?.querySelector("home-assistant")?.shadowRoot?.querySelector("home-assistant-main")?.shadowRoot || document.body;
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
  var mhWidgetStyles = `
  position: fixed;
  z-index: 2;
  right: 2rem;
  bottom: calc(var(--header-height) + env(safe-area-inset-bottom) + 1rem);
  border-radius: 24px;
  display: flex;
  backdrop-filter: blur(1px);
  background-color: rgba(0,0,0,.6);
  transform: scale(0);
  transition: transform 0.1s linear;
`;
  var mhButtonStyles = `
  border-radius: 50%;
  padding: 12px;
  height: 48px;
  width: 48px;
  border: none;
  outline: none;
  fill: white;
  background-color: transparent;
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
  <button style="${mhButtonStyles}" id="mhBack">  
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
  var mhWidget = (hasBurger) => `
  <div style="${mhWidgetStyles}" id="mhWidget">
    ${hasBurger ? mhBurgerBtnElement : ""}

    ${mhQuickLinkBtnElement}
  </div>
`;

  // src/utils/constants/paths.constants.ts
  var allowedPages = [
    "energy",
    "config/dashboard",
    "todo",
    "developer-tools/yaml",
    "logbook",
    "history",
    "config/integrations/dashboard",
    "config/voice-assistants/assistants",
    "config/automation/dashboard",
    "config/cloud/account",
    "hassio/dashboard",
    "config/areas/dashboard",
    "config/lovelace/dashboards",
    "config/tags",
    "config/person",
    "config/system"
  ];
  var showMenuBtn = {
    "energy": true,
    "config/dashboard": true,
    "todo": true,
    "developer-tools/yaml": true,
    "logbook": false,
    "history": false,
    "config/integrations/dashboard": false,
    "config/voice-assistants/assistants": false,
    "config/automation/dashboard": false,
    "config/cloud/account": false,
    "hassio/dashboard": false,
    "config/areas/dashboard": false,
    "config/lovelace/dashboards": false,
    "config/tags": false,
    "config/person": false,
    "config/system": false
  };

  // src/pages/common.handler.ts
  async function updatePage(path) {
    try {
      const hasBurger = showMenuBtn[path];
      const haTargetEl = hasBurger ? await waitForElement(getBurgerVariants) : null;
      document.body.insertAdjacentHTML("beforeend", mhWidget(hasBurger));
      if (hasBurger) {
        const proxyBurger = document.body.querySelector("#mhBurger");
        proxyBurger?.addEventListener("click", () => haTargetEl?.click());
      }
      const mhQuickLink = document.body.querySelector("#mhQuickLink");
      mhQuickLink?.addEventListener("click", () => {
        history.pushState(null, "", "/lovelace");
        window.dispatchEvent(new Event("location-changed"));
      });
      setTimeout(() => {
        const mhWidgetEl = document.body.querySelector("#mhWidget");
        mhWidgetEl.style.transform = "scale(1)";
      }, 100);
    } catch (e) {
      console.error(e);
    }
  }

  // src/ha-mobile-header.ts
  var lastPath = "";
  var hambStart = () => {
    const path = getUrlPath();
    void runForCurrentPath(path);
    navigation.addEventListener("navigate", (data) => {
      if (!data) return;
      const path2 = formatPath(new URL(data?.destination?.url)?.pathname);
      if (path2 === lastPath) return;
      lastPath = path2;
      void runForCurrentPath(path2);
    });
  };
  async function runForCurrentPath(path) {
    const oldMHWidget = document.body.querySelector("#mhWidget");
    if (!!oldMHWidget) oldMHWidget.remove();
    if (path.includes("lovelace") && !isLovelaceProcessed) void updateLovelace();
    else if (allowedPages.includes(path)) setTimeout(() => void updatePage(path), 200);
  }

  // src/index.ts
  if (isMobile()) hambStart();
})();
