"use client";

import { Link } from "@stormstack/core-client-components";
import { Heading } from "@stormstack/design-system-components";
import { motion, useInView } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import AsyncapiLogo from "../../../public/static/images/external-logos/asyncapi-logo.svg";
import DotnetLogo from "../../../public/static/images/external-logos/dotnet-logo.svg";
import GraphQLLogo from "../../../public/static/images/external-logos/graphql-logo.svg";
import KafkaLogo from "../../../public/static/images/external-logos/kafka-logo.svg";
import OpenApiLogo from "../../../public/static/images/external-logos/openapi-logo.svg";
import RabbitMQLogo from "../../../public/static/images/external-logos/rabbitmq-logo.svg";
import ReduxLogo from "../../../public/static/images/external-logos/redux-logo.svg";
// import arrow from "../../../public/static/images/arrow-doodle.png";
import Gear from "../../../public/static/images/gear.svg";

const Types = {
  INITIAL: "initial",
  NONE: "none",
  ASYNC_API: "asyncapi",
  OPEN_API: "openapi",
  GRAPHQL: "graphql"
};

const logoVariants = {
  initial: {
    opacity: 0,
    scale: 0
  },
  none: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1,
      stiffness: 1000
    }
  }
};

const openapiLogoVariants = {
  ...logoVariants,
  asyncapi: {
    opacity: 1,
    scale: 0.8,
    transition: {
      duration: 0.5,
      stiffness: 1000
    }
  },
  openapi: {
    opacity: 1,
    scale: 1.2,
    transition: {
      duration: 0.5,
      stiffness: 1000
    }
  },
  graphql: {
    opacity: 1,
    scale: 0.8,
    transition: {
      duration: 0.5,
      stiffness: 1000
    }
  }
};

const asyncapiLogoVariants = {
  ...logoVariants,
  none: {
    ...logoVariants.none,
    transition: {
      ...logoVariants.none.transition,
      delay: 1
    }
  },
  asyncapi: {
    opacity: 1,
    scale: 1.2,
    transition: {
      duration: 0.5,
      stiffness: 1000
    }
  },
  openapi: {
    opacity: 1,
    scale: 0.8,
    transition: {
      duration: 0.5,
      stiffness: 1000
    }
  },
  graphql: {
    opacity: 1,
    scale: 0.8,
    transition: {
      duration: 0.5,
      stiffness: 1000
    }
  }
};

const graphqlLogoVariants = {
  ...logoVariants,
  none: {
    ...logoVariants.none,
    transition: {
      ...logoVariants.none.transition,
      delay: 2
    }
  },
  asyncapi: {
    opacity: 1,
    scale: 0.8,
    transition: {
      duration: 0.5,
      stiffness: 1000
    }
  },
  openapi: {
    opacity: 1,
    scale: 0.8,
    transition: {
      duration: 0.5,
      stiffness: 1000
    }
  },
  graphql: {
    opacity: 1,
    scale: 1.2,
    transition: {
      duration: 0.5,
      stiffness: 1000
    }
  }
};

