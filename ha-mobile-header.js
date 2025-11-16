"use strict";
(() => {
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
          const found2 = traverse(node.shadowRoot);
          if (found2) return found2;
        } catch (e) {
        }
      }
      for (const child of node.childNodes) {
        const found2 = traverse(child);
        if (found2) return found2;
      }
      return null;
    };
    return traverse(root);
  }

  // src/utils/observer.ts
  function waitFor(options, root, timeoutMs2 = 5e3) {
    return new Promise((resolve2) => {
      const immediate2 = domTraverser(options, root);
      if (immediate2) return resolve2(immediate2);
      let done2 = false;
      const finish2 = (el) => {
        if (done2) return;
        done2 = true;
        mo.disconnect();
        clearTimeout(tid2);
        resolve2(el);
      };
      const mo = new MutationObserver(() => {
        const found2 = domTraverser(options, root);
        if (found2) finish2(found2);
      });
      mo.observe(document.documentElement, { childList: true, subtree: true });
      const tid2 = setTimeout(() => finish2(null), timeoutMs2);
    });
  }
  function waitForElement(selectorList, timeoutMs = 3e3) {
    return new Promise((resolve) => {
      const immediate = selectorList.map((selector) => eval(selector)).filter(Boolean)[0];
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
        const found = selectorList.map((selector) => eval(selector)).filter(Boolean)[0];
        if (found) finish(found);
      }, 100);
      const tid = setTimeout(() => finish(null), timeoutMs);
    });
  }

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

  // src/utils/constants/element-options.constants.ts
  var lovelaceContainerOption = [{ tagName: "hui-view-container", id: "view" }];
  var lovelaceHeaderOption = [{ tagName: "div", className: "header" }];
  var lovelaceTabsOption = [{ className: "tabs" }];
  var lovelaceNavOption = [{ className: "nav" }];
  var lovelaceNavArrowsOption = [{ tagName: "wa-button", className: "scroll-button" }];
  var lovelaceTabGroupOption = [{ tagName: "ha-tab-group", className: "" }];
  var lovelaceBurgerOption = [{ tagName: "ha-menu-button", className: "" }];
  var lovelaceMeatballsOption = [{ tagName: "ha-button-menu", className: "" }];

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
  left: 1.5em;
  bottom: calc(var(--header-height) + env(safe-area-inset-bottom));
  border-radius: 24px;
  display: flex;
  backdrop-filter: blur(1px);
  background-color: rgba(0,0,0,.6);
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
  var mhWidget = (isBackType) => `
  <div style="${mhWidgetStyles}" id="mhWidget">
    ${isBackType ? mhBackBtnElement : mhBurgerBtnElement}

    ${mhQuickLinkBtnElement}
  </div>
`;

  // src/utils/constants/common.constants.ts
  var allowedPages = [
    "energy",
    "config/dashboard",
    "logbook",
    "history",
    "todo",
    "developer-tools/yaml",
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
  var isPageBackBtn = {
    "energy": false,
    "config/dashboard": false,
    "logbook": true,
    "history": true,
    "todo": false,
    "developer-tools/yaml": false,
    "config/integrations/dashboard": true,
    "config/voice-assistants/assistants": true,
    "config/automation/dashboard": true,
    "config/cloud/account": true,
    "hassio/dashboard": true,
    "config/areas/dashboard": true,
    "config/lovelace/dashboards": true,
    "config/tags": true,
    "config/person": true,
    "config/system": true
  };

  // src/utils/constants/selectors.constants.ts
  var burgerSelectors = [
    'document?.querySelector("body > home-assistant")?.shadowRoot?.querySelector("home-assistant-main")?.shadowRoot?.querySelector("ha-drawer > partial-panel-resolver > ha-panel-config > ha-config-dashboard")?.shadowRoot?.querySelector("ha-top-app-bar-fixed > ha-menu-button")?.shadowRoot?.querySelector("ha-icon-button")?.shadowRoot?.querySelector("mwc-icon-button")?.shadowRoot?.querySelector("button")',
    `document?.querySelector("body > home-assistant")?.shadowRoot?.querySelector("home-assistant-main")?.shadowRoot?.querySelector("ha-drawer > partial-panel-resolver > ha-panel-todo")?.shadowRoot?.querySelector("ha-two-pane-top-app-bar-fixed > ha-menu-button")?.shadowRoot?.querySelector("ha-icon-button")?.shadowRoot?.querySelector("mwc-icon-button")?.shadowRoot?.querySelector("button")`,
    `document?.querySelector("body > home-assistant")?.shadowRoot?.querySelector("home-assistant-main")?.shadowRoot?.querySelector("ha-drawer > partial-panel-resolver > ha-panel-developer-tools")?.shadowRoot?.querySelector("div > div > ha-menu-button")?.shadowRoot?.querySelector("ha-icon-button")?.shadowRoot?.querySelector("mwc-icon-button")?.shadowRoot?.querySelector("button")`
  ];
  var backBtnSelectors = [
    `document.querySelector("body > home-assistant")?.shadowRoot?.querySelector("home-assistant-main")?.shadowRoot?.querySelector("ha-drawer > partial-panel-resolver > ha-panel-config > ha-config-integrations > ha-config-integrations-dashboard")?.shadowRoot?.querySelector("hass-tabs-subpage")?.shadowRoot?.querySelector("div.toolbar > slot > div > a > ha-icon-button-arrow-prev")?.shadowRoot?.querySelector("ha-icon-button")?.shadowRoot?.querySelector("mwc-icon-button")?.shadowRoot?.querySelector("button")`,
    `document.querySelector("body > home-assistant")?.shadowRoot?.querySelector("home-assistant-main")?.shadowRoot?.querySelector("ha-drawer > partial-panel-resolver > ha-panel-config > ha-config-voice-assistants > ha-config-voice-assistants-assistants")?.shadowRoot?.querySelector("hass-tabs-subpage")?.shadowRoot?.querySelector("div.toolbar > slot > div > a > ha-icon-button-arrow-prev")?.shadowRoot?.querySelector("ha-icon-button")?.shadowRoot?.querySelector("mwc-icon-button")?.shadowRoot?.querySelector("button")`,
    `document.querySelector("body > home-assistant")?.shadowRoot?.querySelector("home-assistant-main")?.shadowRoot?.querySelector("ha-drawer > partial-panel-resolver > ha-panel-config > ha-config-automation > ha-automation-picker")?.shadowRoot?.querySelector("#entity_id")?.shadowRoot?.querySelector("hass-tabs-subpage")?.shadowRoot?.querySelector("div.toolbar > slot > div > a > ha-icon-button-arrow-prev")?.shadowRoot?.querySelector("ha-icon-button")?.shadowRoot?.querySelector("mwc-icon-button")?.shadowRoot?.querySelector("button")`,
    `document.querySelector("body > home-assistant")?.shadowRoot?.querySelector("home-assistant-main")?.shadowRoot?.querySelector("ha-drawer > partial-panel-resolver > ha-panel-config > ha-config-cloud > cloud-account")?.shadowRoot?.querySelector("hass-subpage")?.shadowRoot?.querySelector("div.toolbar > div > ha-icon-button-arrow-prev")?.shadowRoot?.querySelector("ha-icon-button")?.shadowRoot?.querySelector("mwc-icon-button")?.shadowRoot?.querySelector("button")`,
    `document.querySelector("body > hassio-main")?.shadowRoot?.querySelector("hassio-router > hassio-panel")?.shadowRoot?.querySelector("hassio-panel-router > hassio-dashboard")?.shadowRoot?.querySelector("hass-subpage")?.shadowRoot?.querySelector("div.toolbar > div > a > ha-icon-button-arrow-prev")?.shadowRoot?.querySelector("ha-icon-button")?.shadowRoot?.querySelector("mwc-icon-button")?.shadowRoot?.querySelector("button")`,
    `document.querySelector("body > home-assistant")?.shadowRoot?.querySelector("home-assistant-main")?.shadowRoot?.querySelector("ha-drawer > partial-panel-resolver > ha-panel-config > ha-config-areas > ha-config-areas-dashboard")?.shadowRoot?.querySelector("hass-tabs-subpage")?.shadowRoot?.querySelector("div.toolbar > slot > div > a > ha-icon-button-arrow-prev")?.shadowRoot?.querySelector("ha-icon-button")?.shadowRoot?.querySelector("mwc-icon-button")?.shadowRoot?.querySelector("button")`,
    `document.querySelector("body > hassio-main")?.shadowRoot?.querySelector("hassio-router > hassio-panel")?.shadowRoot?.querySelector("hassio-panel-router > hassio-dashboard")?.shadowRoot?.querySelector("hass-subpage")?.shadowRoot?.querySelector("div.toolbar > div > a > ha-icon-button-arrow-prev")?.shadowRoot?.querySelector("ha-icon-button")?.shadowRoot?.querySelector("mwc-icon-button")?.shadowRoot?.querySelector("button")`,
    `document.querySelector("body > home-assistant")?.shadowRoot?.querySelector("home-assistant-main")?.shadowRoot?.querySelector("ha-drawer > partial-panel-resolver > ha-panel-config > ha-config-tags")?.shadowRoot?.querySelector("#id")?.shadowRoot.querySelector("hass-tabs-subpage")?.shadowRoot?.querySelector("div.toolbar > slot > div > a > ha-icon-button-arrow-prev")?.shadowRoot?.querySelector("ha-icon-button")?.shadowRoot.querySelector("mwc-icon-button")?.shadowRoot?.querySelector("button")`
  ];

  // src/pages/common.handler.ts
  async function updatePage(path) {
    try {
      const isBackBtn = isPageBackBtn[path];
      const haTargetEl = await waitForElement(isBackBtn ? backBtnSelectors : burgerSelectors);
      document.body.insertAdjacentHTML("beforeend", mhWidget(isBackBtn));
      const proxyBtn = document.body.querySelector(isBackBtn ? "#mhBack" : "#mhBurger");
      proxyBtn?.addEventListener("click", () => haTargetEl?.click());
      const mhQuickLink = document.body.querySelector("#mhQuickLink");
      mhQuickLink?.addEventListener("click", () => window.location.href = "/lovelace");
    } catch (e) {
      console.error(e);
    }
  }

  // src/ha-mobile-header.ts
  var hambStart = () => {
    const path = getUrlPath();
    void runForCurrentPath(path);
    navigation.addEventListener("navigate", (data) => {
      if (!data) return;
      const path2 = formatPath(new URL(data?.destination?.url)?.pathname);
      void runForCurrentPath(path2);
    });
  };
  async function runForCurrentPath(path) {
    const oldMHWidget = document.body.querySelector("#mhWidget");
    if (!!oldMHWidget) oldMHWidget.remove();
    if (path.includes("lovelace") && !isLovelaceProcessed) void updateLovelace();
    else if (allowedPages.includes(path)) void updatePage(path);
  }

  // src/index.ts
  if (isMobile()) hambStart();
})();
