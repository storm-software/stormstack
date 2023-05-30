export const isProduction = (): boolean =>
  !!(process.env.NODE_ENV?.toLowerCase() === "production");

  export const isDevelopment = (): boolean =>
  !isProduction();