import { createIntlMiddleware } from "next-intl/server";

export default createIntlMiddleware();

export const config = {
  // Skip setting locale on internal paths
  matcher: ["/((?!_next).*)"],
};
