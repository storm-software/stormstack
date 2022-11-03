import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import clsx from "clsx";
import React from "react";
import DesignTokensContainer from "../components/DesignTokens/design-tokens-container.mdx";
import styles from "./design-system.module.css";

export default function DesignSystem(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Development and Application Documentation">
      <header className={clsx("hero hero--primary", styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title title">Open System</h1>
          <h2 className="text_white-glow subtitle">Design System</h2>
        </div>
      </header>
      <main>
        <div className="container">
          <div className={styles.designTokensContainer}>
            <DesignTokensContainer />
          </div>
        </div>
      </main>
    </Layout>
  );
}
