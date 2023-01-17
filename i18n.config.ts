import { NextIntlConfig } from "next-intl";

const config: NextIntlConfig = {
  locales: ["en", "es"],
  defaultLocale: process.env.DEFAULT_LOCALE ?? "en",
  async getMessages({ locale }) {
    return (await import(`assets/messages/${locale}.json`)).default;
  },
};

export default config;
