export const getPrimaryColor = (): string => {
  return process.env.THEME_PRIMARY_COLOR ?? "#1fb2a6";
};

export const getBackgroundColor = (): string => {
  return process.env.THEME_BACKGROUND_COLOR ?? "#1d232a";
};

export const getSuccessColor = (): string => {
  return process.env.THEME_SUCCESS_COLOR ?? "#087f5b";
};

export const getInfoColor = (): string => {
  return process.env.THEME_INFO_COLOR ?? "#0ea5e9";
};

export const getWarningColor = (): string => {
  return process.env.THEME_WARNING_COLOR ?? "#fcc419";
};

export const getErrorColor = (): string => {
  return process.env.THEME_ERROR_COLOR ?? "#7d1a1a";
};
