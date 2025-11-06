// Styles

const lovelaceMatBtnStyle = {
  borderRadius: 'calc(var(--header-height) + / 2)',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  backdropFilter: 'blur(2px)'
}

// Lovelace styles
export const lovelaceContainerStyle = {
  paddingTop: 'env(safe-area-inset-top)',
  paddingBottom: 'calc(var(--header-height) + env(safe-area-inset-bottom) + 1em)'
};

export const lovelaceHeaderStyle = {
  top: 'unset !important',
  bottom: '1em',
  backgroundColor: 'transparent !important'
};

export const lovelaceNavStyle = {
  width: 'calc(100% - 3em)',
  margin: 'auto'
};

export const lovelaceBurgerStyle = lovelaceMatBtnStyle;
export const lovelaceMeatballsStyle = lovelaceMatBtnStyle;
export const lovelaceTabsStyle = {
  ...lovelaceMatBtnStyle,
  margin: 'auto',
  maxWidth: 'fit-content',
};

export const lovelaceNavArrowsStyle = {
  display: 'none !important'
};

export const lovelaceTabGroupStyles = `
  ha-tab-group-tab[active] {
    border-bottom: none;
  }
  ha-tab-group-tab:not([active]) {
    opacity: 0.6;
  }
`;


// Other styles