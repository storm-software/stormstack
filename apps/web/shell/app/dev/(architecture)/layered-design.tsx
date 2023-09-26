"use client";

import { Link } from "@stormstack/core-client-components";
import { Heading } from "@stormstack/design-system-components";
import clsx from "clsx";
import { motion, useInView } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const Layers = {
  INITIAL: "initial",
  NONE: "none",
  INFRASTRUCTURE: "infrastructure",
  APPLICATION: "application",
  DOMAIN: "domain"
};

const layerVariants = {
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

const infrastructureLayerVariants = {
  ...layerVariants,
  infrastructure: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.5,
      stiffness: 1000,
      velocity: -100
    }
  },
  application: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      stiffness: 1000
    }
  },
  domain: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      stiffness: 1000
    }
  }
};

const applicationLayerVariants = {
  ...layerVariants,
  none: {
    ...layerVariants.none,
    transition: {
      ...layerVariants.none.transition,
      delay: 1
    }
  },
  infrastructure: {
    opacity: 1,
    scale: 0.4,
    transition: {
      duration: 0.5,
      stiffness: 1000
    }
  },
  application: {
    opacity: 1,
    scale: 1.2,
    transition: {
      duration: 1.5,
      stiffness: 1000,
      velocity: -100
    }
  },
  domain: {
    opacity: 1,
    scale: 1.2,
    transition: {
      duration: 0.5,
      stiffness: 1000
    }
  }
};

const domainLayerVariants = {
  ...layerVariants,
  none: {
    ...layerVariants.none,
    transition: {
      ...layerVariants.none.transition,
      delay: 2
    }
  },
  infrastructure: {
    opacity: 1,
    scale: 0.8,
    transition: {
      duration: 0.5,
      stiffness: 1000
    }
  },
  application: {
    opacity: 1,
    scale: 0.3,
    transition: {
      duration: 0.5,
      stiffness: 1000
    }
  },
  domain: {
    opacity: 1,
    scale: 1.4,
    transition: {
      duration: 1.5,
      stiffness: 1000,
      velocity: -100
    }
  }
};

const layerHeadingVariants = {
  initial: {
    opacity: 0,
    scale: 0
  },
  none: {
    opacity: 1,
    scale: 1,
    fontSize: 36,
    transition: {
      duration: 1,
      stiffness: 1000
    }
  }
};

const infrastructureLayerHeadingVariants = {
  ...layerHeadingVariants,
  infrastructure: {
    opacity: 1,
    fontSize: "48px",
    transition: {
      duration: 1.5,
      stiffness: 1000,
      velocity: -100
    }
  },
  application: {
    opacity: 1,
    fontSize: "36px",
    transition: {
      duration: 0.5,
      stiffness: 1000
    }
  },
  domain: {
    opacity: 1,
    fontSize: "36px",
    transition: {
      duration: 0.5,
      stiffness: 1000
    }
  }
};

const applicationLayerHeadingVariants = {
  ...layerHeadingVariants,
  none: {
    ...layerHeadingVariants.none,
    transition: {
      ...layerHeadingVariants.none.transition,
      delay: 1
    }
  },
  infrastructure: {
    opacity: 1,
    fontSize: "36px",
    transition: {
      duration: 0.5,
      stiffness: 1000
    }
  },
  application: {
    opacity: 1,
    fontSize: "48px",
    transition: {
      duration: 1.5,
      stiffness: 1000,
      velocity: -100
    }
  },
  domain: {
    opacity: 1,
    fontSize: "36px",
    transition: {
      duration: 0.5,
      stiffness: 1000
    }
  }
};

const domainLayerHeadingVariants = {
  ...layerHeadingVariants,
  none: {
    ...layerHeadingVariants.none,
    transition: {
      ...layerHeadingVariants.none.transition,
      delay: 2
    }
  },
  infrastructure: {
    opacity: 1,
    fontSize: "36px",
    transition: {
      duration: 0.5,
      stiffness: 1000
    }
  },
  application: {
    opacity: 1,
    fontSize: "36px",
    transition: {
      duration: 0.5,
      stiffness: 1000
    }
  },
  domain: {
    opacity: 1,
    fontSize: "48px",
    transition: {
      duration: 1.5,
      stiffness: 1000,
      velocity: -100
    }
  }
};

const layerBodyVariants = {
  opened: {
    opacity: 1,
    scale: 1,
    height: "fit-content",
    transition: {
      duration: 1.5,
      stiffness: 1000,
      velocity: -100
    }
  },
  closed: {
    opacity: 0,
    scale: 0,
    height: 0,
    transition: {
      stiffness: 1000
    }
  }
};

