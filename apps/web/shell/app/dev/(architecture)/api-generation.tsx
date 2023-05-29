"use client";

import { Heading } from "@open-system/design-system-components";
import { Link } from "@open-system/shared-ui-components/link";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import asyncapiLogo from "../../../../../../assets/external-logos/asyncapi-logo.png";
import DotnetLogo from "../../../../../../assets/external-logos/dotnet-logo.svg";
import GraphQLLogo from "../../../../../../assets/external-logos/graphql-logo.svg";
import KafkaLogo from "../../../../../../assets/external-logos/kafka-logo.svg";
import OpenApiLogo from "../../../../../../assets/external-logos/openapi-logo.svg";
import RabbitMQLogo from "../../../../../../assets/external-logos/rabbitmq-logo.svg";
import ReduxLogo from "../../../../../../assets/external-logos/redux-logo.svg";
import arrow from "../../../public/arrow-doodle.png";
import Gear from "../../../public/gear.svg";

const Types = {
  INITIAL: "initial",
  NONE: "none",
  ASYNC_API: "asyncapi",
  OPEN_API: "openapi",
  GRAPHQL: "graphql",
};

const logoVariants = {
  initial: {
    opacity: 0,
    scale: 0,
  },
  none: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1,
      stiffness: 1000,
    },
  },
};

const openapiLogoVariants = {
  ...logoVariants,
  asyncapi: {
    opacity: 1,
    scale: 0.8,
    transition: {
      duration: 0.5,
      stiffness: 1000,
    },
  },
  openapi: {
    opacity: 1,
    scale: 1.2,
    transition: {
      duration: 0.5,
      stiffness: 1000,
    },
  },
  graphql: {
    opacity: 1,
    scale: 0.8,
    transition: {
      duration: 0.5,
      stiffness: 1000,
    },
  },
};

const asyncapiLogoVariants = {
  ...logoVariants,
  none: {
    ...logoVariants.none,
    transition: {
      ...logoVariants.none.transition,
      delay: 1,
    },
  },
  asyncapi: {
    opacity: 1,
    scale: 1.2,
    transition: {
      duration: 0.5,
      stiffness: 1000,
    },
  },
  openapi: {
    opacity: 1,
    scale: 0.8,
    transition: {
      duration: 0.5,
      stiffness: 1000,
    },
  },
  graphql: {
    opacity: 1,
    scale: 0.8,
    transition: {
      duration: 0.5,
      stiffness: 1000,
    },
  },
};

const graphqlLogoVariants = {
  ...logoVariants,
  none: {
    ...logoVariants.none,
    transition: {
      ...logoVariants.none.transition,
      delay: 2,
    },
  },
  asyncapi: {
    opacity: 1,
    scale: 0.8,
    transition: {
      duration: 0.5,
      stiffness: 1000,
    },
  },
  openapi: {
    opacity: 1,
    scale: 0.8,
    transition: {
      duration: 0.5,
      stiffness: 1000,
    },
  },
  graphql: {
    opacity: 1,
    scale: 1.2,
    transition: {
      duration: 0.5,
      stiffness: 1000,
    },
  },
};

const techLogoVariants = {
  opened: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      stiffness: 1000,
    },
  },
  closed: {
    opacity: 0,
    scale: 0,
    transition: {
      duration: 0.5,
      stiffness: 1000,
    },
  },
};

