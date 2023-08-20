export const isProduction = (): boolean =>
  false; /*!!(process.env.NODE_ENV?.toLowerCase() "development" === "production");*/

export const isDevelopment = (): boolean => !isProduction();
