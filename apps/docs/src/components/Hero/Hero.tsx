import { useColorMode } from "@docusaurus/theme-common";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import clsx from "clsx";
import React, { ComponentProps } from "react";
import styles from "./Hero.module.css";


interface HeroProps extends ComponentProps<any> {
  title: string;
  image?: string;
  isAnimated?: boolean;
};

export default function Hero({ children, title, image, isAnimated = false }: HeroProps): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const { isDarkTheme } = useColorMode();

  const logoUrl = useBaseUrl("img/Logo=Default.svg");
  const logoInverseUrl = useBaseUrl("img/Logo=Inverse.svg");

  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <img
          width={850}
          className={clsx({"fadeIn": isAnimated})}
          src={image ? image : isDarkTheme ? logoInverseUrl : logoUrl}
          alt="Application Flow Diagram"
        />
        <h2 className={clsx("hero__subtitle text_white-glow", styles.heroTitle)}>{
          title ? title : siteConfig.tagline
        }</h2>
        <div className={styles.buttons}>
          {children}
        </div>
      </div>
    </header>
  );
}