export default function ApiGeneration() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  const [type, setType] = useState<string>(Types.INITIAL);
  useEffect(() => {
    isInView ? setType(Types.NONE) : setType(Types.INITIAL);
  }, [isInView]);

  const toggleAsyncApi = useCallback(() => {
    setType(type === Types.ASYNC_API ? Types.NONE : Types.ASYNC_API);
  }, [type]);
  const toggleOpenApi = useCallback(() => {
    setType(type === Types.OPEN_API ? Types.NONE : Types.OPEN_API);
  }, [type]);
  const toggleGraphQL = useCallback(() => {
    setType(type === Types.GRAPHQL ? Types.NONE : Types.GRAPHQL);
  }, [type]);

  return (
    <div ref={ref} className="flex max-w-[65rem] flex-col items-center gap-14">
      <div className="flex flex-row items-center gap-14">
        <ul className="flex flex-col justify-center gap-1">
          <motion.li
            className="cursor-pointer"
            onClick={toggleOpenApi}
            onHoverStart={toggleOpenApi}
            onHoverEnd={toggleOpenApi}
            variants={openapiLogoVariants}
            animate={type}>
            <OpenApiLogo alt="Open-Api Logo" height={130} />
          </motion.li>
          <motion.li
            className="cursor-pointer"
            onClick={toggleAsyncApi}
            onHoverStart={toggleAsyncApi}
            onHoverEnd={toggleAsyncApi}
            variants={asyncapiLogoVariants}
            animate={type}>
            <Image src={asyncapiLogo} alt="Async-API" height={110} />
          </motion.li>
          <motion.li
            className="cursor-pointer"
            onClick={toggleGraphQL}
            onHoverStart={toggleGraphQL}
            onHoverEnd={toggleGraphQL}
            variants={graphqlLogoVariants}
            animate={type}>
            <GraphQLLogo alt="GraphQL Logo" height={130} />
          </motion.li>
        </ul>
        <div className="flex flex-col items-center gap-3">
          <div className="relative h-48 w-48">
            <Gear
              className="absolute top-0 right-0 animate-spin-slow fill-primary"
              height={100}
              width={100}
            />
            <Gear
              className="absolute bottom-0 left-0 animate-spin-slow fill-primary"
              height={115}
              width={115}
            />
          </div>
          <Image src={arrow} alt="Arrow" className="rotate-180" width={300} />
        </div>
        <div className="relative flex h-80 w-80 flex-col rounded-lg border-4 border-primary">
          <div className="flex flex-row-reverse items-center gap-2 border-b-4 border-primary p-2">
            <div className="h-3 w-3 rounded-full bg-red-600"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-300"></div>
            <div className="h-3 w-3 rounded-full bg-teal-500"></div>
          </div>
          <motion.div
            className="absolute top-10 left-8 z-20"
            initial={false}
            variants={techLogoVariants}
            animate={
              type === Types.ASYNC_API ||
              type === Types.OPEN_API ||
              type === Types.GRAPHQL
                ? "opened"
                : "closed"
            }>
            <DotnetLogo className="h-32 w-32" />
          </motion.div>
          <motion.div
            className="absolute top-20 right-5 z-20"
            initial={false}
            variants={techLogoVariants}
            animate={type === Types.ASYNC_API ? "opened" : "closed"}>
            <KafkaLogo className="h-36 w-24" />
          </motion.div>
          <motion.div
            className="absolute bottom-2 left-8 z-20"
            initial={false}
            variants={techLogoVariants}
            animate={type === Types.ASYNC_API ? "opened" : "closed"}>
            <RabbitMQLogo className="h-36 w-24" />
          </motion.div>
          <motion.div
            className="absolute bottom-4 right-8 z-20"
            initial={false}
            variants={techLogoVariants}
            animate={
              type === Types.OPEN_API || type === Types.GRAPHQL
                ? "opened"
                : "closed"
            }>
            <ReduxLogo className="h-32 w-32" />
          </motion.div>
          <ul className="z-10 flex flex-col items-start gap-1 p-4">
            <motion.li
              className="h-2 w-1/2 rounded-xl bg-slate-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 1,
                delay: 0,
              }}></motion.li>
            <motion.li
              className="h-2 w-2/3 rounded-xl bg-slate-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 1,
                delay: 1,
              }}></motion.li>
            <motion.li
              className="h-2 w-3/4 rounded-xl bg-slate-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 1,
                delay: 2,
              }}></motion.li>
            <motion.li
              className="h-2 w-1/4 rounded-xl bg-slate-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 1,
                delay: 3,
              }}></motion.li>
            <motion.li
              className="h-2 w-3/4 rounded-xl bg-slate-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 1,
                delay: 3,
              }}></motion.li>
            <motion.li
              className="h-2 w-1/2 rounded-xl bg-slate-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 1,
                delay: 4,
              }}></motion.li>
            <motion.li
              className="h-2 w-1/2 rounded-xl bg-slate-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 1,
                delay: 5,
              }}></motion.li>
            <motion.li
              className="h-2 w-2/3 rounded-xl bg-slate-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 1,
                delay: 6,
              }}></motion.li>
            <motion.li
              className="h-2 w-3/4 rounded-xl bg-slate-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 1,
                delay: 7,
              }}></motion.li>
            <motion.li
              className="h-2 w-3/4 rounded-xl bg-slate-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 1,
                delay: 8,
              }}></motion.li>
            <motion.li
              className="h-2 w-1/2 rounded-xl bg-slate-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 1,
                delay: 9,
              }}></motion.li>
            <motion.li
              className="h-2 w-1/4 rounded-xl bg-slate-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 1,
                delay: 10,
              }}></motion.li>
            <motion.li
              className="h-2 w-2/3 rounded-xl bg-slate-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 1,
                delay: 11,
              }}></motion.li>
            <motion.li
              className="h-2 w-1/3 rounded-xl bg-slate-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 1,
                delay: 12,
              }}></motion.li>
            <motion.li
              className="h-2 w-1/4 rounded-xl bg-slate-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 1,
                delay: 13,
              }}></motion.li>
            <motion.li
              className="h-2 w-3/4 rounded-xl bg-slate-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 1,
                delay: 14,
              }}></motion.li>
            <motion.li
              className="h-2 w-2/4 rounded-xl bg-slate-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 1,
                delay: 15,
              }}></motion.li>
            <motion.li
              className="h-2 w-3/4 rounded-xl bg-slate-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 1,
                delay: 16,
              }}></motion.li>
          </ul>
        </div>
      </div>
      <Heading level={4} className="text-5xl leading-10">
        Use API contracts to generate code
      </Heading>
      <div className="flex w-fit max-w-[65rem] flex-col gap-20">
        <div className="flex flex-col gap-5">
          <p className="font-body-1 text-body-1">
            I&apos;ve created{" "}
            <Link href="https://micro-frontends.org/" inNewTab={true}>
              custom tools
            </Link>{" "}
            that convert JSON/YAML API contracts into REST API controllers,
            GraphQL end points, RabbitMQ or Kafka queue publishers/consumers,
            Redux-Query API reducers, and .NET Core CQRS code.
          </p>
        </div>
      </div>
    </div>
  );
}
