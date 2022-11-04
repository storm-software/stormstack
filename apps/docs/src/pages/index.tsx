import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import React from "react";
import Hero from "../components/Hero/Hero";
import HomepageFeatures from "../components/HomepageFeatures/HomepageFeatures";


export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Development and Application Documentation">
       <Hero title={siteConfig.tagline}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/getting-started/installation">
            Learn More 🎓
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            OpenAPI Specs 🖥
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Repository Tools 🔧
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/design-system">
            Design System 📓
          </Link>
        </Hero>
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
