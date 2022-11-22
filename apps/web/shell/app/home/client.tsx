"use client";

import { ArrowDownIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import Logo from "../../../../../assets/box-logo-gradient.svg";
import Introduction from "./introduction";

export default function Client() {
  return (
    <div>
      <motion.div
        className="fixed -left-16 -bottom-16 h-52 w-52 rounded-full border-4 border-secondary"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 1,
          ease: [0, 0.71, 0.2, 1.01],
        }}>
        <div className="flex h-full w-full items-center justify-center">
          <ArrowDownIcon className="h-12 w-12 animate-bounce fill-secondary" />
        </div>
      </motion.div>

      <div className="flex snap-both snap-mandatory flex-col gap-60 scroll-smooth">
        <section className="flex snap-center snap-always justify-center">
          <div className="relative h-[38rem] max-w-[65rem] md:w-3/4 lg:w-2/3">
            <div className="absolute bottom-0 left-0">
              <div className="flex flex-col gap-3">
                <span className="w-fit bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-[length:100%_6px] bg-bottom bg-no-repeat transition-[background-size] hover:bg-[length:100%_40%]">
                  <h1 className="font-app-title-1 text-7xl leading-none text-primary shadow-white drop-shadow-2xl">
                    Patrick
                  </h1>
                </span>

                <span className="w-fit bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-[length:100%_6px] bg-bottom bg-no-repeat transition-[background-size] hover:bg-[length:100%_40%]">
                  <h1 className="font-app-title-1 text-7xl leading-none text-primary shadow-white drop-shadow-2xl">
                    Sullivan
                  </h1>
                </span>

                <span className="w-fit bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-[length:100%_6px] bg-bottom bg-no-repeat transition-[background-size] hover:bg-[length:100%_40%]">
                  <h1 className="font-app-title-1 text-7xl leading-none text-primary shadow-white drop-shadow-2xl">
                    Development
                  </h1>
                </span>
              </div>
            </div>

            <div className="absolute top-0 right-0">
              <Logo alt="box-logo" />
            </div>
          </div>
        </section>

        <section className="flex snap-center snap-always justify-center">
          <div className="relative h-[38rem] max-w-[65rem] md:w-3/4 lg:w-2/3">
            <div className="absolute bottom-0 left-0">
              <div className="flex flex-col gap-3">
                <span className="w-fit bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-[length:100%_6px] bg-bottom bg-no-repeat transition-[background-size] hover:bg-[length:100%_40%]">
                  <h1 className="font-app-title-1 text-7xl leading-none text-primary shadow-white drop-shadow-2xl">
                    Patrick
                  </h1>
                </span>

                <span className="w-fit bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-[length:100%_6px] bg-bottom bg-no-repeat transition-[background-size] hover:bg-[length:100%_40%]">
                  <h1 className="font-app-title-1 text-7xl leading-none text-primary shadow-white drop-shadow-2xl">
                    Sullivan
                  </h1>
                </span>

                <span className="w-fit bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-[length:100%_6px] bg-bottom bg-no-repeat transition-[background-size] hover:bg-[length:100%_40%]">
                  <h1 className="font-app-title-1 text-7xl leading-none text-primary shadow-white drop-shadow-2xl">
                    Development
                  </h1>
                </span>
              </div>
            </div>

            <div className="absolute top-0 right-0">
              <Logo alt="box-logo" />
            </div>
          </div>
        </section>

        <Introduction />

        <section className="flex snap-center snap-always justify-center">
          <div className="relative h-[38rem] max-w-[65rem] md:w-3/4 lg:w-2/3">
            <div className="absolute bottom-0 left-0">
              <div className="flex flex-col gap-3">
                <span className="w-fit bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-[length:100%_6px] bg-bottom bg-no-repeat transition-[background-size] hover:bg-[length:100%_40%]">
                  <h1 className="font-app-title-1 text-7xl leading-none text-primary shadow-white drop-shadow-2xl">
                    Patrick
                  </h1>
                </span>

                <span className="w-fit bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-[length:100%_6px] bg-bottom bg-no-repeat transition-[background-size] hover:bg-[length:100%_40%]">
                  <h1 className="font-app-title-1 text-7xl leading-none text-primary shadow-white drop-shadow-2xl">
                    Sullivan
                  </h1>
                </span>

                <span className="w-fit bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-[length:100%_6px] bg-bottom bg-no-repeat transition-[background-size] hover:bg-[length:100%_40%]">
                  <h1 className="font-app-title-1 text-7xl leading-none text-primary shadow-white drop-shadow-2xl">
                    Development
                  </h1>
                </span>
              </div>
            </div>

            <div className="absolute top-0 right-0">
              <Logo alt="box-logo" />
            </div>
          </div>
        </section>

        <section className="flex snap-center snap-always justify-center">
          <div className="relative h-[38rem] max-w-[65rem] md:w-3/4 lg:w-2/3">
            <div className="absolute bottom-0 left-0">
              <div className="flex flex-col gap-3">
                <span className="w-fit bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-[length:100%_6px] bg-bottom bg-no-repeat transition-[background-size] hover:bg-[length:100%_40%]">
                  <h1 className="font-app-title-1 text-7xl leading-none text-primary shadow-white drop-shadow-2xl">
                    Patrick
                  </h1>
                </span>

                <span className="w-fit bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-[length:100%_6px] bg-bottom bg-no-repeat transition-[background-size] hover:bg-[length:100%_40%]">
                  <h1 className="font-app-title-1 text-7xl leading-none text-primary shadow-white drop-shadow-2xl">
                    Sullivan
                  </h1>
                </span>

                <span className="w-fit bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-[length:100%_6px] bg-bottom bg-no-repeat transition-[background-size] hover:bg-[length:100%_40%]">
                  <h1 className="font-app-title-1 text-7xl leading-none text-primary shadow-white drop-shadow-2xl">
                    Development
                  </h1>
                </span>
              </div>
            </div>

            <div className="absolute top-0 right-0">
              <Logo alt="box-logo" />
            </div>
          </div>
        </section>
      </div>

      <div className="space-y-10 text-white"></div>
    </div>
  );
}
