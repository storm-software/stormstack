"use client";

import { Heading } from "@open-system/design-system-components";
import { Link } from "@open-system/core-components";
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import ApiExtractorLogo from "../../../../../../assets/external-logos/api-extractor-logo.svg";
import asyncapiLogo from "../../../../../../assets/external-logos/asyncapi-logo.png";
import CommitlintLogo from "../../../../../../assets/external-logos/commitlint-logo.svg";
import contextMapperLogo from "../../../../../../assets/external-logos/context-mapper-logo.png";
import cypressLogo from "../../../../../../assets/external-logos/cypress-logo.png";
import DockerLogo from "../../../../../../assets/external-logos/docker-logo.svg";
import DocusaurusLogo from "../../../../../../assets/external-logos/docusaurus-logo.svg";
import DotnetLogo from "../../../../../../assets/external-logos/dotnet-logo.svg";
import ElectronLogo from "../../../../../../assets/external-logos/electron-logo.svg";
import ESLintLogo from "../../../../../../assets/external-logos/eslint-logo.svg";
import FigmaLogo from "../../../../../../assets/external-logos/figma-logo.svg";
import GraphQLLogo from "../../../../../../assets/external-logos/graphql-logo.svg";
import InvisionLogo from "../../../../../../assets/external-logos/invision-logo.svg";
import javaLogo from "../../../../../../assets/external-logos/java-logo.png";
import jenkinsLogo from "../../../../../../assets/external-logos/jenkins-logo.png";
import jestLogo from "../../../../../../assets/external-logos/jest-logo.png";
import KafkaLogo from "../../../../../../assets/external-logos/kafka-logo.svg";
import kubernetesLogo from "../../../../../../assets/external-logos/kubernetes-logo.png";
import log4brainsLogo from "../../../../../../assets/external-logos/log4brains-logo.png";
import mavenLogo from "../../../../../../assets/external-logos/maven-logo.png";
import MintlifyLogo from "../../../../../../assets/external-logos/mintlify-logo.svg";
import NextLogo from "../../../../../../assets/external-logos/nextjs-logo.svg";
import nodeLogo from "../../../../../../assets/external-logos/node-logo.png";
import nunitLogo from "../../../../../../assets/external-logos/nunit-logo.png";
import nxLogo from "../../../../../../assets/external-logos/nx-logo.png";
import OpenApiLogo from "../../../../../../assets/external-logos/openapi-logo.svg";
import PlantUMLLogo from "../../../../../../assets/external-logos/plantuml-logo.svg";
import PostgreSqlLogo from "../../../../../../assets/external-logos/postgresql-logo.svg";
import pythonLogo from "../../../../../../assets/external-logos/python-logo.png";
import RabbitMQLogo from "../../../../../../assets/external-logos/rabbitmq-logo.svg";
import ReactLogo from "../../../../../../assets/external-logos/react-logo.svg";
import redoclyLogo from "../../../../../../assets/external-logos/redocly-logo.png";
import sqlServerLogo from "../../../../../../assets/external-logos/sql-server-logo.png";
import stencilLogo from "../../../../../../assets/external-logos/stenciljs-logo.png";
import StoplightLogo from "../../../../../../assets/external-logos/stoplight-logo.svg";
import StorybookLogo from "../../../../../../assets/external-logos/storybook-logo.svg";
import structurizrLogo from "../../../../../../assets/external-logos/structurizr-logo.png";
import styleDictionaryLogo from "../../../../../../assets/external-logos/style-dictionary-logo.png";
import styledComponentsLogo from "../../../../../../assets/external-logos/styled-components-logo.png";
import TailwindCssLogo from "../../../../../../assets/external-logos/tailwindcss-logo.svg";
import testCompleteLogo from "../../../../../../assets/external-logos/test-complete-logo.png";
import webSphereLogo from "../../../../../../assets/external-logos/websphere-logo.webp";
import Technology from "./technology";
import TechnologyGroup from "./technology-group";

export interface TechnologyGroupDetails {
  name: string;
  summary?: string | JSX.Element;
}

