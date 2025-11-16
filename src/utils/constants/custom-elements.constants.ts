const mhWidgetStyles = `
  position: fixed;
  z-index: 2;
  left: 50%;
  transform: translateX(-50%);
  bottom: calc(var(--header-height) + env(safe-area-inset-bottom));
  border-radius: 24px;
  display: flex;
  backdrop-filter: blur(1px);
  background-color: rgba(0,0,0,.6);
`;

const mhButtonStyles = `
  border-radius: 50%;
  padding: 12px;
  height: 48px;
  width: 48px;
  border: none;
  outline: none;
  fill: white;
  background-color: transparent;
`;

const mhBurgerBtnElement = `
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

const mhBackBtnElement = `
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

const mhQuickLinkBtnElement = `
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

export const mhWidget = (hasBurger: boolean) => `
  <div style="${mhWidgetStyles}" id="mhWidget">
    ${hasBurger ? mhBurgerBtnElement: ''}

    ${mhQuickLinkBtnElement}
  </div>
`;
