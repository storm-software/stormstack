import Image from "next/image";
import coffee from "../../../../../../assets/coffee.png";
import keyboard from "../../../../../../assets/keyboard.png";
import Monitor from "./monitor";

export default function Introduction() {
  return (
    <section className="flex w-full snap-center snap-always justify-center overflow-hidden">
      <div className="z-10 mx-10 flex w-full flex-col px-10 md:mx-0 lg:w-3/4">
        <div className="flex w-full max-w-[65rem] flex-col">
          <Monitor />
        </div>
        <div className="flex flex-row items-start justify-center gap-10">
          <Image
            src={keyboard}
            alt="Keyboard"
            width={800}
            height={400}
            className="-rotate-6"
          />
          <Image src={coffee} alt="Coffee" width={200} height={300} />
        </div>
      </div>
    </section>
  );
}
