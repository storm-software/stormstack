import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import React from "react";
import DesignTokensContainer from "../components/DesignTokens/design-tokens-container.mdx";
import Hero from "../components/Hero/Hero";
import styles from "./design-system.module.css";

export default function DesignSystem(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Development and Application Documentation">
        <Hero title="Design System" />
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
