import { BaseComponentProps } from "@open-system/design-system-components";

export default function Alien({ children, className, ...props }: BaseComponentProps) {
  return (
      <div className={className}>
      <div className="relative h-14 w-16">
        <div className="z-60 border-1 absolute bottom-6 left-6 h-14 w-16 -rotate-45 rounded-b-[50%] rounded-l-[10%] rounded-r-[50%] rounded-t-[50%] border-black bg-lime-600">
          <div className="relative h-14 w-16">
            <div className="absolute left-0.5 top-2 h-7 w-6 origin-center -rotate-[30deg] overflow-hidden rounded-br-full rounded-tl-full border-l-4 border-l-green-800 bg-black before:absolute before:left-1/2 before:top-0 before:h-20 before:w-20 before:animate-blink-eye before:rounded-full before:bg-lime-900 before:transition-all before:content-[''] after:absolute after:bottom-0 after:right-1/2 after:h-20 after:w-20 after:animate-blink-eye after:rounded-full after:bg-lime-900 after:transition-all after:content-[''] group-hover:before:scale-150 group-hover:after:scale-150"></div>
            <div className="absolute right-[1.15rem] top-[1.9rem] h-7 w-6 origin-center rotate-[47deg] overflow-hidden rounded-br-full rounded-tl-full border-b-4 border-b-green-800 bg-black before:absolute before:left-1/2 before:top-0 before:h-20 before:w-20 before:animate-blink-eye before:rounded-full before:bg-lime-900 before:transition-all before:content-[''] after:absolute after:bottom-0 after:right-1/2 after:h-20 after:w-20 after:animate-blink-eye after:rounded-full after:bg-lime-900 after:transition-all after:content-[''] group-hover:before:scale-150 group-hover:after:scale-150"></div>

            <div className="absolute left-[5px] top-[2.9rem] rotate-[50deg]">
            <div className="h-px w-2 animate-taunt rounded-l-full rounded-r-full bg-black"></div>
         
            </div>
          </div>
        </div>
      </div>
      </div>
  );
}