const techLogoVariants = {
  opened: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      stiffness: 1000
    }
  },
  closed: {
    opacity: 0,
    scale: 0,
    transition: {
      duration: 0.5,
      stiffness: 1000
    }
  }
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
    <div ref={ref} className="gap-14 flex max-w-[65rem] flex-col items-center">
      <div className="gap-14 flex flex-row items-center">
        <ul className="gap-1 flex flex-col justify-center">
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
            <AsyncapiLogo alt="Async-Api Logo" height={110} />
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
        <div className="gap-3 flex flex-col items-center">
          <div className="h-48 w-48 relative">
            <Gear
              className="right-0 top-0 fill-primary absolute animate-spin-slow"
              height={100}
              width={100}
            />
            <Gear
              className="bottom-0 left-0 fill-primary absolute animate-spin-slow"
              height={115}
              width={115}
            />
          </div>
          {/*<Image src={arrow} alt="Arrow" className="rotate-180" width={300} />*/}
        </div>
        <div className="h-80 w-80 rounded-lg border-4 border-primary relative flex flex-col">
          <div className="gap-2 border-b-4 border-primary p-2 flex flex-row-reverse items-center">
            <div className="h-3 w-3 rounded-full bg-red-600"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-300"></div>
            <div className="h-3 w-3 rounded-full bg-teal-500"></div>
          </div>
          <motion.div
            className="left-8 top-10 z-20 absolute"
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
            className="right-5 top-20 z-20 absolute"
            initial={false}
            variants={techLogoVariants}
            animate={type === Types.ASYNC_API ? "opened" : "closed"}>
            <KafkaLogo className="h-36 w-24" />
          </motion.div>
          <motion.div
            className="bottom-2 left-8 z-20 absolute"
            initial={false}
            variants={techLogoVariants}
            animate={type === Types.ASYNC_API ? "opened" : "closed"}>
            <RabbitMQLogo className="h-36 w-24" />
          </motion.div>
          <motion.div
            className="bottom-4 right-8 z-20 absolute"
            initial={false}
            variants={techLogoVariants}
            animate={
              type === Types.OPEN_API || type === Types.GRAPHQL
                ? "opened"
                : "closed"
            }>
            <ReduxLogo className="h-32 w-32" />
          </motion.div>
          <ul className="z-10 gap-1 p-4 flex flex-col items-start">
            <motion.li
              className="h-2 w-1/2 rounded-xl bg-slate-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 1,
                delay: 0
              }}></motion.li>
            <motion.li
              className="h-2 w-2/3 rounded-xl bg-slate-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 1,
                delay: 1
              }}></motion.li>
            <motion.li
              className="h-2 w-3/4 rounded-xl bg-slate-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 1,
                delay: 2
              }}></motion.li>
            <motion.li
              className="h-2 w-1/4 rounded-xl bg-slate-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 1,
                delay: 3
              }}></motion.li>
            <motion.li
              className="h-2 w-3/4 rounded-xl bg-slate-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 1,
                delay: 3
              }}></motion.li>
            <motion.li
              className="h-2 w-1/2 rounded-xl bg-slate-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 1,
                delay: 4
              }}></motion.li>
            <motion.li
              className="h-2 w-1/2 rounded-xl bg-slate-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 1,
                delay: 5
              }}></motion.li>
            <motion.li
              className="h-2 w-2/3 rounded-xl bg-slate-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 1,
                delay: 6
              }}></motion.li>
            <motion.li
              className="h-2 w-3/4 rounded-xl bg-slate-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 1,
                delay: 7
              }}></motion.li>
            <motion.li
              className="h-2 w-3/4 rounded-xl bg-slate-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 1,
                delay: 8
              }}></motion.li>
            <motion.li
              className="h-2 w-1/2 rounded-xl bg-slate-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 1,
                delay: 9
              }}></motion.li>
            <motion.li
              className="h-2 w-1/4 rounded-xl bg-slate-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 1,
                delay: 10
              }}></motion.li>
            <motion.li
              className="h-2 w-2/3 rounded-xl bg-slate-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 1,
                delay: 11
              }}></motion.li>
            <motion.li
              className="h-2 w-1/3 rounded-xl bg-slate-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 1,
                delay: 12
              }}></motion.li>
            <motion.li
              className="h-2 w-1/4 rounded-xl bg-slate-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 1,
                delay: 13
              }}></motion.li>
            <motion.li
              className="h-2 w-3/4 rounded-xl bg-slate-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 1,
                delay: 14
              }}></motion.li>
            <motion.li
              className="h-2 w-2/4 rounded-xl bg-slate-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 1,
                delay: 15
              }}></motion.li>
            <motion.li
              className="h-2 w-3/4 rounded-xl bg-slate-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 1,
                delay: 16
              }}></motion.li>
          </ul>
        </div>
      </div>
      <Heading level={4} className="text-5xl leading-10">
        Use API contracts to generate code
      </Heading>
      <div className="w-fit gap-20 flex max-w-[65rem] flex-col">
        <div className="gap-5 flex flex-col">
          <p className="text-body-1 font-body-1">
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