export default function Technologies() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hiddenRef = useRef<HTMLDivElement>(null);

  const [scrollRange, setScrollRange] = useState(0);
  const [viewportW, setViewportW] = useState(0);

  useEffect(() => {
    scrollRef.current && setScrollRange(scrollRef.current.scrollWidth);
  }, [scrollRef]);

  const onResize = useCallback((entries: ResizeObserverEntry[]) => {
    for (const entry of entries) {
      setViewportW(entry.contentRect.width);
    }
  }, []);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(
      (entries: ResizeObserverEntry[]) => onResize(entries)
    );
    hiddenRef.current && resizeObserver.observe(hiddenRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [onResize]);

  const { scrollYProgress } = useScroll({ target: containerRef });
  const transform = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -scrollRange + viewportW]
  );
  const x = useSpring(transform, { damping: 20 });

  const [currentGroup, setCurrentGroupState] =
    useState<TechnologyGroupDetails | null>(null);
  const setCurrentGroup = useCallback(
    (details: TechnologyGroupDetails, isDisplayed = false) => {
      if (isDisplayed) {
        setCurrentGroupState(details);
      } else if (currentGroup?.name === details.name) {
        setCurrentGroupState(null);
      }
    },
    [currentGroup?.name]
  );

  return (
    <div ref={containerRef} className="relative z-content h-[375vh] w-full">
      <AnimatePresence>
        {currentGroup?.name && (
          <motion.div
            className="fixed left-40 top-20 z-like flex flex-col gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1,
              delay: 0.2,
              ease: [0, 0.71, 0.2, 1.01],
            }}>
            <Heading level={4} className="whitespace-nowrap text-5xl">
              {currentGroup?.name}
            </Heading>
            {currentGroup?.summary && (
              <p className="w-full font-body-1 text-body-1 lg:w-1/2">
                {currentGroup?.summary}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="sticky left-0 right-0 top-10 overflow-hidden">
        <Heading level={2} className="absolute bottom-16 left-32">
          Technologies
        </Heading>
        <motion.section
          ref={scrollRef}
          style={{ x }}
          className="relative flex w-fit flex-row gap-[45rem] pl-[100vw]">
          <TechnologyGroup
            name="Design System / Modeling"
            summary={
              <>
                Libraries and applications that assist in the process of
                creating{" "}
                <Link
                  href="https://designsystem.digital.gov/design-tokens/"
                  inNewTab={true}>
                  design systems/tokens
                </Link>
                , or{" "}
                <Link
                  href="https://www.educative.io/blog/software-architecture-diagramming-and-patterns"
                  inNewTab={true}>
                  software architecture diagrams/models
                </Link>
                .
              </>
            }
            setCurrentGroup={setCurrentGroup}>
            <Technology
              name="Figma"
              description="Figma is an extremely helpful tool for designing wire-frames and specifying design tokens."
              url="https://www.figma.com/">
              <FigmaLogo alt="Figma" height={200} width={200} />
            </Technology>
            <Technology
              name="Context Mapper"
              description="Style Dictionary is a build system that allows you to define styles once, in a way for any platform or language to consume."
              url="https://contextmapper.org/">
              <div className="h-52 w-52">
                <Image
                  src={contextMapperLogo}
                  alt="Context Mapper"
                  height={200}
                  width={200}
                />
              </div>
            </Technology>
            <Technology
              name="Stoplight"
              description="Style Dictionary is a build system that allows you to define styles once, in a way for any platform or language to consume."
              url="https://stoplight.io/">
              <StoplightLogo alt="Stoplight" height={200} width={200} />
            </Technology>
            <Technology
              name="Invision"
              description="Style Dictionary is a build system that allows you to define styles once, in a way for any platform or language to consume."
              url="https://www.invisionapp.com/">
              <InvisionLogo alt="Invision" height={185} width={185} />
            </Technology>
            <Technology
              name="Style Dictionary"
              description="Style Dictionary is a build system that allows you to define styles once, in a way for any platform or language to consume."
              url="https://amzn.github.io/style-dictionary/#/">
              <div className="h-44 w-44">
                <Image
                  src={styleDictionaryLogo}
                  alt="Style Dictionary"
                  height={175}
                  width={175}
                />
              </div>
            </Technology>
            <Technology
              name="Structurizr"
              description="Style Dictionary is a build system that allows you to define styles once, in a way for any platform or language to consume."
              url="https://structurizr.com/">
              <div className="h-44 w-52">
                <Image
                  src={structurizrLogo}
                  alt="Structurizr"
                  height={150}
                  width={200}
                />
              </div>
            </Technology>
            <Technology
              name="PlantUML"
              description="Style Dictionary is a build system that allows you to define styles once, in a way for any platform or language to consume."
              url="https://plantuml.com/">
              <PlantUMLLogo alt="PlantUML" height={200} />
            </Technology>
          </TechnologyGroup>

          <TechnologyGroup
            name="Client-Side / User Interfaces"
            summary={
              <>
                Frameworks and external libraries that help in creating{" "}
                <Link
                  href="https://www.computerhope.com/jargon/g/gui.htm"
                  inNewTab={true}>
                  graphical user interfaces
                </Link>{" "}
                for web, desktop, and mobile applications.
              </>
            }
            setCurrentGroup={setCurrentGroup}>
            <Technology
              name="React"
              description="Figma is an extremely helpful tool for designing wire-frames and specifying design tokens."
              url="https://reactjs.org/">
              <ReactLogo alt="React" height={200} width={200} />
            </Technology>
            <Technology
              name="Tailwind CSS"
              description="Style Dictionary is a build system that allows you to define styles once, in a way for any platform or language to consume."
              url="https://tailwindcss.com/">
              <TailwindCssLogo alt="Tailwind CSS" height={200} width={200} />
            </Technology>
            <Technology
              name="Stencil"
              description="Style Dictionary is a build system that allows you to define styles once, in a way for any platform or language to consume."
              url="https://stenciljs.com/">
              <div className="h-52 w-52">
                <Image
                  src={stencilLogo}
                  alt="Stencil"
                  height={200}
                  width={200}
                />
              </div>
            </Technology>
            <Technology
              name="Next"
              description="Style Dictionary is a build system that allows you to define styles once, in a way for any platform or language to consume."
              url="https://nextjs.org/">
              <NextLogo alt="Next" height={200} width={200} />
            </Technology>
            <Technology
              name="Electron"
              description="Style Dictionary is a build system that allows you to define styles once, in a way for any platform or language to consume."
              url="https://www.electronjs.org/">
              <ElectronLogo alt="Electron" height={200} width={200} />
            </Technology>
            <Technology
              name="Styled Components"
              description="Style Dictionary is a build system that allows you to define styles once, in a way for any platform or language to consume."
              url="https://styled-components.com/">
              <Image
                src={styledComponentsLogo}
                alt="Styled Components"
                height={200}
                width={200}
              />
            </Technology>
          </TechnologyGroup>

          <TechnologyGroup
            name="Server-Side / Scripting"
            summary="Languages, platforms, and tools that can be used to create services/applications meant to run on deployed servers or as individual scripts."
            setCurrentGroup={setCurrentGroup}>
            <Technology
              name="Open-API"
              description="Style Dictionary is a build system that allows you to define styles once, in a way for any platform or language to consume."
              url="https://www.openapis.org/">
              <OpenApiLogo alt="Open-API" height={200} width={200} />
            </Technology>
            <Technology
              name="Async-API"
              description="Style Dictionary is a build system that allows you to define styles once, in a way for any platform or language to consume."
              url="https://www.asyncapi.com/">
              <div className="h-52 w-52">
                <Image
                  src={asyncapiLogo}
                  alt="Async-API"
                  height={200}
                  width={200}
                />
              </div>
            </Technology>
            <Technology
              name="Java"
              description="Style Dictionary is a build system that allows you to define styles once, in a way for any platform or language to consume."
              url="https://www.java.com/">
              <div className="h-52 w-36">
                <Image src={javaLogo} alt="Java" height={150} width={150} />
              </div>
            </Technology>
            <Technology
              name="Node"
              description="Style Dictionary is a build system that allows you to define styles once, in a way for any platform or language to consume."
              url="https://nodejs.org/">
              <div className="h-44 w-40">
                <Image src={nodeLogo} alt="Node" height={150} width={150} />
              </div>
            </Technology>
            <Technology
              name=".NET Core"
              description="Style Dictionary is a build system that allows you to define styles once, in a way for any platform or language to consume."
              url="https://learn.microsoft.com/en-us/dotnet/core/introduction">
              <DotnetLogo alt=".NET Core" height={200} width={200} />
            </Technology>
            <Technology
              name="Python"
              description="Style Dictionary is a build system that allows you to define styles once, in a way for any platform or language to consume."
              url="https://www.python.org/community/logos/">
              <div className="h-52 w-52">
                <Image src={pythonLogo} alt="Python" height={200} width={200} />
              </div>
            </Technology>
          </TechnologyGroup>

          <TechnologyGroup
            name="Databases / Messaging"
            summary={
              <>
                Technologies used to access and store data to a{" "}
                <Link
                  href="https://www.techtarget.com/searchstorage/definition/Persistent-storage"
                  inNewTab={true}>
                  persistent storage
                </Link>{" "}
                and/or{" "}
                <Link
                  href="https://aws.amazon.com/message-queue/"
                  inNewTab={true}>
                  message queueing
                </Link>{" "}
                systems.
              </>
            }
            setCurrentGroup={setCurrentGroup}>
            <Technology
              name="Kafka"
              description="Style Dictionary is a build system that allows you to define styles once, in a way for any platform or language to consume."
              url="https://kafka.apache.org/">
              <KafkaLogo alt="Kafka" height={200} width={200} />
            </Technology>
            <Technology
              name="PostgreSQL"
              description="Style Dictionary is a build system that allows you to define styles once, in a way for any platform or language to consume."
              url="https://www.postgresql.org/">
              <PostgreSqlLogo alt="PostgreSQL" height={200} width={200} />
            </Technology>
            <Technology
              name="SQL Server"
              description="Style Dictionary is a build system that allows you to define styles once, in a way for any platform or language to consume."
              url="https://learn.microsoft.com/en-us/sql/sql-server/?view=sql-server-ver16">
              <div className="h-52 w-52">
                <Image
                  src={sqlServerLogo}
                  alt="SQL Server"
                  height={200}
                  width={200}
                />
              </div>
            </Technology>
            <Technology
              name="WebSphere"
              description="Style Dictionary is a build system that allows you to define styles once, in a way for any platform or language to consume."
              url="https://www.ibm.com/products/mq">
              <div className="h-52 w-52">
                <Image
                  src={webSphereLogo}
                  alt="WebSphere"
                  height={200}
                  width={200}
                />
              </div>
            </Technology>
            <Technology
              name="Rabbit MQ"
              description="Style Dictionary is a build system that allows you to define styles once, in a way for any platform or language to consume."
              url="https://www.rabbitmq.com/">
              <RabbitMQLogo alt="Rabbit MQ" height={175} width={175} />
            </Technology>
            <Technology
              name="GraphQL"
              description="Style Dictionary is a build system that allows you to define styles once, in a way for any platform or language to consume."
              url="https://graphql.org/">
              <GraphQLLogo alt="GraphQL" height={175} width={175} />
            </Technology>
          </TechnologyGroup>

          <TechnologyGroup
            name="DevOps / Repository Management"
            summary={
              <>
                Tools used to manage various aspects of a{" "}
                <Link
                  href="https://aws.amazon.com/devops/source-control/"
                  inNewTab={true}>
                  source control repository
                </Link>{" "}
                (such as a Git or Team Foundation Server project), or to build,
                deploy, and/or scale an application in a deployed environment.
              </>
            }
            setCurrentGroup={setCurrentGroup}>
            <Technology
              name="Nx"
              description="Style Dictionary is a build system that allows you to define styles once, in a way for any platform or language to consume."
              url="https://nx.dev/">
              <div className="h-fit w-52">
                <Image src={nxLogo} alt="Nx" height={200} width={200} />
              </div>
            </Technology>
            <Technology
              name="Commitlint"
              description="Style Dictionary is a build system that allows you to define styles once, in a way for any platform or language to consume."
              url="https://commitlint.js.org/#/">
              <CommitlintLogo alt="Commitlint" height={125} width={175} />
            </Technology>
            <Technology
              name="Docker"
              description="Style Dictionary is a build system that allows you to define styles once, in a way for any platform or language to consume."
              url="https://www.docker.com/">
              <DockerLogo alt="Docker" height={150} width={200} />
            </Technology>
            <Technology
              name="Maven"
              description="Style Dictionary is a build system that allows you to define styles once, in a way for any platform or language to consume."
              url="https://maven.apache.org/">
              <div className="w-24">
                <Image src={mavenLogo} alt="Maven" height={150} width={120} />
              </div>
            </Technology>
            <Technology
              name="Kubernetes"
              description="Figma is an extremely helpful tool for designing wire-frames and specifying design tokens."
              url="https://kubernetes.io/">
              <div className="h-52 w-52">
                <Image
                  src={kubernetesLogo}
                  alt="Kubernetes"
                  height={200}
                  width={200}
                />
              </div>
            </Technology>
            <Technology
              name="ESLint"
              description="Style Dictionary is a build system that allows you to define styles once, in a way for any platform or language to consume."
              url="https://eslint.org/">
              <ESLintLogo alt="ESLint" height={150} width={200} />
            </Technology>
            <Technology
              name="Jenkins"
              description="Style Dictionary is a build system that allows you to define styles once, in a way for any platform or language to consume."
              url="https://www.jenkins.io/">
              <div className="h-52 w-52">
                <Image
                  src={jenkinsLogo}
                  alt="Jenkins"
                  height={150}
                  width={150}
                />
              </div>
            </Technology>
          </TechnologyGroup>

          <TechnologyGroup
            name="Documentation"
            summary="Various applications used to generate, format, and/or present a codebase's documentation automatically (or with minimal effort). This is possibly the most often underrated grouping in this list, in terms of importance."
            setCurrentGroup={setCurrentGroup}>
            <Technology
              name="Docusaurus"
              description="Style Dictionary is a build system that allows you to define styles once, in a way for any platform or language to consume."
              url="https://docusaurus.io/">
              <DocusaurusLogo alt="Docusaurus" height={175} width={200} />
            </Technology>
            <Technology
              name="Storybook"
              description="Style Dictionary is a build system that allows you to define styles once, in a way for any platform or language to consume."
              url="https://storybook.js.org/">
              <StorybookLogo alt="Storybook" height={200} width={150} />
            </Technology>
            <Technology
              name="Log4brains"
              description="Figma is an extremely helpful tool for designing wire-frames and specifying design tokens."
              url="https://github.com/thomvaill/log4brains">
              <div className="h-52 w-52">
                <Image
                  src={log4brainsLogo}
                  alt="Log4brains"
                  height={200}
                  width={200}
                />
              </div>
            </Technology>
            <Technology
              name="API Extractor"
              description="Style Dictionary is a build system that allows you to define styles once, in a way for any platform or language to consume."
              url="https://api-extractor.com/">
              <ApiExtractorLogo alt="API Extractor" height={200} width={150} />
            </Technology>
            <Technology
              name="Mintlify"
              description="Style Dictionary is a build system that allows you to define styles once, in a way for any platform or language to consume."
              url="https://mintlify.com/">
              <MintlifyLogo alt="Mintlify" height={175} width={175} />
            </Technology>
            <Technology
              name="Redocly"
              description="Style Dictionary is a build system that allows you to define styles once, in a way for any platform or language to consume."
              url="https://redocly.com/">
              <div className="h-40 w-40">
                <Image
                  src={redoclyLogo}
                  alt="Redocly"
                  height={150}
                  width={150}
                />
              </div>
            </Technology>
          </TechnologyGroup>

          <TechnologyGroup
            name="Testing"
            summary={
              <>
                Tools used to create or document{" "}
                <Link
                  href="https://testsigma.com/blog/unit-test-vs-e2e-test/"
                  inNewTab={true}>
                  unit and end-to-end tests
                </Link>{" "}
                for both client and server-side code.
              </>
            }
            setCurrentGroup={setCurrentGroup}>
            <Technology
              name="Jest"
              description="Style Dictionary is a build system that allows you to define styles once, in a way for any platform or language to consume."
              url="https://jestjs.io/">
              <div className="h-52 w-52">
                <Image src={jestLogo} alt="Jest" height={200} width={200} />
              </div>
            </Technology>
            <Technology
              name="NUnit"
              description="Style Dictionary is a build system that allows you to define styles once, in a way for any platform or language to consume."
              url="https://nunit.org/">
              <div className="h-52 w-52">
                <Image src={nunitLogo} alt="NUnit" height={200} width={200} />
              </div>
            </Technology>
            <Technology
              name="Cypress"
              description="Style Dictionary is a build system that allows you to define styles once, in a way for any platform or language to consume."
              url="https://www.cypress.io/">
              <div className="h-52 w-52">
                <Image
                  src={cypressLogo}
                  alt="Cypress"
                  height={200}
                  width={200}
                />
              </div>
            </Technology>
            <Technology
              name="Test Complete"
              description="Style Dictionary is a build system that allows you to define styles once, in a way for any platform or language to consume."
              url="https://smartbear.com/product/testcomplete/">
              <div className="h-52 w-52">
                <Image
                  src={testCompleteLogo}
                  alt="Test Complete"
                  height={200}
                  width={200}
                />
              </div>
            </Technology>
          </TechnologyGroup>
        </motion.section>
      </div>
      <div ref={hiddenRef} style={{ height: scrollRange }} className="hidden" />
    </div>
  );
}
