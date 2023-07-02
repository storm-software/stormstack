"use client";

import { motion } from "framer-motion";
import Coffee from "../../../public/static/images/coffee.svg";
import Keyboard from "../../../public/static/images/keyboard.svg";
import Monitor from "./monitor";

export default function Introduction() {
  return (
    <section className="z-content-high flex w-full snap-center snap-always justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.75, duration: 1.5 }}
        className="z-10 mx-10 flex w-full flex-col px-10 md:mx-0 lg:w-3/4">
        <div className="flex w-full max-w-[65rem] flex-col">
          <Monitor />
        </div>
        <div className="flex flex-row items-start justify-center gap-10">
          <Keyboard
            alt="Keyboard"
            height={350}
            width={800}
            className="-rotate-6"
          />
          <Coffee alt="Coffee" height={550} width={200} />
        </div>
      </motion.div>
    </section>
  );
}