export default function LayeredDesign() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  const [layer, setLayer] = useState<string>(Layers.INITIAL);
  useEffect(() => {
    isInView ? setLayer(Layers.NONE) : setLayer(Layers.INITIAL);
  }, [isInView]);

  const handleInfrastructureClick = useCallback(() => {
    setLayer(Layers.INFRASTRUCTURE);
  }, []);
  const handleApplicationClick = useCallback(() => {
    setLayer(Layers.APPLICATION);
  }, []);
  const handleDomainClick = useCallback(() => {
    setLayer(Layers.DOMAIN);
  }, []);

  return (
    <div className="w-full gap-20 flex max-w-[65rem] flex-col items-center justify-center">
      <Heading level={4} className="text-5xl leading-10">
        Clearly define the code structure
      </Heading>

      <div ref={ref} className="w-fit gap-10 flex flex-row items-center">
        <div className="w-fit">
          <motion.div
            className={clsx(
              "transition-color h-96 w-96 rounded-full bg-secondary flex items-center justify-center",
              { "border-8 border-highlight-1": layer === Layers.INFRASTRUCTURE }
            )}
            variants={infrastructureLayerVariants}
            animate={layer}>
            <motion.div
              className={clsx(
                "transition-color h-72 w-72 rounded-full bg-tertiary flex items-center justify-center",
                { "border-8 border-highlight-1": layer === Layers.APPLICATION }
              )}
              variants={applicationLayerVariants}
              animate={layer}>
              <motion.div
                className={clsx(
                  "transition-color h-44 w-44 rounded-full bg-quaternary flex items-center justify-center",
                  {
                    "border-8 border-highlight-1": layer === Layers.DOMAIN
                  }
                )}
                variants={domainLayerVariants}
                animate={layer}></motion.div>
            </motion.div>
          </motion.div>
        </div>
        <motion.div layout className="h-fit w-fit gap-6 flex flex-col">
          <div className="h-fit gap-3 flex flex-col">
            <motion.div
              className="transition-color text-4xl text-secondary hover:cursor-pointer hover:text-highlight-1 font-label-4 hover:underline"
              onClick={handleInfrastructureClick}
              variants={infrastructureLayerHeadingVariants}
              animate={layer}>
              Infrastructure
            </motion.div>
            <motion.div
              initial={false}
              variants={layerBodyVariants}
              animate={layer === Layers.INFRASTRUCTURE ? "opened" : "closed"}>
              <p className="text-body-1 font-body-1">
                That convert JSON/YAML API contracts into REST API controllers,
                GraphQL end points, RabbitMQ or Kafka queue
                publishers/consumers, Redux-Query API reducers, and .NET Core
                CQRS code.
              </p>
            </motion.div>
          </div>
          <div className="h-fit gap-3 flex flex-col">
            <motion.div
              className="transition-color text-4xl text-tertiary hover:cursor-pointer hover:text-highlight-1 font-label-4 hover:underline"
              onClick={handleApplicationClick}
              variants={applicationLayerHeadingVariants}
              animate={layer}>
              Application
            </motion.div>
            <motion.div
              initial={false}
              variants={layerBodyVariants}
              animate={layer === Layers.APPLICATION ? "opened" : "closed"}>
              <p className="text-body-1 font-body-1">
                That convert JSON/YAML API contracts into REST API controllers,
                GraphQL end points, RabbitMQ or Kafka queue
                publishers/consumers, Redux-Query API reducers, and .NET Core
                CQRS code.
              </p>
            </motion.div>
          </div>
          <div className="h-fit gap-3 flex flex-col">
            <motion.div
              className="transition-color text-4xl text-quaternary hover:cursor-pointer hover:text-highlight-1 font-label-4 hover:underline"
              onClick={handleDomainClick}
              variants={domainLayerHeadingVariants}
              animate={layer}>
              Domain
            </motion.div>
            <motion.div
              initial={false}
              variants={layerBodyVariants}
              animate={layer === Layers.DOMAIN ? "opened" : "closed"}>
              <p className="text-body-1 font-body-1">
                That convert JSON/YAML API contracts into REST API controllers,
                GraphQL end points, RabbitMQ or Kafka queue
                publishers/consumers, Redux-Query API reducers, and .NET Core
                CQRS code.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <p className="text-body-1 font-body-1">
        Using a{" "}
        <Link
          href="https://cardoai.com/what-is-hexagonal-architecture-should-you-use-it/"
          inNewTab={true}>
          layered/hexagonal design
        </Link>{" "}
        will generally enforce a separation of concerns by default and makes
        future code updates much more simple.
      </p>
    </div>
  );
}
