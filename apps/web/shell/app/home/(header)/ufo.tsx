import { BaseComponentProps } from "@open-system/design-system-components";
import Alien from "./alien";

export default function Ufo({ children, ...props }: BaseComponentProps) {
  return (
    <div className="group relative z-content-low h-96 w-72 origin-center">
      <Alien className="absolute left-[6rem] top-[2.5rem] z-20" />
      <div className="absolute left-7 top-0 z-30 h-40 w-60 rounded-b-lg rounded-t-full border-2 border-black bg-gradient-to-br from-sky-500/100 via-sky-500/10 to-sky-300/10 bg-[length:100%_100%]"></div>

      <div className="absolute left-0 top-[2.6rem] z-50 h-72 w-72 origin-center rotate-45 overflow-hidden rounded-br-full rounded-tl-full border-2 border-black bg-gradient-to-r from-slate-500 via-slate-900 to-slate-800 bg-[length:100%_100%]">
        <div className="relative w-full h-full">

        <div className="absolute left-0 right-0 w-full top-1/2 border-b-black border-b-2 rounded-b-full z-[999] -rotate-45 origin-center"></div>

          <div className="absolute h-6 w-6 left-1 top-32 bg-red-800 z-[999] rounded-full"></div>
        </div>



      </div>

    </div>
  );
}
