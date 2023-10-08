import { AppProps } from "next/app";
import "../styles/globals.css";

import getConfig from "next/config";
import Head from "next/head";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { EventCatalogContextProvider, useConfig } from "../hooks/EventCatalog";

function Page({ Component, pageProps }: AppProps) {
  const {
    title = "EventCatalog | Discover, Explore and Document your Event Driven Architectures.",
    tagline = "An open source tool powered by markdown to document your Event Driven Architecture."
  } = useConfig();
  const { publicRuntimeConfig: { basePath = "" } = {} } = getConfig();
  /*const { googleAnalyticsTrackingId } = analytics || ({} as AnalyticsConfig);
  const {
    ogTitle = title,
    ogDescription = tagline,
    ogImage = "https://eventcatalog.dev/img/opengraph.png",
    ogUrl = homepageLink,
  } = openGraph as OpenGraphConfig;

  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = url => {
      if (googleAnalyticsTrackingId) {
        // Track page views
        ga.pageview(url);
      }
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events, googleAnalyticsTrackingId]);*/

  return (
    <EventCatalogContextProvider>
      <Head>
        <title>Open System - Event Catalog</title>

        <meta name="description" content={tagline} />

        <link rel="icon" href={`${basePath}/favicon.ico`} />

        {/*
        {ogUrl && ogUrl !== "" && <meta property="og:url" content={ogUrl} />}
        <meta property="og:type" content="website" />
        {ogTitle && <meta property="og:title" content={ogTitle} />}
        {ogDescription && (
          <meta property="og:description" content={ogDescription} />
        )}
        {ogImage && (
          <>
            <meta property="og:image" content={ogImage} />
            <meta
              property="og:image:alt"
              content={`${ogTitle} | ${ogDescription}`}
            />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="600" />
          </>
        )}
        <meta property="og:locale" content="en-GB" />*/}
        <meta name="author" content="Pat Sullivan" />
      </Head>
      {/*googleAnalyticsTrackingId && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsTrackingId}`}
          />
          <Script
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleAnalyticsTrackingId}', {
                page_path: window.location.pathname,
              });`,
            }}
          />
        </>
          )*/}
      <Header />
      <Component {...pageProps} />
      <Footer />
    </EventCatalogContextProvider>
  );
}

export default Page;
