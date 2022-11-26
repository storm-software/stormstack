"use client";

export interface StackLayerProps {
  label: string;
}

export default function StackLayer({ label, ...props }: StackLayerProps) {
  return (
    <div className="h-0 w-0">
      <div className="z-20 h-[350px] w-[40px] origin-[0%_0%] rotate-90 -skew-x-[30deg] scale-y-[0.864] border-2 border-slate-900 bg-teal-500"></div>
      <div className="relative bottom-[350px] z-20 h-[40px] w-[350px] origin-[0%_0%] -rotate-[30deg] -skew-x-[30deg] scale-y-[0.864] border-2 border-slate-900 bg-teal-600"></div>
      <div className="relative bottom-[370px] z-10 h-[0px] w-[550px] origin-[0%_0%] -rotate-[30deg] -skew-x-[30deg] scale-y-[0.864]">
        <div className="absolute -right-36 w-full rotate-[26deg] skew-x-[26deg] text-2xl">
          <div className="hover:text-active-yellow flex h-16 cursor-pointer items-center justify-end bg-gradient-to-l from-teal-500 via-teal-500/25 to-transparent pr-8 font-header-3 text-3xl text-primary transition-all hover:scale-x-150 hover:scale-y-105 hover:text-4xl hover:shadow-active-glow">
            <label className="cursor-pointer">{label}</label>
          </div>
        </div>
      </div>
      <div className="relative bottom-[390px] z-20 h-[350px] w-[350px] origin-[0%_0%] rotate-[210deg] -skew-x-[30deg] scale-y-[0.864] border-2 border-slate-900 bg-teal-400"></div>
    </div>
  );
}
