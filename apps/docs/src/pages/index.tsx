import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import clsx from "clsx";
import React from "react";
import HomepageFeatures from "../components/HomepageFeatures/HomepageFeatures";
import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle text_white-glow">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Learn More 🎓
          </Link>

          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            API Reference 📓
          </Link>

          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Repository Tools 🔧
          </Link>

          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            OpenAPI Specs 🖥
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Development and Application Documentation">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
